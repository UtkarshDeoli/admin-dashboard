import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CompaniesManager from "@/components/Companies/CompaniesManager";

export const metadata: Metadata = {
  title: "Companies | Admin Dashboard",
  description: "Manage companies in the admin dashboard",
};

export default function Companies() {
  return (
    <DefaultLayout>
      <CompaniesManager />
    </DefaultLayout>
  );
}
