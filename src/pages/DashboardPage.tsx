import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, School, ArrowRight, Users } from "lucide-react";
import { getStudentsApi } from "@/api/studentApi";
import { getClassesApi } from "@/api/classApi";
import { Card, CardContent, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/common/PageHeader";

export default function DashboardPage() {
  const { data: students, isLoading: loadingStudents } = useQuery({ queryKey: ["students"], queryFn: getStudentsApi });
  const { data: classes, isLoading: loadingClasses } = useQuery({ queryKey: ["classes"], queryFn: getClassesApi });

  const stats = [
    { label: "Total Students", value: students?.length ?? 0, icon: GraduationCap, to: "/students", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Classes", value: classes?.length ?? 0, icon: School, to: "/classes", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your student management system" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s) => (
          <Link key={s.to} to={s.to} className="group">
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="flex items-center gap-4 py-5 px-5">
                <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon className={`size-6 ${s.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  {loadingStudents || loadingClasses
                    ? <Skeleton className="h-7 w-12 mt-1" />
                    : <p className="text-3xl font-bold">{s.value}</p>}
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2"><School className="size-4 text-primary" /> Recent Classes</h2>
              <Link to="/classes" className="text-xs text-primary hover:underline">View all →</Link>
            </div>
            {loadingClasses
              ? <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
              : classes?.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <Link to={`/classes/${c.id}`} className="text-sm font-medium hover:underline">{c.name}</Link>
                  <span className="text-xs text-muted-foreground">{c.students_count ?? 0} students</span>
                </div>
              ))}
            {!loadingClasses && !classes?.length && <p className="text-sm text-muted-foreground py-4 text-center">No classes yet</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2"><Users className="size-4 text-primary" /> Recent Students</h2>
              <Link to="/students" className="text-xs text-primary hover:underline">View all →</Link>
            </div>
            {loadingStudents
              ? <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
              : students?.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <Link to={`/students/${s.id}`} className="text-sm font-medium hover:underline">{s.name}</Link>
                  <span className="text-xs text-muted-foreground">{s.class?.name ?? "—"}</span>
                </div>
              ))}
            {!loadingStudents && !students?.length && <p className="text-sm text-muted-foreground py-4 text-center">No students yet</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
