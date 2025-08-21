import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import RentalSpaceManager from "@/components/Companies/Rental-Spaces/RentalSpaceManager";

export const metadata: Metadata = {
  title: "Agencies | Admin Dashboard",
  description: "Manage agencies in the admin dashboard",
};

export default function Agencies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <RentalSpaceManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
