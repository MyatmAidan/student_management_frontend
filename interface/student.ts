import type { ClassItem } from "./class";

export interface Student {
  id: number;
  class_id: number;
  class?: ClassItem;
  name: string;
  email: string;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateStudentPayload {
  class_id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface UpdateStudentPayload {
  class_id?: number;
  name?: string;
  email?: string;
  phone?: string | null;
}
