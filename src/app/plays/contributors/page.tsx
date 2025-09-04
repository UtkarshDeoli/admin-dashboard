import AuthGuard from "@/components/AuthGuard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ContributorsManager from "@/components/Contributors/ContributorsManager";

export default function ContributorsPage() {
  return (
    <AuthGuard>
      <DefaultLayout>
        <ContributorsManager />
      </DefaultLayout>
    </AuthGuard>
  );
}
