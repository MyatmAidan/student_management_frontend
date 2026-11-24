import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { getStudentsApi, deleteStudentApi } from "@/api/studentApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/common/PageHeader";
import { TableEmptyState } from "@/components/common/TableEmptyState";
import { formatDate } from "@/lib/utils";

export default function StudentListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: students, isLoading } = useQuery({ queryKey: ["students"], queryFn: getStudentsApi });

  const del = useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => { toast.success("Student deleted successfully"); qc.invalidateQueries({ queryKey: ["students"] }); },
    onError: (err) => handleApiError(err),
  });

  const filtered = students?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.class?.name ?? "").toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Students"
        description="Manage all students"
        actions={
          <Button asChild>
            <Link to="/students/create"><Plus className="size-4" /> New Student</Link>
          </Button>
        }
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or class…"
        className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {isLoading && (
        <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
      )}

      {!isLoading && !filtered.length && (
        <Card>
          <CardContent className="py-0">
            <TableEmptyState
              title={search ? "No students match your search" : "No students yet"}
              description={search ? undefined : "Add your first student to get started."}
              icon={GraduationCap}
              action={!search ? <Button asChild><Link to="/students/create"><Plus className="size-4" /> Add Student</Link></Button> : undefined}
            />
          </CardContent>
        </Card>
      )}

      {!isLoading && !!filtered.length && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Class</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/students/${s.id}`} className="font-medium hover:underline text-primary">{s.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    {s.class
                      ? <Link to={`/classes/${s.class_id}`} className="text-primary hover:underline">{s.class.name}</Link>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/students/${s.id}/edit`}><Pencil className="size-3.5" /></Link>
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => confirm(`Delete ${s.name}?`) && del.mutate(s.id)}
                        disabled={del.isPending}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 border-t text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "student" : "students"}{search && ` matching "${search}"`}
          </div>
        </div>
      )}
    </div>
  );
}
