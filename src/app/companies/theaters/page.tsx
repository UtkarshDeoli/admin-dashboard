import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import TheaterManager from "@/components/Companies/Theater/TheaterManager";

export const metadata: Metadata = {
  title: "Agencies | Admin Dashboard",
  description: "Manage agencies in the admin dashboard",
};

export default function Agencies() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <TheaterManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
