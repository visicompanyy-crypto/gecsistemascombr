import { User, CreditCard, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

function getUserInitials(email: string | undefined): string {
  if (!email) return "US";
  const name = email.split('@')[0];
  if (name.length >= 2) {
    return name.substring(0, 2).toUpperCase();
  }
  return name.toUpperCase();
}

export function UserMenu() {
  const navigate = useNavigate();
  const { user, subscription, signOut } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    queryClient.clear();
    await signOut();
    navigate("/");
  };

  const initials = getUserInitials(user?.email);
  const userName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover border border-border shadow-lg">
        <DropdownMenuLabel className="py-3">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground capitalize">
                {userName}
              </p>
            </div>
            <p className="text-xs text-muted-foreground pl-6">{user?.email}</p>
            <div className="flex items-center gap-2 pl-6 mt-1">
              {subscription?.subscribed ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  <CreditCard className="h-3 w-3" />
                  Assinante
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  <CreditCard className="h-3 w-3" />
                  Plano gratuito
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-3 py-2.5 cursor-pointer">
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/pricing")}
          className="gap-3 py-2.5 cursor-pointer"
        >
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span>{subscription?.subscribed ? "Gerenciar assinatura" : "Ver planos"}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="gap-3 py-2.5 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
