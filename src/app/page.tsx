import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard | UTDA Management System",
  description: "Admin dashboard for managing companies, addresses, people and projects",
};

export default function Home() {
  return (
    <DefaultLayout>
      <AdminDashboard />
    </DefaultLayout>
  );
}
