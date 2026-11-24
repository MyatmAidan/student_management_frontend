import { Label } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface SelectFieldProps {
  id?: string;
  label: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectField({ id, label, value, onChange, options, placeholder = "Select…", error, disabled, className }: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          error && "border-red-500"
        )}
      >
        <option value="">— {placeholder} —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
