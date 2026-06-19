# source: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile.bun
FROM oven/bun:1.3.14-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --no-save --frozen-lockfile


FROM oven/bun:1.3.14-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bunx prisma generate
RUN bun run build


FROM oven/bun:1.3.14-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown bun:bun .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

# Persist the fetch cache generated during the build so that
# cached responses are available immediately on startup
COPY --from=builder --chown=bun:bun /app/.next/cache ./.next/cache

# Switch to non-root user for security best practices
USER bun

EXPOSE 3000

# Start Next.js standalone server with Bun
CMD ["bun", "server.js"]