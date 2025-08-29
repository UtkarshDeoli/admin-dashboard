import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AgenciesManager from "@/components/Companies/Agency/AgenciesManager";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Agencies | Admin Dashboard",
  description: "Manage agencies in the admin dashboard",
};

export default function Agencies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <AgenciesManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
