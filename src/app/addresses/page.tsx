import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AddressesManager from "@/components/Addresses/AddressesManager";

export const metadata: Metadata = {
  title: "Addresses | Admin Dashboard",
  description: "Manage addresses in the admin dashboard",
};

export default function Addresses() {
  return (
    <DefaultLayout>
      <AddressesManager />
    </DefaultLayout>
  );
}
