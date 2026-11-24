import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, Users, UserPlus, Plus, X, Check } from "lucide-react";
import { getClassApi } from "@/api/classApi";
import { getStudentsApi, deleteStudentApi, updateStudentApi } from "@/api/studentApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton, Badge } from "@/components/ui";
import { PageHeader } from "@/components/common/PageHeader";
import { DetailRow } from "@/components/common/DetailRow";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [addMode, setAddMode] = useState<"none" | "existing">("none");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const { data: cls, isLoading } = useQuery({ queryKey: ["classes", id], queryFn: () => getClassApi(Number(id)) });
  const { data: allStudents } = useQuery({ queryKey: ["students"], queryFn: getStudentsApi });

  const students = useMemo(() => allStudents?.filter((s) => s.class_id === Number(id)) ?? [], [allStudents, id]);
  const availableStudents = useMemo(() => allStudents?.filter((s) => s.class_id !== Number(id)) ?? [], [allStudents, id]);

  const del = useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: () => { toast.success("Student deleted"); qc.invalidateQueries({ queryKey: ["students"] }); },
    onError: (err) => handleApiError(err),
  });

  const assign = useMutation({
    mutationFn: (studentId: number) => updateStudentApi(studentId, { class_id: Number(id) }),
    onSuccess: (s) => {
      toast.success(`${s.name} assigned to ${cls?.name}`);
      qc.invalidateQueries({ queryKey: ["students"] });
      setAddMode("none");
      setSelectedStudentId("");
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <div className="space-y-3"><Skeleton className="h-10 w-64" /><Skeleton className="h-40 w-full" /></div>;
  if (!cls) return <p className="text-muted-foreground">Class not found.</p>;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
          <PageHeader title={cls.name} description={`Class ID: ${cls.id}`} />
        </div>
        <Button asChild>
          <Link to={`/classes/${id}/edit`}><Pencil className="size-3.5" /> Edit</Link>
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Class Information</CardTitle></CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="Name" value={cls.name} />
            <DetailRow label="Students" value={<Badge variant="default" className="gap-1"><Users className="size-3" />{students.length}</Badge>} />
            <DetailRow label="Created" value={formatDate(cls.created_at)} />
            <DetailRow label="Updated" value={formatDate(cls.updated_at)} />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Students in this class</CardTitle>
            {addMode === "none" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setAddMode("existing")}>
                  <UserPlus className="size-3.5" /> Assign Existing
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/students/create?class_id=${id}`}><Plus className="size-3.5" /> New Student</Link>
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => { setAddMode("none"); setSelectedStudentId(""); }}>
                <X className="size-3.5" /> Cancel
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {addMode === "existing" && (
            <div className="flex gap-2 items-center p-3 rounded-lg border bg-muted/30">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Select a student —</option>
                {availableStudents.length === 0
                  ? <option disabled>No other students available</option>
                  : availableStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email}){s.class ? ` — ${s.class.name}` : " — no class"}
                    </option>
                  ))}
              </select>
              <Button size="sm" onClick={() => assign.mutate(Number(selectedStudentId))} disabled={assign.isPending || !selectedStudentId}>
                <Check className="size-3.5" />
                {assign.isPending ? "Assigning…" : "Assign"}
              </Button>
            </div>
          )}

          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No students in this class.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Email</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">Phone</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2"><Link to={`/students/${s.id}`} className="font-medium hover:underline">{s.name}</Link></td>
                      <td className="px-3 py-2 text-muted-foreground">{s.email}</td>
                      <td className="px-3 py-2 text-muted-foreground">{s.phone ?? "—"}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1 justify-end">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
