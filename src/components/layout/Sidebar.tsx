import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  UserCheck, 
  UsersIcon, 
  BookOpen, 
  School, 
  Building, 
  ClipboardCheck, 
  Calendar, 
  FileText, 
  ClipboardList, 
  BookCheck, 
  Trophy, 
  User, 
  Settings, 
  Palette, 
  X,
  Building2,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessControl } from '@/utils/permissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  permission?: string;
}

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const { user, selectedInstitute, selectedOrganization } = useAuth();

  if (!user) return null;

  const navigationItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'view-dashboard' },
    { key: 'users', label: 'Users', icon: Users, permission: 'view-users' },
    { key: 'students', label: 'Students', icon: GraduationCap, permission: 'view-students' },
    { key: 'teachers', label: 'Teachers', icon: UserCheck, permission: 'view-teachers' },
    { key: 'parents', label: 'Parents', icon: UsersIcon, permission: 'view-parents' },
    { key: 'grades', label: 'Grades', icon: BookOpen, permission: 'view-grades' },
    { key: 'classes', label: 'Classes', icon: School, permission: 'view-classes' },
    { key: 'subjects', label: 'Subjects', icon: BookOpen, permission: 'view-subjects' },
    { key: 'institutes', label: 'Institutes', icon: Building, permission: 'view-institutes' },
    { key: 'grading', label: 'Grading', icon: ClipboardCheck, permission: 'view-grading' },
    { key: 'attendance', label: 'Attendance', icon: Calendar, permission: 'view-attendance' },
    { key: 'attendance-marking', label: 'Attendance Marking', icon: ClipboardList, permission: 'mark-attendance' },
    { key: 'attendance-markers', label: 'Attendance Markers', icon: UserCheck, permission: 'manage-attendance-markers' },
    { key: 'qr-attendance', label: 'QR Attendance', icon: ClipboardCheck, permission: 'mark-attendance' },
    { key: 'lectures', label: 'Lectures', icon: FileText, permission: 'view-lectures' },
    { key: 'homework', label: 'Homework', icon: BookCheck, permission: 'view-homework' },
    { key: 'exams', label: 'Exams', icon: FileText, permission: 'view-exams' },
    { key: 'results', label: 'Results', icon: Trophy, permission: 'view-results' },
    { key: 'teacher-students', label: 'Teacher Students', icon: GraduationCap },
    { key: 'teacher-homework', label: 'Teacher Homework', icon: BookCheck },
    { key: 'teacher-exams', label: 'Teacher Exams', icon: FileText },
    { key: 'teacher-lectures', label: 'Teacher Lectures', icon: FileText },
    { key: 'profile', label: 'Profile', icon: User, permission: 'view-profile' },
    { key: 'institute-details', label: 'Institute Details', icon: Building2, permission: 'view-institute-details' },
    { key: 'organizations', label: 'Organizations', icon: Building2, permission: 'view-organizations' },
    { key: 'gallery', label: 'Gallery', icon: Building2, permission: 'view-gallery' },
    { key: 'settings', label: 'Settings', icon: Settings, permission: 'view-settings' },
    { key: 'appearance', label: 'Appearance', icon: Palette, permission: 'view-appearance' },
  ];

  // Payment section items - only for specific user roles
  const paymentItems = [
    { 
      key: 'system-payments', 
      label: 'System Payments', 
      icon: CreditCard,
      permission: 'view-dashboard' as const
    }
  ];

  // Show payment section only for specific roles and when no institute is selected
  const showPaymentSection = !selectedInstitute && 
    ['Student', 'Teacher', 'Parent', 'InstituteAdmin'].includes(user.role) &&
    !selectedOrganization;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-bold">
            {selectedInstitute ? selectedInstitute.name : 'School System'}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Payment Section */}
          {showPaymentSection && (
            <div className="mb-6">
              <h3 className="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                System Payments
              </h3>
              <div className="space-y-1">
                {paymentItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={currentPage === item.key ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onPageChange(item.key);
                      onClose();
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation items */}
          <div className="mb-6">
            <h3 className="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Menu
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                if (item.permission && !AccessControl.hasPermission(user.role, item.permission as any)) {
                  return null;
                }

                return (
                  <Button
                    key={item.key}
                    variant={currentPage === item.key ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onPageChange(item.key);
                      onClose();
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
