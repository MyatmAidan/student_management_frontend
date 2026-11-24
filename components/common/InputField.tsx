import * as React from "react";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <Label htmlFor={props.id}>{label}</Label>
      <Input ref={ref} className={cn(error && "border-red-500", className)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
InputField.displayName = "InputField";
