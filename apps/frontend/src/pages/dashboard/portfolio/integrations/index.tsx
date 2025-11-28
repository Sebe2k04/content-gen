import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { getQueryClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useUserData } from "@/context/UserProvider";

export default function IntegrationsPage() {
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
        <h1 className="text-2xl font-semibold">Integrations</h1>
        <p className="opacity-70 mt-1">Connect external profiles (GitHub, LinkedIn, etc.).</p>
      </header>

      <div className="mb-4">
        <Link href="/dashboard/portfolio/integrations/add" className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Add Integration
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && (
        <div className="space-y-3">
          {(data?.integrations || []).map((it: any) => (
            <div key={it.id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-semibold">{it.provider}</div>
                <div className="text-sm opacity-70">{it.profileUrl}</div>
              </div>
              <div>
                <Link href={`/dashboard/portfolio/integrations/${it.id}/edit`} className="px-3 py-1 border rounded">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
