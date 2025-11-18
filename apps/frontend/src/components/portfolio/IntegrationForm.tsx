import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { integrationSchema } from "contract/portfolio/types";
import type { z } from "zod";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { IntegrationProvider } from "contract/enum";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";

type Integration = z.infer<typeof integrationSchema>;

export default function IntegrationForm({
  mode,
  integrationId,
  initial,
  onSuccessRedirect = "/dashboard/portfolio/integrations",
}: {
  mode: "add" | "edit";
  integrationId?: string;
  initial?: Partial<Integration>;
  onSuccessRedirect?: string;
}) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { showToast } = useCustomToast();

  const { register, handleSubmit, reset } = useForm<Integration>({
    resolver: zodResolver(integrationSchema),
    defaultValues: initial as any,
  });

  useEffect(() => {
    if (initial) reset(initial as any);
  }, [initial, reset]);

  const upsertMut = useMutation({
    mutationFn: async (body: Integration) => await queryClient.portfolio.upsertIntegration.mutation({ body }),
    onSuccess: () => {
      showToast({ message: "Integration saved", status: ToastStatus.success });
      router.push(onSuccessRedirect);
    },
    onError: () =>
      showToast({
        message: "Failed to save integration",
        status: ToastStatus.error,
      }),
  });

  const onSubmit = (values: Integration) => {
    upsertMut.mutate(values);
  };

  return (
    <form className="max-w-lg space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block mb-1">Provider</label>
        <select {...register("provider" as any)} className="w-full border p-2 rounded">
          {Object.values(IntegrationProvider).map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Profile URL</label>
        <input {...register("profileUrl")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Username (optional)</label>
        <input {...register("username" as any)} className="w-full border p-2 rounded" />
      </div>

      <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
        Save Integration
      </button>
    </form>
  );
}
