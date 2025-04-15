type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
  createdAt: string;
  updatedAt: string;
};

type CreateNotePayload = {
  title: string;
  content: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED";
};
