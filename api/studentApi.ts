import { http } from "@/lib/api";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/interface/common";
import type { Student, CreateStudentPayload, UpdateStudentPayload } from "@/interface/student";

export async function getStudentsApi(): Promise<Student[]> {
  const body = await http.get<ApiPaginatedResponse<Student>>("students");
  return body.data.data;
}

export async function getStudentApi(id: number): Promise<Student> {
  const body = await http.get<ApiSuccessResponse<Student>>(`students/${id}`);
  return body.data;
}

export async function createStudentApi(payload: CreateStudentPayload): Promise<Student> {
  const body = await http.post<ApiSuccessResponse<Student>>("students", payload);
  return body.data;
}

export async function updateStudentApi(id: number, payload: UpdateStudentPayload): Promise<Student> {
  const body = await http.put<ApiSuccessResponse<Student>>(`students/${id}`, payload);
  return body.data;
}

export async function deleteStudentApi(id: number): Promise<void> {
  await http.delete(`students/${id}`);
}
