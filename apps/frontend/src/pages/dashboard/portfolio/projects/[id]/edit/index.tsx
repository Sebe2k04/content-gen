import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProjectForm from "@/components/portfolio/ProjectForm";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserProvider";

export default function EditProjectPage() {
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

  const project = data?.projects?.find((p: any) => p.id === id);

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Project</h1>
        <p className="opacity-70 mt-1">Update project details. Changes will reflect on your portfolio.</p>
      </header>

      {isLoading && <div>Loading...</div>}

      {!isLoading && project ? (
        <ProjectForm mode="edit" projectId={id} initial={project} />
      ) : (
        <div>Project not found</div>
      )}
    </DashboardLayout>
  );
}
