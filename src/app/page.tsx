import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard | UTDA Management System",
  description: "Admin dashboard for managing companies, addresses, people and projects",
};

export default function Home() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <AdminDashboard />
      </DefaultLayout>
    </AuthGuard>
  );
}
