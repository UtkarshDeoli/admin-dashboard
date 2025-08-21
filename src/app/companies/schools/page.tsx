import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import SchoolManager from "@/components/Companies/School/SchoolManager";

export const metadata: Metadata = {
  title: "Agencies | Admin Dashboard",
  description: "Manage agencies in the admin dashboard",
};

export default function Agencies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <SchoolManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
