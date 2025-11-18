import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold">Welcome to your Dashboard</h1>
      <p className="mt-2 opacity-70">
        Manage your portfolio, resume, projects, skills, integrations and theme.
      </p>
    </DashboardLayout>
  );
}
