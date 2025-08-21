
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  FileText, 
  Calculator, 
  BarChart3, 
  Settings, 
  User, 
  Home, 
  School,
  UserCheck,
  QrCode,
  Play,
  Image,
  Clock,
  Trophy,
  X,
  Palette,
  CreditCard,
  UserCircle,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) => {
  const { user, selectedInstitute } = useAuth();

  if (!user) {
    return null;
  }

  const userRole = user.role as any;

  // Check if user needs institute selection and is eligible for restricted navigation
  const needsInstituteSelection = !selectedInstitute && 
    ['InstituteAdmin', 'Teacher', 'Student'].includes(userRole);

  // Restricted navigation items when no institute is selected
  const restrictedNavItems = [
    {
      label: 'Select Institute',
      icon: Building2,
      page: 'select-institute',
      permission: null
    },
    {
      label: 'Organizations',
      icon: Building,
      page: 'organizations',
      permission: null
    },
    {
      label: 'Payment',
      icon: CreditCard,
      page: 'payment',
      permission: null
    },
    {
      label: 'Profile',
      icon: UserCircle,
      page: 'profile',
      permission: 'view-profile'
    },
    {
      label: 'Appearance',
      icon: Palette,
      page: 'appearance',
      permission: 'view-appearance'
    }
  ];

  // Full navigation items when institute is selected or for other roles
  const fullNavItems = [
    {
      label: 'Dashboard',
      icon: Home,
      page: 'dashboard',
      permission: 'view-dashboard'
    },
    ...(userRole === 'InstituteAdmin' ? [
      {
        label: 'Users',
        icon: Users,
        page: 'institute-users',
        permission: 'view-users'
      }
    ] : userRole !== 'Student' && userRole !== 'Parent' && userRole !== 'AttendanceMarker' ? [
      {
        label: 'Users',
        icon: Users,
        page: 'users',
        permission: 'view-users'
      }
    ] : []),
    ...(userRole !== 'AttendanceMarker' ? [
      {
        label: 'Students',
        icon: GraduationCap,
        page: 'students',
        permission: 'view-students'
      }
    ] : []),
    ...(userRole === 'InstituteAdmin' || userRole === 'Teacher' ? [
      {
        label: 'Teachers',
        icon: User,
        page: 'teachers',
        permission: 'view-teachers'
      },
      {
        label: 'Parents',
        icon: Users,
        page: 'parents',
        permission: 'view-parents'
      }
    ] : []),
    ...(userRole === 'InstituteAdmin' || userRole === 'Teacher' ? [
      {
        label: 'Classes',
        icon: School,
        page: 'classes',
        permission: 'view-classes'
      },
      {
        label: 'Subjects',
        icon: BookOpen,
        page: 'subjects',
        permission: 'view-subjects'
      }
    ] : []),
    ...(userRole === 'InstituteAdmin' ? [
      {
        label: 'Institutes',
        icon: Building,
        page: 'institutes',
        permission: 'view-institutes'
      }
    ] : []),
    {
      label: 'Attendance',
      icon: ClipboardList,
      page: 'attendance',
      permission: 'view-attendance'
    },
    ...(userRole === 'Teacher' || userRole === 'InstituteAdmin' || userRole === 'AttendanceMarker' ? [
      {
        label: 'Mark Attendance',
        icon: UserCheck,
        page: 'attendance-marking',
        permission: 'mark-attendance'
      }
    ] : []),
    ...(userRole === 'AttendanceMarker' ? [
      {
        label: 'QR Attendance',
        icon: QrCode,
        page: 'qr-attendance',
        permission: 'mark-attendance'
      }
    ] : []),
    ...(userRole === 'InstituteAdmin' ? [
      {
        label: 'Attendance Markers',
        icon: Users,
        page: 'attendance-markers',
        permission: 'manage-attendance-markers'
      }
    ] : []),
    ...(userRole !== 'AttendanceMarker' ? [
      {
        label: 'Grades',
        icon: BarChart3,
        page: userRole === 'Teacher' || userRole === 'InstituteAdmin' ? 'grading' : 'grades',
        permission: 'view-grades'
      }
    ] : []),
    {
      label: 'Lectures',
      icon: Play,
      page: 'lectures',
      permission: 'view-lectures'
    },
    ...(userRole === 'Student' || userRole === 'Parent' || userRole === 'Teacher' || userRole === 'InstituteAdmin' ? [
      {
        label: 'Homework',
        icon: FileText,
        page: 'homework',
        permission: 'view-homework'
      }
    ] : []),
    ...(userRole !== 'AttendanceMarker' ? [
      {
        label: 'Exams',
        icon: Clock,
        page: 'exams',
        permission: 'view-exams'
      },
      {
        label: 'Results',
        icon: Trophy,
        page: 'results',
        permission: 'view-results'
      }
    ] : []),
    ...(userRole === 'OrganizationManager' ? [
      {
        label: 'Gallery',
        icon: Image,
        page: 'gallery',
        permission: 'view-gallery'
      },
      {
        label: 'Organizations',
        icon: Building,
        page: 'organizations',
        permission: 'view-organizations'
      }
    ] : [])
  ];

  // Choose navigation items based on whether institute selection is needed
  const navigationItems = needsInstituteSelection ? restrictedNavItems : fullNavItems;

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.permission) return true;
    return AccessControl.hasPermission(userRole, item.permission);
  });

  const handleNavigation = (page: string) => {
    onPageChange(page);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EMS</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">EduManage</h1>
              {needsInstituteSelection && (
                <Badge variant="outline" className="text-xs mt-1">
                  Select Institute
                </Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name || `${user.firstName} ${user.lastName}`.trim() || user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <Button
                key={item.page}
                variant={currentPage === item.page ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  currentPage === item.page 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleNavigation(item.page)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              className="w-full justify-start text-sm"
              onClick={() => handleNavigation('profile')}
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            <Button
              variant={currentPage === 'appearance' ? 'default' : 'ghost'}
              className="w-full justify-start text-sm"
              onClick={() => handleNavigation('appearance')}
            >
              <Palette className="h-4 w-4 mr-3" />
              Appearance
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
