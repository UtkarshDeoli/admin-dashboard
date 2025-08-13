import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import PersonEditManager from "@/components/People/PersonEditManager";

export const metadata: Metadata = {
  title: "Edit Person | Admin Dashboard",
  description: "Edit person details and manage address relationships",
};

interface PersonEditPageProps {
  params: {
    id: string;
  };
}

export default function PersonEditPage({ params }: PersonEditPageProps) {
  const peopleId = parseInt(params.id);

  if (isNaN(peopleId)) {
    return (
      <DefaultLayout>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="text-center py-8">
            <p className="text-red-500">Invalid person ID</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PersonEditManager peopleId={peopleId} />
    </DefaultLayout>
  );
}
