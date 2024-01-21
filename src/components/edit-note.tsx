import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/use-axios-private";
import useAuth from "@/hooks/use-auth";
import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Textarea } from "./ui/textarea";
import { Note } from "@/types";
import useNotes from "@/hooks/use-notes";
import { zodResolver } from "@hookform/resolvers/zod";
import { notePostSchema } from "@/validations/validations";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Badge } from "./ui/badge";
import { Icons } from "./icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type EditNoteProps = {
  note: Note;
};

type FormData = z.infer<typeof notePostSchema>;

const EditNote = ({ note }: EditNoteProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [err, setErr] = useState("");
  const [tags, setTags] = useState<string[]>([]); // State to store tags
  const [tagInput, setTagInput] = useState("");

  const { notes, setNotes } = useNotes();
  const { setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(notePostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const handleOnSubmit = async (data: z.infer<typeof notePostSchema>) => {
    if (tags.length === 0) {
      return toast.error(`Notes must contain at least 1 tag.`);
    }
    setIsSubmitted(true);
    setErr("");

    toast.loading("Updating note...");

    try {
      const res = await axiosPrivate.put(`/notes/${note.id}`, {
        ...data,
        tags: tags,
      });
      const updatedNotes = [...notes];
      const index = updatedNotes.findIndex((n) => n.id === note.id);
      updatedNotes[index] = res.data;
      setNotes(updatedNotes);
      setIsSubmitted(false);
      setIsEditDialogOpen(false);
      toast.success("Note updated successfully");
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setIsSubmitted(false);
      const errorMsg = err.response?.data?.msg;
      return toast.error(
        errorMsg ? errorMsg : "Error when updating note. Try again later"
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.length > 8) {
      return toast.error("Tag must be at most 10 characters.");
    } else if (tagInput.length === 0) {
      return toast.error("Tag cannot be empty.");
    } else if (tags.find((tag) => tag === tagInput)) {
      return toast.error("Tag already exists.");
    }
    const newTag = tagInput;
    if (tags.length >= 3) {
      return toast.error("Cannot add more that 3 tags per note.");
    }
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
  };

  useEffect(() => {
    form.reset({
      title: note.title,
      content: note.content,
    });
    setTags(note.tags);
  }, []);

  return (
    <Dialog
      open={isEditDialogOpen}
      onOpenChange={() => setIsEditDialogOpen(!isEditDialogOpen)}
    >
      <DialogTrigger className="h-6 w-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground">
        <Tooltip>
          <TooltipTrigger asChild>
            <Icons.edit className="w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent className="py-0">
            <p>Edit</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
          <DialogDescription>Editá un producto existente</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="relative w-full py-6 flex flex-col gap-3 "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <Label htmlFor="tagInput">Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  name="tagInput"
                  id="tagInput"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                />
                <Button onClick={handleAddTag} type="button">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex items-center gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} onClick={() => handleDeleteTag(tag)}>
                      {tag} x
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {err && <p className="text-red-600 text-sm self-start">{err}</p>}
            <Button type="submit" className="" disabled={isSubmitted}>
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNote;
