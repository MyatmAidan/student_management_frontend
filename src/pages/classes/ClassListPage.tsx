import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users, School } from "lucide-react";
import { toast } from "sonner";
import { getClassesApi, deleteClassApi } from "@/api/classApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardContent, Skeleton, Badge } from "@/components/ui";
import { PageHeader } from "@/components/common/PageHeader";
import { TableEmptyState } from "@/components/common/TableEmptyState";
import { formatDate } from "@/lib/utils";

export default function ClassListPage() {
  const qc = useQueryClient();
  const { data: classes, isLoading } = useQuery({ queryKey: ["classes"], queryFn: getClassesApi });

  const del = useMutation({
    mutationFn: deleteClassApi,
    onSuccess: () => {
      toast.success("Class deleted successfully");
      qc.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err) => handleApiError(err),
  });

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete class "${name}"? This cannot be undone.`)) del.mutate(id);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Classes"
        description="Manage all classes"
        actions={
          <Button asChild>
            <Link to="/classes/create"><Plus className="size-4" /> New Class</Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      )}

      {!isLoading && !classes?.length && (
        <Card>
          <CardContent className="py-0">
            <TableEmptyState
              title="No classes yet"
              description="Create your first class to get started."
              icon={School}
              action={
                <Button asChild>
                  <Link to="/classes/create"><Plus className="size-4" /> Create Class</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}

      {!isLoading && !!classes?.length && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Students</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cls.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/classes/${cls.id}`} className="font-medium hover:underline text-primary">{cls.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="default" className="gap-1">
                      <Users className="size-3" />{cls.students_count ?? 0}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(cls.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/classes/${cls.id}/edit`}><Pencil className="size-3.5" /></Link>
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(cls.id, cls.name)}
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
    </div>
  );
}
