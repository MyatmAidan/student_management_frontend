import { http } from "@/lib/api";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "@/interface/common";
import type { ClassItem, CreateClassPayload, UpdateClassPayload } from "@/interface/class";

export async function getClassesApi(): Promise<ClassItem[]> {
  const body = await http.get<ApiPaginatedResponse<ClassItem>>("classes");
  return body.data.data;
}

export async function getClassApi(id: number): Promise<ClassItem> {
  const body = await http.get<ApiSuccessResponse<ClassItem>>(`classes/${id}`);
  return body.data;
}

export async function createClassApi(payload: CreateClassPayload): Promise<ClassItem> {
  const body = await http.post<ApiSuccessResponse<ClassItem>>("classes", payload);
  return body.data;
}

export async function updateClassApi(id: number, payload: UpdateClassPayload): Promise<ClassItem> {
  const body = await http.put<ApiSuccessResponse<ClassItem>>(`classes/${id}`, payload);
  return body.data;
}

export async function deleteClassApi(id: number): Promise<void> {
  await http.delete(`classes/${id}`);
}
