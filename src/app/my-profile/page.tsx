import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { requireAuth } from "@/lib/auth-server";
import { MyProfileCard } from "@/components/profile/my-profile-card";

export const instant = false;

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "View your BookNook account details: name, email address, and account information.",
};

export default async function MyProfilePage() {
  await requireAuth("/my-profile");

  return (
    <ProtectedRoute>
      <MyProfileCard />
    </ProtectedRoute>
  );
}
