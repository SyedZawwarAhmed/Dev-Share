import apiService from "@/lib/api";

export const getNotes = async () => {
  const data = await apiService.post<Note[]>("/notes");
  return data.data;
};

export const addNote = async (note: CreateNotePayload) => {
  const data = await apiService.post<Note>("/notes", note);
  return data.data;
};

export const getNote = async (id: string) => {
  const data = await apiService.get<Note>(`/notes/${id}`);
  return data.data;
};

export const updateNote = async (id: string, note: Note) => {
  const data = await apiService.put<Note>(`/notes/${id}`, note);
  return data.data;
};

export const deleteNote = async (id: string) => {
  const data = await apiService.delete<Note>(`/notes/${id}`);
  return data.data;
};
