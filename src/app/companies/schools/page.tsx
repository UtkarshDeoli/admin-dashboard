import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import SchoolManager from "@/components/Companies/School/SchoolManager";

export const metadata: Metadata = {
  title: "Schools | Admin Dashboard",
  description: "Manage schools in the admin dashboard",
};

export default function Schools() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <SchoolManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
