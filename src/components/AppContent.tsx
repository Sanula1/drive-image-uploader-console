import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import Users from '@/components/Users';
import Students from '@/components/Students';
import Teachers from '@/components/Teachers';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Institutes from '@/components/Institutes';
import Organizations from '@/components/Organizations';
import OrganizationSelector from '@/components/OrganizationSelector';
import OrganizationManagement from '@/components/OrganizationManagement';
import InstituteSelector from '@/components/InstituteSelector';
import ClassSelector from '@/components/ClassSelector';
import SubjectSelector from '@/components/SubjectSelector';
import ParentChildrenSelector from '@/components/ParentChildrenSelector';
import Attendance from '@/components/Attendance';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceMarkers from '@/components/AttendanceMarkers';
import QRAttendance from '@/components/QRAttendance';
import Lectures from '@/components/Lectures';
import Homework from '@/components/Homework';
import Exams from '@/components/Exams';
import Results from '@/components/Results';
import Grading from '@/components/Grading';
import LiveLectures from '@/components/LiveLectures';
import Settings from '@/components/Settings';
import Profile from '@/components/Profile';
import Appearance from '@/components/Appearance';
import InstituteDetails from '@/components/InstituteDetails';
import Parents from '@/components/Parents';
import InstituteUsers from '@/components/InstituteUsers';
import Gallery from '@/components/Gallery';
import SystemPayments from '@/components/SystemPayments';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'students':
        return <Students />;
      case 'teachers':
        return <Teachers />;
      case 'classes':
        return <Classes />;
      case 'subjects':
        return <Subjects />;
      case 'institutes':
        return <Institutes />;
      case 'organizations':
        return <Organizations />;
      case 'organization-management':
        return <OrganizationManagement />;
      case 'organization-selector':
        return <OrganizationSelector />;
      case 'institute-selector':
        return <InstituteSelector />;
      case 'select-class':
        return <ClassSelector />;
      case 'select-subject':
        return <SubjectSelector />;
      case 'parent-children-selector':
        return <ParentChildrenSelector />;
      case 'attendance':
        return <Attendance />;
      case 'attendance-marking':
        return <AttendanceMarking />;
      case 'attendance-markers':
        return <AttendanceMarkers />;
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
      case 'grading':
        return <Grading />;
      case 'live-lectures':
        return <LiveLectures />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'appearance':
        return <Appearance />;
      case 'institute-details':
        return <InstituteDetails />;
      case 'parents':
        return <Parents />;
      case 'institute-users':
        return <InstituteUsers />;
      case 'gallery':
        return <Gallery />;
      case 'system-payments':
      case 'payment-history':
        return <SystemPayments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
};

export default AppContent;
