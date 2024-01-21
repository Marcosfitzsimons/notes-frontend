import { useContext} from "react";
import NotesContext, { NotesContextType } from "../context/notes-context"; // Import AuthContextType

const useNotes = ():NotesContextType => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used within an NotesProvider");
  }

  return context; // Return the entire context object
};

export default useNotes;
