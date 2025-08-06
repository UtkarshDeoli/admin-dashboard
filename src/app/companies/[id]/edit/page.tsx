import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CompanyEditManager from "@/components/Companies/CompanyEditManager";

export const metadata: Metadata = {
  title: "Edit Company | Admin Dashboard",
  description: "Edit company details and type-specific information",
};

interface CompanyEditPageProps {
  params: {
    id: string;
  };
}

export default function CompanyEditPage({ params }: CompanyEditPageProps) {
  return (
    <DefaultLayout>
      <CompanyEditManager companyId={parseInt(params.id)} />
    </DefaultLayout>
  );
}
