import DashboardLayout from "@/components/layouts/DashboardLayout";
import SkillForm from "@/components/portfolio/SkillForm";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserProvider";

export default function EditSkillPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const client = getQueryClient();
  const { user } = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-public-me"],
    queryFn: async () => {
      const res = await client.portfolio.getPublicPortfolio.query({
        query: { userId: user?.id },
      });
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
    enabled: !!id,
  });

  const skill = data?.skills?.find((s: any) => s.id === id);

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Skill</h1>
        <p className="opacity-70 mt-1">Update your skill information.</p>
      </header>

      {isLoading && <div>Loading...</div>}

      {!isLoading && skill ? (
        <SkillForm mode="edit" skillId={id} initial={skill} />
      ) : (
        <div>Skill not found</div>
      )}
    </DashboardLayout>
  );
}
