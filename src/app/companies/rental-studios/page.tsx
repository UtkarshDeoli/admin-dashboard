import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import RentalStudioManager from "@/components/Companies/Rental-Studios/RentalStudioManager";

export const metadata: Metadata = {
  title: "Agencies | Admin Dashboard",
  description: "Manage agencies in the admin dashboard",
};

export default function Agencies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <RentalStudioManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
