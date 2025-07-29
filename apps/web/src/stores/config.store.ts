import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: ConfigState = {
  notesView: "list",
  postsView: "list",
};

export const useConfigStore = create<
  ConfigState & {
    setNotesView: (notesView: ConfigState["notesView"]) => void;
    setPostsView: (postsView: ConfigState["postsView"]) => void;
  }
>()(
  persist(
    (set) => ({
      ...initialState,
      setNotesView: (notesView) => set({ notesView }),
      setPostsView: (postsView) => set({ postsView }),
    }),
    {
      name: "config",
    },
  ),
);
