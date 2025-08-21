
import React, { useState, useEffect } from 'react';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Institutes from '@/components/Institutes';
import Organizations from '@/components/Organizations';
import SystemPayments from '@/components/SystemPayments';
import Users from '@/components/Users';
import Students from '@/components/Students';
import Teachers from '@/components/Teachers';
import Parents from '@/components/Parents';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Grades from '@/components/Grades';
import Attendance from '@/components/Attendance';
import QRAttendance from '@/components/QRAttendance';
import Lectures from '@/components/Lectures';
import Homework from '@/components/Homework';
import Exams from '@/components/Exams';
import Results from '@/components/Results';
import InstituteDetails from '@/components/InstituteDetails';
import Gallery from '@/components/Gallery';
import Profile from '@/components/Profile';
import Appearance from '@/components/Appearance';

interface AppContentProps {
  initialPage?: string;
}

const AppContent = ({ initialPage = 'dashboard' }: AppContentProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { navigateToPage } = useAppNavigation();
  const { isAuthenticated, login, isLoading } = useAuth();

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    navigateToPage(page);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = async (loginResponse: any) => {
    // Login handled by the Login component itself via useAuth
    console.log('Login successful:', loginResponse);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'institutes':
        return <Institutes />;
      case 'organizations':
        return <Organizations />;
      case 'system-payments':
        return <SystemPayments />;
      case 'users':
        return <Users />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'parents':
        return <Parents />;
      case 'classes':
        return <Classes />;
      case 'subjects':
        return <Subjects />;
      case 'grades':
        return <Grades />;
      case 'attendance':
        return <Attendance />;
      case 'qr-attendance':
        return <QRAttendance />;
      case 'lectures':
        return <Lectures />;
      case 'homework':
        return <Homework />;
      case 'exams':
        return <Exams />;
      case 'results':
        return <Results />;
      case 'institute-details':
        return <InstituteDetails />;
      case 'gallery':
        return <Gallery />;
      case 'profile':
        return <Profile />;
      case 'appearance':
        return <Appearance />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading spinner while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={handleLogin}
        loginFunction={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AppContent;
