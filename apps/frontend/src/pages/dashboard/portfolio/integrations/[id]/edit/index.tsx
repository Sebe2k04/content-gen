import DashboardLayout from "@/components/layouts/DashboardLayout";
import IntegrationForm from "@/components/portfolio/IntegrationForm";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserProvider";

export default function EditIntegrationPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const client = getQueryClient();

  const {user} = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-public-me"],
    queryFn: async () => {
      const res = await client.portfolio.getPublicPortfolio.query({ query: { userId: user?.id } });
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
    enabled: !!id,
  });

  const integration = data?.integrations?.find((i: any) => i.id === id);

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Integration</h1>
        <p className="opacity-70 mt-1">Update the integration connection.</p>
      </header>

      {isLoading && <div>Loading...</div>}

      {!isLoading && integration ? (
        <IntegrationForm mode="edit" integrationId={id} initial={integration} />
      ) : (
        <div>Integration not found</div>
      )}
    </DashboardLayout>
  );
}
