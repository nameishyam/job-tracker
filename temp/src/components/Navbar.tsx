import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

function Navbar() {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 border-b fixed top-0 left-0 bg-background z-50">
      <div className="text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0">
        <Link to="/">Career Dock</Link>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
