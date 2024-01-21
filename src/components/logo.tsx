import { Link } from "react-router-dom";
import { Icons } from "./icons";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 transition-colors hover:text-white"
    >
      <Icons.note className="w-5 h-5" />
      <span className="font-medium">Notes App</span>
    </Link>
  );
};

export default Logo;
