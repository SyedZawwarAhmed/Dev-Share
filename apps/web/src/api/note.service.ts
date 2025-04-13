import { fetchApi } from "@/lib/fetch";

export const addNote = async (note: CreateNotePayload) => {
  const response = await fetchApi("/notes/add-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to add note");
  }

  return response.json();
};

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetchApi("/notes", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to fetchApi notes");
  }

  return response.json();
};

export const getNote = async (id: string) => {
  const response = await fetchApi(`/notes/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetchApi note");
  }

  return response.json();
};

export const updateNote = async (id: string, note: Note) => {
  const response = await fetchApi(`/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  return response.json();
};

export const deleteNote = async (id: string) => {
  const response = await fetchApi(`/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  return response.json();
};
