import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProjectForm from "@/components/portfolio/ProjectForm";

export default function AddProjectPage() {
  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Project</h1>
        <p className="opacity-70 mt-1">Create a new project to showcase on your portfolio.</p>
      </header>

      <ProjectForm mode="add" />
    </DashboardLayout>
  );
}
