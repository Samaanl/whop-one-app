import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  // The headers contains the user token
  const headersList = await headers();

  // The companyId is a path param
  const { companyId } = await params;

  // The user token is in the headers
  const { userId } = await whopSdk.verifyUserToken(headersList);

  const result = await whopSdk.access.checkIfUserHasAccessToCompany({
    userId,
    companyId,
  });

  const user = await whopSdk.users.getUser({ userId });
  const company = await whopSdk.companies.getCompany({ companyId });

  // Either: 'admin' | 'no_access';
  // 'admin' means the user is an admin of the company, such as an owner or moderator
  // 'no_access' means the user is not an authorized member of the company
  const { accessLevel } = result;

  return (
    <div className="flex justify-center items-center min-h-screen px-8 py-12">
      <div className="max-w-2xl w-full">
        {/* Under Development Notice */}
        <div className="glass rounded-2xl p-8 mb-8 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-50/95 to-orange-50/95">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-2xl">🚧</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard Under Development
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                This page is currently under construction. The admin dashboard
                for managing daily drops is available at{" "}
                <strong className="text-purple-700">/admin</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="glass rounded-2xl p-8 border border-white/40">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Company Access Information
          </h1>
          <div className="space-y-4 text-lg text-gray-800">
            <p>
              Hi <strong className="text-gray-900">{user.name}</strong>, you{" "}
              <strong className="text-gray-900">
                {result.hasAccess ? "have" : "do not have"} access
              </strong>{" "}
              to this company.
            </p>
            <p>
              Your access level:{" "}
              <strong className="text-purple-700">{accessLevel}</strong>
            </p>
            <p>
              User ID: <strong className="text-gray-900">{userId}</strong>
            </p>
            <p>
              Username:{" "}
              <strong className="text-gray-900">@{user.username}</strong>
            </p>
            <p>
              Company:{" "}
              <strong className="text-gray-900">{company.title}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
