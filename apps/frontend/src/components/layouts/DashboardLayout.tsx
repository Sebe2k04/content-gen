import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-black">
      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full w-64 bg-card border-r border-border
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center px-4 text-xl font-semibold border-b border-border">
          Portfolio Hub
        </div>

        <nav className="p-4 space-y-2">
          <NavItem href="/dashboard">Dashboard</NavItem>

          {/* Portfolio Group */}
          <div className="text-sm font-semibold opacity-70 mt-4 mb-2">
            Portfolio
          </div>

          <NavItem href="/dashboard/portfolio">Overview</NavItem>
          <NavItem href="/dashboard/portfolio/resume">Resume Upload</NavItem>
          <NavItem href="/dashboard/portfolio/manual">Manual Portfolio</NavItem>
          <NavItem href="/dashboard/portfolio/projects">Projects</NavItem>
          <NavItem href="/dashboard/portfolio/skills">Skills</NavItem>
          <NavItem href="/dashboard/portfolio/integrations">Integrations</NavItem>
          <NavItem href="/dashboard/portfolio/theme">Theme</NavItem>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            className="md:hidden p-2"
            onClick={() => setOpen((p) => !p)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="font-semibold text-lg">Dashboard</div>

          {/* User Profile Placeholder */}
          <div className="w-8 h-8 rounded-full bg-muted" />
        </header>

        {/* Content */}
        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md hover:bg-muted transition"
    >
      {children}
    </Link>
  );
}
