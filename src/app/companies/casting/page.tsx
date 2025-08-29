import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import CastingManager from "@/components/Companies/Casting/CastingManager";

export const metadata: Metadata = {
  title: "Casting | Admin Dashboard",
  description: "Manage casting companies in the admin dashboard",
};

export default function Casting() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <CastingManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
