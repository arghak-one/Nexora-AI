import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Students from "./pages/Students.tsx";
import StudentProfile from "./pages/StudentProfile.tsx";
import Classes from "./pages/Classes.tsx";
import Teachers from "./pages/Teachers.tsx";
import Results from "./pages/Results.tsx";
import Attendance from "./pages/Attendance.tsx";
import Behaviour from "./pages/Behaviour.tsx";
import Analytics from "./pages/Analytics.tsx";
import AIInsightsPage from "./pages/AIInsightsPage.tsx";
import Fees from "./pages/Fees.tsx";
import Departments from "./pages/Departments.tsx";
import Reports from "./pages/Reports.tsx";
import Parents from "./pages/Parents.tsx";
import ParentProfile from "./pages/ParentProfile.tsx";

import SettingsPage from "./pages/SettingsPage.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import { applySettingsGlobally, getCurrentUserId, getSettings } from "@/lib/settings";

const queryClient = new QueryClient();

const SettingsBootstrap = () => {
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const settings = await getSettings(getCurrentUserId());
      if (!mounted) return;
      applySettingsGlobally(settings);
    };

    void run();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SettingsBootstrap />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/results" element={<Results />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/behaviour" element={<Behaviour />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/parents" element={<Parents />} />
          <Route path="/parents/:id" element={<ParentProfile />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
