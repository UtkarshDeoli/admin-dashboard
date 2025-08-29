import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import TheaterManager from "@/components/Companies/Theater/TheaterManager";

export const metadata: Metadata = {
  title: "Theaters | Admin Dashboard",
  description: "Manage theaters in the admin dashboard",
};

export default function Theaters() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <TheaterManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
