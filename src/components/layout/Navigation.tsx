import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Users, 
  Layers,
  Trophy,
  Plus,
  User,
  LogOut,
  Home,
  Vault,
  Eye,
  LogIn
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/c80ed7c1-08da-452b-8e0e-e95790726980.png" 
              alt="SIGNAL" 
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            
            <Link to="/market">
              <Button 
                variant={isActive("/market") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Market
              </Button>
            </Link>

            <Link to="/vaults">
              <Button 
                variant={isActive("/vaults") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Vault className="w-4 h-4" />
                Vaults
              </Button>
            </Link>

            <Link to="/blind-signals">
              <Button 
                variant={isActive("/blind-signals") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Blind Signals
              </Button>
            </Link>

            <Link to="/groups">
              <Button 
                variant={isActive("/groups") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                Groups
              </Button>
            </Link>

            <Link to="/profiles">
              <Button 
                variant={isActive("/profiles") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Profiles
              </Button>
            </Link>

            <Link to="/leaderboard">
              <Button 
                variant={isActive("/leaderboard") ? "signal" : "ghost"} 
                size="sm"
                className="gap-2"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
            </Link>

            {user && (
              <Link to="/create">
                <Button variant="signal" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Signal
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {profile && (
                    <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="signal" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
