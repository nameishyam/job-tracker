import { Link, useNavigate } from "react-router-dom";
import ModeToggle from "@/components/mode-toggle";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { api } from "@/lib/api";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await api.delete("/users");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again later.");
    }
  };

  return (
    <div className="w-full h-16 flex items-center justify-between px-4 border-b fixed top-0 left-0 bg-background z-50">
      <div className="flex items-center gap-6 py-2">
        <Link to="/">
          <div className="text-xl flex flex-row font-bold hover:opacity-80 transition-opacity cursor-pointer items-center gap-1">
            <span>Career</span>
            <span className="text-primary">Dock</span>
          </div>
        </Link>

        <Link to="/reviews">
          <Button className="h-8 hover:cursor-pointer" variant="outline">
            Public Reviews
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated() ? (
          <>
            <div className="flex flex-row flex-wrap items-center gap-12">
              <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user?.profile_url || ""} />
                      <AvatarFallback className="text-xs">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onSelect={() => navigate("/profile")}
                        className="hover:cursor-pointer"
                      >
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => navigate("/dashboard")}
                        className="hover:cursor-pointer"
                      >
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          logout();
                          toast.success("Logged out successfully");
                        }}
                        className="hover:cursor-pointer"
                      >
                        Log out
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-400 focus:text-red-500 hover:cursor-pointer"
                        onSelect={(e) => {
                          e.preventDefault();
                          setIsOpen(true);
                        }}
                      >
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={handleDelete}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <ModeToggle />
          </>
        ) : (
          <ModeToggle />
        )}
      </div>
    </div>
  );
}

export default Navbar;
