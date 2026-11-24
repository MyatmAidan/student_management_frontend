import { Link, useLocation } from "react-router-dom";
import { GraduationCap, School, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Classes", to: "/classes", icon: School },
  { label: "Students", to: "/students", icon: GraduationCap },
];

export function Sidebar() {
  const { pathname } = useLocation();

  const isActive = (to: string) => to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <aside className="w-60 shrink-0 h-screen border-r bg-card flex flex-col">
      {/* Brand */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b">
        <Users className="size-5 text-primary" />
        <span className="font-semibold text-sm">Student Management</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.to)
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <p className="text-xs text-muted-foreground text-center">Student Mgmt System</p>
      </div>
    </aside>
  );
}
