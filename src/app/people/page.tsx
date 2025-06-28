import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PeopleManager from "@/components/People/PeopleManager";

export const metadata: Metadata = {
  title: "People | Admin Dashboard",
  description: "Manage people in the admin dashboard",
};

export default function People() {
  return (
    <DefaultLayout>
      <PeopleManager />
    </DefaultLayout>
  );
}
