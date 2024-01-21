import useAuth from "@/hooks/use-auth";
import { Icons } from "./icons";
import BackButton from "./back-button";

const NotFound = () => {
  const { auth } = useAuth();
  const user = auth?.user;

  return (
    <section
      className={`min-h-screen ${
        !user ? "lg:pt-14" : "lg:pt-0"
      } flex flex-col items-center gap-3`}
    >
      <div className="self-start">
        <BackButton linkTo="/" />
      </div>

      <div className="flex flex-col items-center">
        <p className="text-2xl">Ooops!</p>
        <div className="flex items-center gap-1">
          <h1>La página que estás buscando no existe</h1>
          <Icons.frown className="w-5 h-5 shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default NotFound;
