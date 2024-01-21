import { Note } from "@/types";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface NotesProviderProps {
  children: ReactNode;
}

export interface NotesContextType {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export default NotesContext;
