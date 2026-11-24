export interface ClassItem {
  id: number;
  name: string;
  students_count?: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateClassPayload {
  name: string;
}

export interface UpdateClassPayload {
  name: string;
}
