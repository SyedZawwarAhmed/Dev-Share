type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: "DRAFT" | "ACTIVE";
  postCount: number;
  createdAt: string;
  updatedAt: string;
};

type CreateNotePayload = {
  title: string;
  content: string;
  status: "DRAFT" | "ACTIVE";
};
