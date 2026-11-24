import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { getClassApi, updateClassApi } from "@/api/classApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { InputField } from "@/components/common/InputField";
import { PageHeader } from "@/components/common/PageHeader";

interface FormValues { name: string; }

export default function ClassEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: cls, isLoading } = useQuery({ queryKey: ["classes", id], queryFn: () => getClassApi(Number(id)) });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => { if (cls) reset({ name: cls.name }); }, [cls, reset]);

  const update = useMutation({
    mutationFn: (v: FormValues) => updateClassApi(Number(id), { name: v.name }),
    onSuccess: () => {
      toast.success("Class updated successfully");
      qc.invalidateQueries({ queryKey: ["classes"] });
      navigate(`/classes/${id}`);
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <div className="space-y-3"><Skeleton className="h-10 w-64" /><Skeleton className="h-40 w-full" /></div>;

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
        <PageHeader title="Edit Class" description={cls?.name} />
      </div>

      <form onSubmit={handleSubmit((v) => update.mutate(v))} noValidate>
        <Card>
          <CardHeader><CardTitle>Class Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="name"
              label="Class Name *"
              error={errors.name?.message}
              {...register("name", { required: "Class name is required" })}
            />
          </CardContent>
        </Card>
        <div className="flex gap-3 mt-4">
          <Button type="submit" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save Changes"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
