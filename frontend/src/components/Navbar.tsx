import { Waypoints } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <div className="flex items-center border py-2 px-4 rounded-xl sticky top-0 dark:bg-gray-800 bg-white">
      <div className="flex-1 flex items-center justify-start">
        <div className="flex items-center gap-3">
          <Waypoints />
          <p className="text-lg font-bold">Bridge</p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
