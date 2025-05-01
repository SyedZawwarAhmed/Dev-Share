import apiService from "@/lib/api";

export const getNotesService = async () => {
  const data = await apiService.post<Note[]>("/notes");
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

export const updateNoteService = async (id: string, note: Note) => {
  const data = await apiService.put<Note>(`/notes/${id}`, note);
  return data.data;
};

export const deleteNoteService = async (id: string) => {
  const data = await apiService.delete<Note>(`/notes/${id}`);
  return data.data;
};
