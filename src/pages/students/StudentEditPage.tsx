import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { getStudentApi, updateStudentApi } from "@/api/studentApi";
import { getClassesApi } from "@/api/classApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui";
import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { PageHeader } from "@/components/common/PageHeader";

interface FormValues { class_id: string; name: string; email: string; phone: string; }

export default function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: student, isLoading } = useQuery({ queryKey: ["students", id], queryFn: () => getStudentApi(Number(id)) });
  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: getClassesApi });
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (student) reset({ class_id: String(student.class_id), name: student.name, email: student.email, phone: student.phone ?? "" });
  }, [student, reset]);

  const update = useMutation({
    mutationFn: (v: FormValues) => updateStudentApi(Number(id), {
      class_id: Number(v.class_id),
      name: v.name,
      email: v.email,
      phone: v.phone || null,
    }),
    onSuccess: () => {
      toast.success("Student updated successfully");
      qc.invalidateQueries({ queryKey: ["students"] });
      navigate(`/students/${id}`);
    },
    onError: (err) => handleApiError(err),
  });

  const classOptions = classes?.map((c) => ({ value: String(c.id), label: c.name })) ?? [];

  if (isLoading) return <div className="space-y-3"><Skeleton className="h-10 w-64" /><Skeleton className="h-60 w-full" /></div>;

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
        <PageHeader title="Edit Student" description={student?.name} />
      </div>

      <form onSubmit={handleSubmit((v) => update.mutate(v))} noValidate>
        <Card>
          <CardHeader><CardTitle>Student Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <SelectField
              id="class_id"
              label="Class *"
              value={watch("class_id")}
              onChange={(v) => setValue("class_id", v)}
              options={classOptions}
              placeholder="Select class"
              error={errors.class_id?.message}
            />
            <InputField
              id="name"
              label="Full Name *"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <InputField
              id="email"
              type="email"
              label="Email *"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <InputField
              id="phone"
              label="Phone"
              {...register("phone")}
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
