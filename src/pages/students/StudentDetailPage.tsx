import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { getStudentApi, deleteStudentApi } from "@/api/studentApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { PageHeader } from "@/components/common/PageHeader";
import { DetailRow } from "@/components/common/DetailRow";
import { formatDate } from "@/lib/utils";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: student, isLoading } = useQuery({ queryKey: ["students", id], queryFn: () => getStudentApi(Number(id)) });

  const del = useMutation({
    mutationFn: () => deleteStudentApi(Number(id)),
    onSuccess: () => {
      toast.success("Student deleted successfully");
      qc.invalidateQueries({ queryKey: ["students"] });
      navigate("/students");
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <div className="space-y-3"><Skeleton className="h-10 w-64" /><Skeleton className="h-40 w-full" /></div>;
  if (!student) return <p className="text-muted-foreground">Student not found.</p>;

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
          <PageHeader title={student.name} description={`Student ID: ${student.id}`} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/students/${id}/edit`}><Pencil className="size-3.5" /> Edit</Link>
          </Button>
          <Button
            variant="destructive" size="sm"
            onClick={() => confirm(`Delete ${student.name}?`) && del.mutate()}
            disabled={del.isPending}
          >
            <Trash2 className="size-3.5" /> Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
        <CardContent>
          <dl>
            <DetailRow label="Name" value={student.name} />
            <DetailRow label="Email" value={student.email} />
            <DetailRow label="Phone" value={student.phone ?? "—"} />
            <DetailRow
              label="Class"
              value={student.class
                ? <Link to={`/classes/${student.class_id}`} className="text-primary hover:underline">{student.class.name}</Link>
                : "—"}
            />
            <DetailRow label="Created" value={formatDate(student.created_at)} />
            <DetailRow label="Updated" value={formatDate(student.updated_at)} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
