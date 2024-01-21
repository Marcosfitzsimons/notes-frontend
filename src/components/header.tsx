import useAuth from "@/hooks/use-auth";
import Logo from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Icons } from "./icons";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useLogout from "@/hooks/use-logout";

const Header = () => {
  const { auth } = useAuth();
  const logout = useLogout();
  const user = auth?.user;

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="flex items-center justify-between w-full py-3">
      <div className="">
        <Logo />
      </div>
      {!user ? (
        <div className="flex items-center gap-1">
          <div className="relative after:absolute after:pointer-events-none after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/20  after:transition focus-within:after:shadow-slate-100 dark:after:shadow-highlight dark:after:shadow-white/20  dark:focus-within:after:shadow-slate-100">
            <Button className="h-[28px] p-0 relative bg-black/90 text-slate-100 hover:text-white bg-black hover:bg-black">
              <Link to="/login" className="py-2 px-4">
                Log in
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 ">
            <Avatar className="w-8 h-8">
              <AvatarImage src="#" alt="avatar picture" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <Icons.chevronDown className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border">
            <DropdownMenuLabel className="">
              <span className="text-xs font-medium">@{user.username}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="relative flex items-center gap-2 cursor-pointer p-0 hover:bg-hover/5 dark:hover:bg-hover/50">
              <Icons.note className="absolute left-2 h-4 w-4" />
              <Link
                to="/"
                className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent dark:hover:text-white"
              >
                Notes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="relative flex items-center gap-2 cursor-pointer p-0 hover:bg-hover/5 dark:hover:bg-hover/50">
              <Icons.usercog className="absolute left-2 h-4 w-4" />
              <Link
                to="/"
                className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent dark:hover:text-white"
              >
                Config
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="relative flex items-center gap-2 cursor-pointer p-0 hover:bg-hover/5 dark:hover:bg-hover/50">
              <Icons.logout className="absolute left-2 h-4 w-4" />
              <button
                className="rounded-lg py-1.5 z-20 pl-7 px-2 flex items-center gap-1 w-full text-start bg-transparent dark:hover:text-white"
                onClick={handleLogOut}
              >
                Salir
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
