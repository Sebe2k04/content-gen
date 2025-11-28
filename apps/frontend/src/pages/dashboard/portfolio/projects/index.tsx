import DashboardLayout from "@/components/layouts/DashboardLayout";
import Link from "next/link";
import { getQueryClient } from "@/utils/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ToastStatus } from "@/types/toast";
import { useCustomToast } from "@/hooks/useToast";
import { useUserData } from "@/context/UserProvider";

export default function ProjectsPage() {
  const client = getQueryClient();
  const { showToast } = useCustomToast();
  const { user } = useUserData();
  console.log(user);
  const { data, isLoading } = useQuery({
    queryKey: ["portfolio-public-me"],
    queryFn: async () => {
      const res = await client.portfolio.getPublicPortfolio.query({
        query: { userId: user?.id },
      });
      if (res.status !== 200) throw new Error("Failed");
      return res.body;
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) =>
      await client.portfolio.deleteProject.mutation({ body: { id } }),
    onSuccess: () => {
      showToast({ message: "Deleted", status: ToastStatus.success });
      // naive refresh: re-run query by visiting same page; simpler: reload page
      window.location.reload();
    },
    onError: () =>
      showToast({ message: "Delete failed", status: ToastStatus.error }),
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <p className="opacity-70 mt-1">Manage all your showcased work here.</p>
      </header>

      <div className="mb-4">
        <Link
          href="/dashboard/portfolio/projects/add"
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Add New Project
        </Link>
      </div>

      {isLoading && <div>Loading...</div>}

      {!isLoading && (
        <div className="space-y-4">
          {(data?.projects || []).map((p: any) => (
            <div
              key={p.id}
              className="p-4 border border-border rounded flex justify-between items-start"
            >
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="opacity-70 text-sm mt-1">{p.description}</div>
              </div>

              <div className="space-x-2">
                <Link
                  href={`/dashboard/portfolio/projects/${p.id}/edit`}
                  className="px-3 py-1 border rounded"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteMut.mutate(p.id)}
                  className="px-3 py-1 border rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
