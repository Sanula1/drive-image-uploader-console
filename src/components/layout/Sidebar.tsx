
import React from 'react';
import { 
  Building, 
  Building2, 
  Users, 
  GraduationCap, 
  UserCheck, 
  UserX, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  QrCode, 
  Video, 
  FileText, 
  TestTube, 
  Trophy, 
  User, 
  Settings, 
  Palette, 
  Images,
  CreditCard,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/types/auth.types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const { user, selectedInstitute, selectedClass, selectedSubject, selectedChild, selectedOrganization, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const handlePageChange = (page: string) => {
    onPageChange(page);
    onClose();
  };

  const getUserRole = (): UserRole => {
    return (user?.role as UserRole) || 'Student';
  };

  // Check if user can see System Payments
  const canSeeSystemPayments = () => {
    const userRole = getUserRole();
    const allowedRoles: UserRole[] = ['Student', 'Teacher', 'Parent', 'InstituteAdmin'];
    return allowedRoles.includes(userRole) && !selectedInstitute;
  };

  const renderSettingsSection = () => (
    <div className="p-4">
      <h3 className="font-medium text-sm text-muted-foreground mb-3">Settings</h3>
      <div className="space-y-1">
        <Button
          variant={currentPage === 'profile' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => handlePageChange('profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </Button>
        <Button
          variant={currentPage === 'appearance' ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => handlePageChange('appearance')}
        >
          <Palette className="mr-2 h-4 w-4" />
          <span>Appearance</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  const renderMainNavigation = () => {
    const userRole = getUserRole();
    
    // If no institute is selected, show limited navigation
    if (!selectedInstitute) {
      return (
        <>
          <div className="p-4">
            <div className="space-y-1">
              <Button
                variant={currentPage === 'institutes' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handlePageChange('institutes')}
              >
                <Building className="mr-2 h-4 w-4" />
                <span>Institutes</span>
              </Button>
              
              <Button
                variant={currentPage === 'organizations' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handlePageChange('organizations')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>Organizations</span>
              </Button>

              {canSeeSystemPayments() && (
                <Button
                  variant={currentPage === 'system-payments' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => handlePageChange('system-payments')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>System Payments</span>
                </Button>
              )}
            </div>
          </div>
          
          {renderSettingsSection()}
        </>
      );
    }

    return (
      <>
        <div className="p-4">
          <div className="space-y-1">
            <Button
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('dashboard')}
            >
              <Building className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            {(userRole === 'InstituteAdmin' || userRole === 'OrganizationManager') && (
              <Button
                variant={currentPage === 'users' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => handlePageChange('users')}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>Users</span>
              </Button>
            )}
            <Button
              variant={currentPage === 'students' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('students')}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>Students</span>
            </Button>
            <Button
              variant={currentPage === 'teachers' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('teachers')}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Teachers</span>
            </Button>
            <Button
              variant={currentPage === 'parents' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('parents')}
            >
              <UserX className="mr-2 h-4 w-4" />
              <span>Parents</span>
            </Button>
            <Button
              variant={currentPage === 'grades' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('grades')}
            >
              <Trophy className="mr-2 h-4 w-4" />
              <span>Grades</span>
            </Button>
            <Button
              variant={currentPage === 'classes' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('classes')}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Classes</span>
            </Button>
            <Button
              variant={currentPage === 'subjects' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('subjects')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Subjects</span>
            </Button>
            <Button
              variant={currentPage === 'attendance' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('attendance')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Attendance</span>
            </Button>
            <Button
              variant={currentPage === 'qr-attendance' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('qr-attendance')}
            >
              <QrCode className="mr-2 h-4 w-4" />
              <span>QR Attendance</span>
            </Button>
            <Button
              variant={currentPage === 'lectures' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('lectures')}
            >
              <Video className="mr-2 h-4 w-4" />
              <span>Lectures</span>
            </Button>
            <Button
              variant={currentPage === 'homework' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('homework')}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Homework</span>
            </Button>
            <Button
              variant={currentPage === 'exams' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('exams')}
            >
              <TestTube className="mr-2 h-4 w-4" />
              <span>Exams</span>
            </Button>
            <Button
              variant={currentPage === 'results' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('results')}
            >
              <Trophy className="mr-2 h-4 w-4" />
              <span>Results</span>
            </Button>
            <Button
              variant={currentPage === 'institute-details' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('institute-details')}
            >
              <Building className="mr-2 h-4 w-4" />
              <span>Institute Details</span>
            </Button>
            <Button
              variant={currentPage === 'gallery' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handlePageChange('gallery')}
            >
              <Images className="mr-2 h-4 w-4" />
              <span>Gallery</span>
            </Button>
          </div>
        </div>
        {renderSettingsSection()}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
      {/* Backdrop for mobile */}
      <div 
        className="absolute inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative w-64 h-full bg-background border-r flex flex-col ml-auto lg:ml-0">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderMainNavigation()}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} My Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
