import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

const secrets = new k8s.core.v1.Secret("doc-project-secret", {
  metadata: {
    name: "doc-project-secret",
  },
  stringData: {
    DATABASE_URL: config.requireSecret("dbUrl"),
    POSTGRES_PASSWORD: config.requireSecret("dbPassword"),
    BETTER_AUTH_SECRET: config.requireSecret("betterAuthSecret"),
    GITHUB_CLIENT_ID: config.requireSecret("githubClientId"),
    GITHUB_CLIENT_SECRET: config.requireSecret("githubClientSecret"),
  },
});

const dbLabels = { app: "postgres" };
const dbDeployment = new k8s.apps.v1.Deployment("postgres", {
  metadata: {
    name: "postgres",
  },
  spec: {
    selector: { matchLabels: dbLabels },
    replicas: 1,
    template: {
      metadata: { labels: dbLabels },
      spec: {
        containers: [
          {
            name: "postgres",
            image: "postgres:14.23-alpine3.23",
            ports: [
              {
                containerPort: 5432,
              },
            ],
            env: [
              {
                name: "POSTGRES_USER",
                value: "postgres",
              },
              {
                name: "POSTGRES_DB",
                value: "dev",
              },
              {
                name: "POSTGRES_PASSWORD",
                valueFrom: {
                  secretKeyRef: {
                    name: "doc-project-secret",
                    key: "POSTGRES_PASSWORD",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  },
});

const migrationJob = new k8s.batch.v1.Job(
  "doc-project-migrate",
  {
    metadata: {
      name: "doc-project-migrate",
    },
    spec: {
      template: {
        spec: {
          restartPolicy: "Never",
          containers: [
            {
              name: "migration",
              image: "doc-project:migration-latest",
              imagePullPolicy: "Never",
              env: [
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: "doc-project-secret",
                      key: "DATABASE_URL",
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
  },
  { dependsOn: [dbDeployment] },
);

const appLabels = { app: "doc-project" };
const appDeployment = new k8s.apps.v1.Deployment(
  "doc-project",
  {
    metadata: {
      name: "doc-project",
    },
    spec: {
      selector: { matchLabels: appLabels },
      replicas: 1,
      template: {
        metadata: { labels: appLabels },
        spec: {
          containers: [
            {
              name: "doc-project",
              image: "doc-project:runner-latest",
              imagePullPolicy: "Never",
              ports: [
                {
                  containerPort: 3000,
                },
              ],
              env: [
                {
                  name: "BETTER_AUTH_URL",
                  value: "http://project.dev.test:30000",
                },
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: "doc-project-secret",
                      key: "DATABASE_URL",
                    },
                  },
                },
                {
                  name: "BETTER_AUTH_SECRET",
                  valueFrom: {
                    secretKeyRef: {
                      name: "doc-project-secret",
                      key: "BETTER_AUTH_SECRET",
                    },
                  },
                },
                {
                  name: "GITHUB_CLIENT_ID",
                  valueFrom: {
                    secretKeyRef: {
                      name: "doc-project-secret",
                      key: "GITHUB_CLIENT_ID",
                    },
                  },
                },
                {
                  name: "GITHUB_CLIENT_SECRET",
                  valueFrom: {
                    secretKeyRef: {
                      name: "doc-project-secret",
                      key: "GITHUB_CLIENT_SECRET",
                    },
                  },
                },
              ],
              resources: {
                requests: {
                  cpu: "100m",
                  memory: "128Mi",
                },
                limits: {
                  cpu: "500m",
                  memory: "512Mi",
                },
              },
            },
          ],
        },
      },
    },
  },
  { dependsOn: [migrationJob] },
);

const appService = new k8s.core.v1.Service("doc-project", {
  metadata: {
    name: "doc-project",
  },
  spec: {
    selector: appLabels,
    type: "ClusterIP",
    ports: [
      {
        protocol: "TCP",
        port: 80,
        targetPort: 3000,
      },
    ],
  },
});

const dbService = new k8s.core.v1.Service("postgres", {
  metadata: {
    name: "postgres",
  },
  spec: {
    selector: dbLabels,
    type: "ClusterIP",
    ports: [
      {
        protocol: "TCP",
        port: 5432,
        targetPort: 5432,
      },
    ],
  },
});

const traefik = new k8s.helm.v3.Chart("traefik", {
  chart: "traefik",
  fetchOpts: {
    repo: "https://traefik.github.io/charts",
  },
  values: {
    ingressClass: {
      enabled: true,
    },
    ports: {
      web: {
        nodePort: 30000,
      },
    },
    providers: {
      kubernetesIngress: {
        enabled: true,
      },
    },
    gateway: {
      enabled: false,
    },
    api: {
      dashboard: false,
    },
    service: {
      spec: {
        // override default of LoadBalancer
        type: "NodePort",
      },
    },
    accessLog: {
      enabled: true,
    },
  },
});

// Pulumi will stall waiting on status.loadBalancer.ingress regardless of
// traefik's service type since minikube doesn't have a loadBalancer impl.
// `minikube tunnel` does not provide a consistent ip so NodePort is better for
// local dev.
const appIngress = new k8s.networking.v1.Ingress(
  "doc-project",
  {
    metadata: {
      name: "doc-project",
    },
    spec: {
      ingressClassName: "traefik",
      rules: [
        {
          host: "project.dev.test",
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: "doc-project",
                    port: {
                      number: 80,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    dependsOn: appService,
  },
);
