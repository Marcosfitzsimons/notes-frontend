import useAxiosPrivate from "@/hooks/use-axios-private";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { Icons } from "./icons";
import { toast } from "sonner";
import useNotes from "@/hooks/use-notes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Note from "./note";
import NewNoteForm from "./new-note-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("actives");

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  const { notes, setNotes } = useNotes();

  const handleDeleteNote = async (id: number) => {
    toast.loading("Removing note...");
    try {
      await axiosPrivate.delete(`/notes/${id}`);
      setNotes(notes.filter((item) => item.id !== id));
      return toast.success(`Note deleted successfully.`);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      const errorMsg = err.response?.data?.msg;
      return toast.error(
        errorMsg ? errorMsg : "Error when deleting note. Try again later"
      );
    }
  };

  const getNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/notes");
      setNotes(res.data);
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setLoading(false);
      setError(true);
      const errorMsg = err.response?.data?.msg;
      return toast.error(
        errorMsg ? errorMsg : "Error loading notes, try again later"
      );
    }
  };

  const activeNotes = notes.filter((note) => !note.isArchived);
  const archivedNotes = notes.filter((note) => note.isArchived);

  const filteredNotes = selectedTab === "actives" ? activeNotes : archivedNotes;

  const filteredBySearch = filteredNotes.filter((note) =>
    note.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    getNotes();
  }, []);

  if (error) {
    return (
      <p className="text-center py-10 text-destructive">
        An error occurred while obtaining notes
      </p>
    );
  }

  return (
    <>
      {loading ? (
        <p className="text-center py-32">
          <Icons.spinner className="mx-auto w-4 h-4 animate-spin" />
        </p>
      ) : (
        <section className="border rounded-lg p-4 bg-container">
          <Tabs
            defaultValue="actives"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="flex flex-col gap-2"
          >
            <div className="w-full flex items-center justify-between">
              <div className="relative w-full max-w-sm flex items-center">
                <Icons.search className="absolute right-3 w-4 h-4 text-card-foreground" />
                <Input
                  type="search"
                  className="w-full max-w-sm"
                  placeholder="Search by tag name..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <TabsList>
                <TabsTrigger value="actives">Actives</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="actives" className="grid gap-2 sm:grid-cols-2">
              {search === "" ? (
                activeNotes.map((note) => (
                  <Note
                    key={note.id}
                    note={note}
                    handleDeleteNote={handleDeleteNote}
                  />
                ))
              ) : filteredBySearch.length === 0 ? (
                <p className="col-start-1 col-end-3 py-10 text-center text-card-foreground">
                  No active notes have been found.
                </p>
              ) : (
                filteredBySearch.map((note) => (
                  <Note
                    key={note.id}
                    note={note}
                    handleDeleteNote={handleDeleteNote}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="archived" className="grid gap-2 sm:grid-cols-2">
              {search === "" ? (
                archivedNotes.map((note) => (
                  <Note
                    key={note.id}
                    note={note}
                    handleDeleteNote={handleDeleteNote}
                  />
                ))
              ) : filteredBySearch.length === 0 ? (
                <p className="col-start-1 col-end-3 py-10 text-center text-card-foreground">
                  No archived notes have been found.
                </p>
              ) : (
                filteredBySearch.map((note) => (
                  <Note
                    key={note.id}
                    note={note}
                    handleDeleteNote={handleDeleteNote}
                  />
                ))
              )}
            </TabsContent>
            <div className="mt-1 self-end">
              <Sheet
                open={isSheetOpen}
                onOpenChange={() => setIsSheetOpen(!isSheetOpen)}
              >
                <SheetTrigger asChild>
                  <div className="self-end flex items-center gap-1">
                    <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/20  after:transition focus-within:after:shadow-slate-100 dark:after:shadow-highlight dark:after:shadow-white/20  dark:focus-within:after:shadow-slate-100">
                      <Button className="h-[28px] py-4 relative bg-black/90 text-slate-100 hover:text-white bg-black hover:bg-black">
                        Create note
                      </Button>
                    </div>
                  </div>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add new note</SheetTitle>
                  </SheetHeader>
                  <NewNoteForm setIsSheetOpen={setIsSheetOpen} />
                </SheetContent>
              </Sheet>
            </div>
          </Tabs>
        </section>
      )}
    </>
  );
};

export default Home;
