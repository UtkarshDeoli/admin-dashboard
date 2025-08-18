import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PeopleManager from "@/components/People/PeopleManager";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "People | Admin Dashboard",
  description: "Manage people in the admin dashboard",
};

export default function People() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <PeopleManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
