import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { getQueryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserProvider";

export default function SkillsPage() {
  const client = getQueryClient();
  const {user} = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-public-me"],
    queryFn: async () => {
      const res = await client.portfolio.getPublicPortfolio.query({ query: { userId: user?.id } });
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <p className="opacity-70 mt-1">Add or update your skills and levels here.</p>
      </header>

      <div className="mb-4">
        <Link href="/dashboard/portfolio/skills/add" className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Add Skill
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && (
        <div className="space-y-3">
          {(data?.skills || []).map((s: any) => (
            <div key={s.id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm opacity-70">{s.level}</div>
              </div>
              <div>
                <Link href={`/dashboard/portfolio/skills/${s.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
