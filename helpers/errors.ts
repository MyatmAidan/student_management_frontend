import { toast } from "sonner";

interface AxiosLikeError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

export function getApiError(error: unknown) {
  const e = error as AxiosLikeError;
  const body = e?.response?.data;
  const rawErrors = body?.errors ?? {};
  const errorLines = Object.entries(rawErrors).flatMap(([, msgs]) => msgs);
  return {
    status: e?.response?.status ?? 0,
    message: body?.message ?? (e?.response ? "Request failed" : "Cannot reach the server"),
    errors: errorLines,
  };
}

export function handleApiError(error: unknown) {
  const { status, message, errors } = getApiError(error);
  if (status === 429) {
    toast.error("Too many attempts. Please wait a moment and try again.");
    return;
  }
  if (errors.length > 0) {
    toast.error(errors.join("\n"));
    return;
  }
  toast.error(message);
}
