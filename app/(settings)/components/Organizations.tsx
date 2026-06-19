import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Organizations() {
  const { user } = await requireAuth();
  const organizations = await prisma.organization.findMany({
    where: {
      organizationMembers: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      organizationMembers: true,
    },
  });

  return (
    <div>
      {organizations.length > 0 ? (
        <table className="table-auto w-full text-left">
          <thead className="w-full">
            <tr>
              <th>Organization</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {organizations.map((org) => (
              <tr key={org.id}>
                <td className="truncate max-w-px">{org.name}</td>
                <td className="truncate max-w-px">
                  {org.organizationMembers[0]?.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">N/A</p>
      )}
    </div>
  );
}
