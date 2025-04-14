import apiService from "@/lib/api";
import { fetchApi, getCookie } from "@/lib/fetch";

export const getNotes = async () => {
  // console.log(
  //   '\n\n ---> apps/web/src/api/note.service.ts:19 -> getCookie("access_token"): ',
  //   getCookie("access_token")
  // );
  // const response = await fetchApi("/notes", {
  //   method: "POST",
  //   headers: {
  //     // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6bnVsbCwiZW1haWwiOiJ6YXd3YXIuYWhtZWQxMkBnbWFpbC5jb20iLCJzdWIiOiJjbTlkbDhiaHAwMDAwdW91MmNueWt5bHU2IiwiaWF0IjoxNzQ0NTY5NDUyLCJleHAiOjE3NDQ2NTU4NTJ9.A4zu5tF1tsN9UWYG7A8QmdRU5U6AXkgppGahgtlGHGc`,
  //     Authorization: `Bearer ${getCookie("access_token")}`,
  //   },
  // });

  // if (!response.ok) {
  //   throw new Error("Failed to fetchApi notes");
  // }

  // return response.json();
  const data = await apiService.post<Note[]>("/notes");
  return data.data;
};

export const addNote = async (note: CreateNotePayload) => {
  const response = await fetchApi("/notes/add-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access_token")}`,
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to add note");
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
