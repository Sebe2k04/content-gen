import DashboardLayout from "@/components/layouts/DashboardLayout";
import SkillForm from "@/components/portfolio/SkillForm";

export default function AddSkillPage() {
  return (
    <DashboardLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Skill</h1>
        <p className="opacity-70 mt-1">Add a new skill to show on your portfolio.</p>
      </header>

      <SkillForm mode="add" />
    </DashboardLayout>
  );
}
