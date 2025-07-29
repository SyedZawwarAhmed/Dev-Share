import apiService from "@/lib/api";
import { getNotesBodySchema } from "@/schemas/note.schema";
import { z } from "zod";

export const getNotesService = async (
  body: z.infer<typeof getNotesBodySchema>,
) => {
  const validatedBody = getNotesBodySchema.parse(body);
  const data = await apiService.post<{
    notes: Note[];
    hasMore: boolean;
    total: number;
  }>("/notes", validatedBody);
  return data.data;
};

export const addNoteService = async (note: CreateNotePayload) => {
  const data = await apiService.post<Note>("/notes/add-note", note);
  return data.data;
};

export const getNoteService = async (id: string) => {
  const data = await apiService.get<Note>(`/notes/${id}`);
  return data.data;
};

export const updateNoteService = async (
  id: string,
  note: UpdateNotePayload,
) => {
  const data = await apiService.put<Note>(`/notes/${id}`, note);
  return data.data;
};

export const deleteNoteService = async (id: string) => {
  const data = await apiService.delete<Note>(`/notes/${id}`);
  return data.data;
};
