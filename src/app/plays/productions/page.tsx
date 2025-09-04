import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AuthGuard from "@/components/AuthGuard";
import ProductionsManager from "@/components/Productions/ProductionsManager";

export const metadata: Metadata = {
  title: "Productions | Admin Dashboard",
  description: "Manage play productions in the admin dashboard",
};

export default function Productions() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <ProductionsManager />
      </DefaultLayout>
    </AuthGuard>
  );
}