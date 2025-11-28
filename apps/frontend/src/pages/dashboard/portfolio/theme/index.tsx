import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getQueryClient } from "@/utils/api";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCustomToast } from "@/hooks/useToast";
import { ToastStatus } from "@/types/toast";

const THEMES = [
  { key: "minimal", displayName: "Minimal" },
  { key: "dark", displayName: "Dark" },
  { key: "two-column", displayName: "Two Column" },
];

export default function ThemePage() {
  const client = getQueryClient();
  const { showToast } = useCustomToast();
  const [selected, setSelected] = useState<string | null>(null);

  const setThemeMut = useMutation({
    mutationFn: async (theme: { key: string; displayName: string }) =>
      await client.portfolio.setTheme.mutation({ body: theme }),
    onSuccess: () => {
      showToast({ message: "Theme set", status: ToastStatus.success });
    },
    onError: () => showToast({ message: "Failed to set theme", status: ToastStatus.error }),
  });

  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Theme</h1>
        <p className="opacity-70 mt-1">Select a theme for your public portfolio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {THEMES.map((t) => (
          <div key={t.key} className="p-4 border rounded">
            <div className="font-semibold">{t.displayName}</div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setSelected(t.key);
                  setThemeMut.mutate({ key: t.key, displayName: t.displayName });
                }}
                className="px-3 py-1 border rounded"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
