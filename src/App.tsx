
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Profiles from "./pages/Profiles";
import Leaderboard from "./pages/Leaderboard";
import Create from "./pages/Create";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import CreateGroup from "./pages/CreateGroup";
import SignalDetail from "./pages/SignalDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Vaults from "./pages/Vaults";
import BlindSignals from "./pages/BlindSignals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/market" element={<Market />} />
          <Route path="/vaults" element={<Vaults />} />
          <Route path="/blind-signals" element={<BlindSignals />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetail />} />
        <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/signal/:id" element={<SignalDetail />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
