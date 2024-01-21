import { Note } from "@/types";
import { Badge } from "./ui/badge";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/use-axios-private";
import useNotes from "@/hooks/use-notes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import EditNote from "./edit-note";
import { formatDate } from "@/lib/utils";

interface NoteProps {
  note: Note;
  handleDeleteNote: (id: number) => void;
}

const Note = ({ note, handleDeleteNote }: NoteProps) => {
  const { notes, setNotes } = useNotes();
  const { setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleArchiveNote = async () => {
    toast.loading("Saving changes...");
    try {
      const res = await axiosPrivate.put(`/notes/${note.id}`, {
        isArchived: !note.isArchived,
      });
      const updatedNotes = [...notes];
      const index = updatedNotes.findIndex((n) => n.id === note.id);
      updatedNotes[index] = res.data;
      setNotes(updatedNotes);
      if (res.data.isArchived) {
        return toast.success(`Note has been archived`);
      } else {
        return toast.success(`Note has been moved to actives`);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      return toast.error(
        errorMsg ? errorMsg : "An error has occurred. Try again later"
      );
    }
  };

  return (
    <article className="relative flex flex-col gap-2 w-full rounded-md p-4 bg-card border">
      <span className="absolute right-2 top-2 text-xs text-card-foreground">
        {formatDate(note.createdAt)}
      </span>

      <h3 className="font-bold text-white">{note.title}</h3>
      <p className="text-sm text-card-foreground">{note.content}</p>
      <div className="flex items-center gap-1">
        {note.tags.map((tag) => (
          <Badge>{tag}</Badge>
        ))}
      </div>
      <div className="absolute right-2 bottom-2 text-xs flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="iconSm" variant="ghost">
                <Icons.archive
                  className="w-4 h-4"
                  onClick={handleArchiveNote}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="py-0">
              <p>Archive</p>
            </TooltipContent>
          </Tooltip>

          <EditNote note={note} />
          <AlertDialog>
            <AlertDialogTrigger className="h-6 w-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.trash className="w-4 aspect-square text-destructive" />
                </TooltipTrigger>
                <TooltipContent className="py-0">
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipProvider>
      </div>
    </article>
  );
};

export default Note;
