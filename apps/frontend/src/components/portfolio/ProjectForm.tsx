import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "contract/portfolio/types";
import type { z } from "zod";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";

type Project = z.infer<typeof projectSchema>;

export default function ProjectForm({
  mode,
  projectId,
  initial,
  onSuccessRedirect = "/dashboard/portfolio/projects",
}: {
  mode: "add" | "edit";
  projectId?: string;
  initial?: Partial<Project>;
  onSuccessRedirect?: string;
}) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { showToast } = useCustomToast();

  const { register, handleSubmit, reset } = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: initial as any,
  });

  useEffect(() => {
    if (initial) reset(initial as any);
  }, [initial, reset]);

  const addMut = useMutation({
    mutationFn: async (body: Project) =>
      await queryClient.portfolio.addProject.mutation({ body }),
    onSuccess: () => {
      showToast({ message: "Project added", status: ToastStatus.success });
      router.push(onSuccessRedirect);
    },
    onError: () =>
      showToast({ message: "Failed to add project", status: ToastStatus.error }),
  });

  const updateMut = useMutation({
    mutationFn: async (body: Project) =>
      await queryClient.portfolio.updateProject.mutation({ id: projectId!, body }),
    onSuccess: () => {
      showToast({ message: "Project updated", status: ToastStatus.success });
      router.push(onSuccessRedirect);
    },
    onError: () =>
      showToast({
        message: "Failed to update project",
        status: ToastStatus.error,
      }),
  });

  const onSubmit = (values: Project) => {
    if (mode === "add") addMut.mutate(values);
    else updateMut.mutate(values);
  };

  return (
    <form className="max-w-xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block mb-1">Title</label>
        <input {...register("title")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <textarea {...register("description")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Repo URL</label>
        <input {...register("repoUrl")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Demo URL</label>
        <input {...register("demoUrl")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Technologies (comma separated)</label>
        <input
          {...register("technologies" as any)}
          placeholder="react,nextjs,node"
          className="w-full border p-2 rounded"
        />
        <div className="text-sm opacity-70 mt-1">We'll accept array or comma string.</div>
      </div>

      <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
        {mode === "add" ? "Add project" : "Update project"}
      </button>
    </form>
  );
}
