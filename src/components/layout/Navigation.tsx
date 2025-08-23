
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  BarChart3, 
  Plus, 
  User, 
  Zap,
  Activity,
  Trophy,
  LogOut
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, profile } = useAuth();

  const navItems = [
    { href: "/", label: "Home", icon: Zap },
    { href: "/market", label: "Market", icon: BarChart3 },
    { href: "/groups", label: "Groups", icon: User },
    { href: "/profiles", label: "Profiles", icon: Activity },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/create", label: "Create", icon: Plus },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/c80ed7c1-08da-452b-8e0e-e95790726980.png" 
                alt="SIGNAL" 
                className="h-12 w-auto"
              />
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={isActive ? "signal" : "ghost"}
                      size="sm"
                      className={cn(
                        "gap-2 transition-all",
                        isActive && "shadow-signal"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="signal" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
