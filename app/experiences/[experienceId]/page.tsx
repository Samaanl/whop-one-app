import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  // The headers contains the user token
  const headersList = await headers();

  // The experienceId is a path param
  const { experienceId } = await params;

  // The user token is in the headers
  const { userId } = await whopSdk.verifyUserToken(headersList);

  const result = await whopSdk.access.checkIfUserHasAccessToExperience({
    userId,
    experienceId,
  });

  // Get the experience to extract the companyId
  const experience = await whopSdk.experiences.getExperience({ experienceId });
  const companyId = experience.company.id;

  // Either: 'admin' | 'customer' | 'no_access';
  // 'admin' means the user is an admin of the whop, such as an owner or moderator
  // 'customer' means the user is a common member in this whop
  // 'no_access' means the user does not have access to the whop
  const { accessLevel } = result;

  // Redirect based on access level
  if (accessLevel === "no_access") {
    // Non-member: show locked page with upgrade option
    redirect(`/locked?companyId=${companyId}`);
  }

  // Member or admin: redirect to today's drop with companyId
  redirect(`/today?companyId=${companyId}`);
}
