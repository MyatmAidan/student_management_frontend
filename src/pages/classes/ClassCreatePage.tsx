import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createClassApi } from "@/api/classApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { InputField } from "@/components/common/InputField";
import { PageHeader } from "@/components/common/PageHeader";

interface FormValues { name: string; }

export default function ClassCreatePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const create = useMutation({
    mutationFn: (v: FormValues) => createClassApi({ name: v.name }),
    onSuccess: (cls) => {
      toast.success("Class created successfully");
      qc.invalidateQueries({ queryKey: ["classes"] });
      navigate(`/classes/${cls.id}`);
    },
    onError: (err) => handleApiError(err),
  });

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
        <PageHeader title="New Class" description="Create a new class" />
      </div>

      <form onSubmit={handleSubmit((v) => create.mutate(v))} noValidate>
        <Card>
          <CardHeader><CardTitle>Class Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="name"
              label="Class Name *"
              placeholder="e.g. Grade 10-A"
              error={errors.name?.message}
              {...register("name", { required: "Class name is required" })}
            />
          </CardContent>
        </Card>
        <div className="flex gap-3 mt-4">
          <Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create Class"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
