import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { createStudentApi } from "@/api/studentApi";
import { getClassesApi } from "@/api/classApi";
import { handleApiError } from "@/helpers/errors";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { InputField } from "@/components/common/InputField";
import { SelectField } from "@/components/common/SelectField";
import { PageHeader } from "@/components/common/PageHeader";

interface FormValues { class_id: string; name: string; email: string; phone: string; }

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();

  const { data: classes } = useQuery({ queryKey: ["classes"], queryFn: getClassesApi });
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: { class_id: params.get("class_id") ?? "", name: "", email: "", phone: "" },
  });

  const create = useMutation({
    mutationFn: (v: FormValues) => createStudentApi({
      class_id: Number(v.class_id),
      name: v.name,
      email: v.email,
      phone: v.phone || null,
    }),
    onSuccess: (s) => {
      toast.success("Student created successfully");
      qc.invalidateQueries({ queryKey: ["students"] });
      navigate(`/students/${s.id}`);
    },
    onError: (err) => handleApiError(err),
  });

  const classOptions = classes?.map((c) => ({ value: String(c.id), label: c.name })) ?? [];

  return (
    <div className="max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="size-4" /></Button>
        <PageHeader title="New Student" description="Add a new student" />
      </div>

      <form onSubmit={handleSubmit((v) => create.mutate(v))} noValidate>
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
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <InputField
              id="email"
              type="email"
              label="Email *"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
            <InputField
              id="phone"
              label="Phone"
              placeholder="+95 9 xxx xxx xxx"
              {...register("phone")}
            />
          </CardContent>
        </Card>
        <div className="flex gap-3 mt-4">
          <Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create Student"}</Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
