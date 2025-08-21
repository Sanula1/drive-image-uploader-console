
import { useEffect } from "react";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.add(savedTheme);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Main Dashboard Route */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Index />} />
            
            {/* Institute Routes */}
            <Route path="/institutes" element={<Index />} />
            <Route path="/institutes/users" element={<Index />} />
            <Route path="/institutes/classes" element={<Index />} />
            
            {/* Organization Routes */}
            <Route path="/organizations" element={<Index />} />
            
            {/* System Payments Route */}
            <Route path="/system-payments" element={<Index />} />
            
            {/* User Management Routes */}
            <Route path="/users" element={<Index />} />
            <Route path="/students" element={<Index />} />
            <Route path="/teachers" element={<Index />} />
            <Route path="/parents" element={<Index />} />
            
            {/* Academic Routes */}
            <Route path="/classes" element={<Index />} />
            <Route path="/subjects" element={<Index />} />
            <Route path="/grades" element={<Index />} />
            <Route path="/grading" element={<Index />} />
            
            {/* Attendance Routes */}
            <Route path="/attendance" element={<Index />} />
            <Route path="/attendance-marking" element={<Index />} />
            <Route path="/attendance-markers" element={<Index />} />
            <Route path="/qr-attendance" element={<Index />} />
            
            {/* Academic Content Routes */}
            <Route path="/lectures" element={<Index />} />
            <Route path="/live-lectures" element={<Index />} />
            <Route path="/homework" element={<Index />} />
            <Route path="/exams" element={<Index />} />
            <Route path="/results" element={<Index />} />
            
            {/* Selection Routes */}
            <Route path="/select-institute" element={<Index />} />
            <Route path="/select-class" element={<Index />} />
            <Route path="/select-subject" element={<Index />} />
            <Route path="/parent-children" element={<Index />} />
            
            {/* Teacher Specific Routes */}
            <Route path="/teacher-students" element={<Index />} />
            <Route path="/teacher-homework" element={<Index />} />
            <Route path="/teacher-exams" element={<Index />} />
            <Route path="/teacher-lectures" element={<Index />} />
            
            {/* Settings and Profile Routes */}
            <Route path="/profile" element={<Index />} />
            <Route path="/settings" element={<Index />} />
            <Route path="/appearance" element={<Index />} />
            <Route path="/institute-details" element={<Index />} />
            <Route path="/gallery" element={<Index />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
