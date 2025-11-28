import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPortfolioSchema } from "contract/portfolio/types";
import { z } from "zod";
import { getQueryClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";

type FormData = z.infer<typeof createPortfolioSchema>;

export default function ManualPortfolioPage() {
  const queryClient = getQueryClient();
  const { showToast } = useCustomToast();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(createPortfolioSchema),
  });

  const mutation = useMutation({
    mutationFn: async (body: FormData) => {
      console.log("bbbb",body),
        await queryClient.portfolio.createPortfolio.mutation({ body });
    },
    onSuccess: () =>
      showToast({ message: "Portfolio updated!", status: ToastStatus.success }),
    onError: () =>
      showToast({ message: "Update failed", status: ToastStatus.error }),
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Manual Portfolio</h1>
        <p className="opacity-70 mt-1">
          Add or update your basic portfolio information manually.
        </p>
      </header>

      <form
        className="max-w-xl space-y-4"
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
      >
        <div>
          <label className="block mb-1">Name</label>
          <input {...register("name")} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block mb-1">Headline</label>
          <input
            {...register("headline")}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            {...register("bio")}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Avatar URL</label>
          <input
            {...register("avatarUrl")}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Save
        </button>
      </form>
    </DashboardLayout>
  );
}
