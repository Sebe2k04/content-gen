import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema } from "contract/portfolio/types";
import type { z } from "zod";
import { useRouter } from "next/router";
import { getQueryClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { ToastStatus } from "@/types/toast";
import { useCustomToast } from "@/hooks/useToast";

type Skill = z.infer<typeof skillSchema>;

export default function SkillForm({
  mode,
  skillId,
  initial,
  onSuccessRedirect = "/dashboard/portfolio/skills",
}: {
  mode: "add" | "edit";
  skillId?: string;
  initial?: Partial<Skill>;
  onSuccessRedirect?: string;
}) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { showToast } = useCustomToast();

  const { register, handleSubmit, reset } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
    defaultValues: initial as any,
  });

  useEffect(() => {
    if (initial) reset(initial as any);
  }, [initial, reset]);

  const addMut = useMutation({
    mutationFn: async (body: Skill) => await queryClient.portfolio.addSkill.mutation({ body }),
    onSuccess: () => {
      showToast({ message: "Skill added", status: ToastStatus.success });
      router.push(onSuccessRedirect);
    },
    onError: () =>
      showToast({ message: "Failed to add skill", status: ToastStatus.error }),
  });

  // There is no updateSkill in your contract; if you add one, wire it here.
  const onSubmit = (values: Skill) => {
    addMut.mutate(values);
  };

  return (
    <form className="max-w-lg space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block mb-1">Name</label>
        <input {...register("name")} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block mb-1">Level</label>
        <select {...register("level" as any)} className="w-full border p-2 rounded">
          <option value="BEGINNER">BEGINNER</option>
          <option value="INTERMEDIATE">INTERMEDIATE</option>
          <option value="ADVANCED">ADVANCED</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Tags (comma separated)</label>
        <input {...register("tags" as any)} className="w-full border p-2 rounded" />
      </div>

      <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
        Add Skill
      </button>
    </form>
  );
}
