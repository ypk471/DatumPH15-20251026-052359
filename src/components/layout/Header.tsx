import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, User, Shield } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
type HeaderProps = {
  onAddDocument: () => void;
};
export function Header({ onAddDocument }: HeaderProps) {
  const { user, logout } = useAuthStore();
  return (
    <header className="flex items-center justify-between py-4 flex-wrap gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        Datum
      </h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.username}</span>
            </div>
            {user.isAdmin && (
              <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Link to="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
          </>
        )}
        <Button onClick={onAddDocument} className="transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Document
        </Button>
        <Button onClick={logout} variant="outline" size="icon" aria-label="Logout" className="transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}