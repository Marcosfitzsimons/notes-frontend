import { notePostSchema } from "@/validations/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import useNotes from "@/hooks/use-notes";
import useAuth from "@/hooks/use-auth";
import useAxiosPrivate from "@/hooks/use-axios-private";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface NewNoteFormProps {
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = z.infer<typeof notePostSchema>;

const NewNoteForm = ({ setIsSheetOpen }: NewNoteFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [err, setErr] = useState("");
  const [tags, setTags] = useState<string[]>([]); // State to store tags
  const [tagInput, setTagInput] = useState("");

  const { setNotes } = useNotes();
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
    try {
      const res = await axiosPrivate.post(`/notes`, {
        ...data,
        tags: tags,
      });
      setNotes((prev: any) => {
        return [res.data, ...prev];
      });

      setIsSubmitted(false);
      setIsSheetOpen(false);
      return toast.success(`Note created successfully.`);
    } catch (err: any) {
      console.log(err);
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setIsSubmitted(false);
      setIsSheetOpen(false);
      const errorMsg = err.response?.data?.msg;
      return toast.error(
        errorMsg ? errorMsg : "Error when creating note. Try again later"
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="relative w-full py-6 flex flex-col gap-3 lg:max-w-sm"
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
          <div className="flex items-center gap-1">
            <Input
              name="tagInput"
              id="tagInput"
              value={tagInput} // Display current tags as a comma-separated string
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
                <Badge
                  key={tag}
                  onClick={() => handleDeleteTag(tag)}
                  className="cursor-pointer"
                >
                  {tag} x
                </Badge>
              ))}
            </div>
          )}
        </div>
        {err && <p className="text-red-600 text-sm self-start">{err}</p>}
        <Button type="submit" className="" disabled={isSubmitted}>
          Create
        </Button>
      </form>
    </Form>
  );
};

export default NewNoteForm;
