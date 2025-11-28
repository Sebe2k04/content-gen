import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/api";
import { useUserData } from "@/context/UserProvider";
import { useApiQuery } from "@/hooks/useApi";
import { ToastStatus } from "@/types/toast";
import { useCustomToast } from "@/hooks/useToast";

export default function PortfolioOverviewPage() {
  const queryClient = getQueryClient();
  const { user } = useUserData();

  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-overview"],
    queryFn: async () => {
      const res = await queryClient.portfolio.getAllPortfolio.query({});
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
  });
  const { makeApiCall, isApiLoading } = useApiQuery();
  const { showToast } = useCustomToast();

  const handleCreatePortfolio = async () => {
    await makeApiCall({
      fetcherFn: async () => {
        const client = getQueryClient();
        const response = await client.portfolio.createPortfolio.mutation({
          body: {},
        });

        if (response.status === 200) return response;
        throw new Error("Login failed");
      },

      onSuccessFn: (res) => {
        showToast({
          status: ToastStatus.success,
          message: "Portfolio created successfully!",
        });
      },

      onFailureFn: () => {
        showToast({
          status: ToastStatus.error,
          message: "Project Creation failed. Please try again.",
        });
      },
    });
  };

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Portfolio Overview</h1>
        <p className="opacity-70 mt-1">
          View the summary of your portfolio, projects, skills, and
          integrations.
        </p>
      </header>
      <div className="p-6 rounded-[12px] border-gray-700 border shadow-md w-fit h-fit cursor-pointer" onClick={handleCreatePortfolio}>Create Portfolio</div>
    </DashboardLayout>
  );
}
 