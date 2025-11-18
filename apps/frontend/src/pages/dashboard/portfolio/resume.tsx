import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResumeSchema } from "contract/portfolio/types";
import { z } from "zod";
import { getQueryClient } from "@/utils/api";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";

type ResumeForm = z.infer<typeof createResumeSchema>;

export default function ResumeUploadPage() {
  const queryClient = getQueryClient();
  const { showToast } = useCustomToast();

  const { register, handleSubmit } = useForm<ResumeForm>({
    resolver: zodResolver(createResumeSchema),
  });

  const mutation = useMutation({
    mutationFn: async (body: ResumeForm) =>
      await queryClient.portfolio.createResume.mutation({ body }),
    onSuccess: () =>
      showToast({ message: "Resume uploaded!", status: ToastStatus.success }),
    onError: () =>
      showToast({ message: "Upload failed", status: ToastStatus.error }),
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Upload Resume</h1>
        <p className="opacity-70 mt-1">
          Upload your resume to extract skills, experience, and auto-fill portfolio details.
        </p>
      </header>

      <form
        className="space-y-4 max-w-lg"
        onSubmit={handleSubmit((v) => mutation.mutate(v))}
      >
        <div>
          <label className="block mb-1">Resume URL</label>
          <input
            {...register("url")}
            className="w-full border p-2 rounded bg-background"
          />
        </div>

        <div>
          <label className="block mb-1">Filename</label>
          <input
            {...register("filename")}
            className="w-full border p-2 rounded bg-background"
          />
        </div>

        <div>
          <label className="block mb-1">Media Type</label>
          <select
            {...register("mediaType")}
            className="w-full border p-2 rounded bg-background"
          >
            <option value="pdf">pdf</option>
            <option value="doc">doc</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          Upload
        </button>
      </form>
    </DashboardLayout>
  );
}
