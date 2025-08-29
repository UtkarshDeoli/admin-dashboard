import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import RentalSpaceManager from "@/components/Companies/Rental-Spaces/RentalSpaceManager";

export const metadata: Metadata = {
  title: "Rental Spaces | Admin Dashboard",
  description: "Manage rental spaces in the admin dashboard",
};

export default function RentalSpaces() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <RentalSpaceManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
