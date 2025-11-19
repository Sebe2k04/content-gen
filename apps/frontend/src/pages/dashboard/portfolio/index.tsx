import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/api";
import { useUserData } from "@/context/UserProvider";

export default function PortfolioOverviewPage() {
  const queryClient = getQueryClient();
  const { user } = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-overview"],
    queryFn: async () => {
      const res2 = await queryClient.user.getProfile.query({});

      const res = await queryClient.portfolio.getPublicPortfolio.query({
        query: { userId: user?.id }, // backend should treat "me" as authenticated user
      });
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Portfolio Overview</h1>
        <p className="opacity-70 mt-1">
          View the summary of your portfolio, projects, skills, and
          integrations.
        </p>
      </header>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Resume"
            value={data?.resumeUrl ? "Uploaded" : "Not uploaded"}
          />
          <Card title="Projects" value={data?.projects.length || 0} />
          <Card title="Skills" value={data?.skills.length || 0} />
          <Card title="Integrations" value={data?.integrations.length || 0} />
          <Card title="Theme" value={data?.theme?.displayName || "Not set"} />
        </div>
      )}
    </DashboardLayout>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="text-sm opacity-70 mb-1">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
