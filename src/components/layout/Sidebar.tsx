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
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

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
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={currentPage === 'profile'}
              onClick={() => handlePageChange('profile')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={currentPage === 'appearance'}
              onClick={() => handlePageChange('appearance')}
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>Appearance</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  const renderMainNavigation = () => {
    const userRole = getUserRole();
    
    // If no institute is selected, show limited navigation
    if (!selectedInstitute) {
      return (
        <>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPage === 'institutes'}
                    onClick={() => handlePageChange('institutes')}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    <span>Institutes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPage === 'organizations'}
                    onClick={() => handlePageChange('organizations')}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Organizations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {canSeeSystemPayments() && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={currentPage === 'system-payments'}
                      onClick={() => handlePageChange('system-payments')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>System Payments</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {renderSettingsSection()}
        </>
      );
    }

    return (
      <>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'dashboard'}
                  onClick={() => handlePageChange('dashboard')}
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(userRole === 'InstituteAdmin' || userRole === 'OrganizationManager') && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={currentPage === 'users'}
                    onClick={() => handlePageChange('users')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'students'}
                  onClick={() => handlePageChange('students')}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Students</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'teachers'}
                  onClick={() => handlePageChange('teachers')}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>Teachers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'parents'}
                  onClick={() => handlePageChange('parents')}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Parents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'grades'}
                  onClick={() => handlePageChange('grades')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Grades</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'classes'}
                  onClick={() => handlePageChange('classes')}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Classes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'subjects'}
                  onClick={() => handlePageChange('subjects')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Subjects</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'attendance'}
                  onClick={() => handlePageChange('attendance')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Attendance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'qr-attendance'}
                  onClick={() => handlePageChange('qr-attendance')}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  <span>QR Attendance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'lectures'}
                  onClick={() => handlePageChange('lectures')}
                >
                  <Video className="mr-2 h-4 w-4" />
                  <span>Lectures</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'homework'}
                  onClick={() => handlePageChange('homework')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Homework</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'exams'}
                  onClick={() => handlePageChange('exams')}
                >
                  <TestTube className="mr-2 h-4 w-4" />
                  <span>Exams</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'results'}
                  onClick={() => handlePageChange('results')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Results</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'institute-details'}
                  onClick={() => handlePageChange('institute-details')}
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Institute Details</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'gallery'}
                  onClick={() => handlePageChange('gallery')}
                >
                  <Images className="mr-2 h-4 w-4" />
                  <span>Gallery</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {renderSettingsSection()}
      </>
    );
  };

  return (
    <SidebarPrimitive>
      <SidebarContent className="flex flex-col">
        <SidebarHeader>
          <h2 className="font-semibold text-lg">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </SidebarHeader>
        <SidebarSeparator />
        {renderMainNavigation()}
        <SidebarFooter>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} My Company. All rights reserved.
          </p>
        </SidebarFooter>
      </SidebarContent>
    </SidebarPrimitive>
  );
};

export default Sidebar;
