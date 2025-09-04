import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import PlaysManager from "@/components/Plays/PlaysManager";

export const metadata: Metadata = {
  title: "Plays | Admin Dashboard",
  description: "Manage plays in the admin dashboard",
};

export default function Companies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <PlaysManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
