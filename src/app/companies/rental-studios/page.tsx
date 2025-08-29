import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import RentalStudioManager from "@/components/Companies/Rental-Studios/RentalStudioManager";

export const metadata: Metadata = {
  title: "Rental Studios | Admin Dashboard",
  description: "Manage rental studios in the admin dashboard",
};

export default function RentalStudios() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <RentalStudioManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
