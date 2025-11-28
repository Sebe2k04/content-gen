import DashboardLayout from "@/components/layouts/DashboardLayout";
import IntegrationForm from "@/components/portfolio/IntegrationForm";

export default function AddIntegrationPage() {
  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Integration</h1>
        <p className="opacity-70 mt-1">Add a provider like GitHub or LinkedIn.</p>
      </header>

      <IntegrationForm mode="add" />
    </DashboardLayout>
  );
}
