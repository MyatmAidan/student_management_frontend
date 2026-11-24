import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChevronRight } from "lucide-react";

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Dashboard", to: "/" }];
  return [
    { label: "Dashboard", to: "/" },
    ...parts.map((p, i) => ({
      label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "),
      to: "/" + parts.slice(0, i + 1).join("/"),
    })),
  ];
}

export function AppLayout() {
  const crumbs = useBreadcrumbs();
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b bg-background flex items-center px-6 gap-1 text-sm">
          {crumbs.map((c, i) => (
            <span key={c.to} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground" />}
              {i < crumbs.length - 1
                ? <Link to={c.to} className="text-muted-foreground hover:text-foreground transition-colors">{c.label}</Link>
                : <span className="font-medium">{c.label}</span>}
            </span>
          ))}
        </header>
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
