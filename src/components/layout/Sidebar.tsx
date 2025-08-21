
import React from 'react';
import { X, Home, Users, GraduationCap, UserCheck, Building2, BookOpen, ClipboardList, Calendar, FileText, BarChart3, Settings, User, Palette, CreditCard, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const { user, selectedInstitute, logout } = useAuth();

  const handlePageChange = (page: string) => {
    onPageChange(page);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Check if user should have limited navigation (no institute selected and specific roles)
  const shouldShowLimitedNav = !selectedInstitute && 
    (user?.role === 'InstituteAdmin' || user?.role === 'Teacher' || user?.role === 'Student');

  // Limited navigation items for users without institute selection
  const limitedNavItems = [
    {
      label: 'Select Institute',
      icon: Building2,
      page: 'select-institute',
      roles: ['InstituteAdmin', 'Teacher', 'Student']
    },
    {
      label: 'Organizations',
      icon: Building,
      page: 'organizations',
      roles: ['InstituteAdmin', 'Teacher', 'Student']
    },
    {
      label: 'Payment',
      icon: CreditCard,
      page: 'payment',
      roles: ['InstituteAdmin', 'Teacher', 'Student']
    },
    {
      label: 'Profile',
      icon: User,
      page: 'profile',
      roles: ['InstituteAdmin', 'Teacher', 'Student']
    },
    {
      label: 'Appearance',
      icon: Palette,
      page: 'appearance',
      roles: ['InstituteAdmin', 'Teacher', 'Student']
    }
  ];

  // Full navigation items
  const getNavigationItems = () => {
    const userRole = user?.role;
    
    if (userRole === 'Student') {
      return [
        { label: 'Dashboard', icon: Home, page: 'dashboard' },
        { label: 'Attendance', icon: UserCheck, page: 'attendance' },
        { label: 'Lectures', icon: BookOpen, page: 'lectures' },
        { label: 'Homework', icon: ClipboardList, page: 'homework' },
        { label: 'Exams', icon: FileText, page: 'exams' },
        { label: 'Results', icon: BarChart3, page: 'results' }
      ];
    }

    if (userRole === 'Parent') {
      return [
        { label: 'Dashboard', icon: Home, page: 'dashboard' },
        { label: 'Children', icon: Users, page: 'parent-children' },
        { label: 'Attendance', icon: UserCheck, page: 'attendance' },
        { label: 'Homework', icon: ClipboardList, page: 'homework' },
        { label: 'Results', icon: BarChart3, page: 'results' },
        { label: 'Exams', icon: FileText, page: 'exams' }
      ];
    }

    if (userRole === 'Teacher') {
      return [
        { label: 'Dashboard', icon: Home, page: 'dashboard' },
        { label: 'Students', icon: GraduationCap, page: 'students' },
        { label: 'Parents', icon: Users, page: 'parents' },
        { label: 'Classes', icon: Users, page: 'classes' },
        { label: 'Subjects', icon: BookOpen, page: 'subjects' },
        { label: 'Grading', icon: BarChart3, page: 'grading' },
        { label: 'Attendance', icon: UserCheck, page: 'attendance' },
        { label: 'Mark Attendance', icon: UserCheck, page: 'attendance-marking' },
        { label: 'QR Attendance', icon: UserCheck, page: 'qr-attendance' },
        { label: 'Lectures', icon: BookOpen, page: 'lectures' },
        { label: 'Homework', icon: ClipboardList, page: 'homework' },
        { label: 'Exams', icon: FileText, page: 'exams' },
        { label: 'Results', icon: BarChart3, page: 'results' }
      ];
    }

    if (userRole === 'AttendanceMarker') {
      return [
        { label: 'Dashboard', icon: Home, page: 'dashboard' },
        { label: 'QR Attendance', icon: UserCheck, page: 'qr-attendance' },
        { label: 'Mark Attendance', icon: UserCheck, page: 'attendance-marking' }
      ];
    }

    if (userRole === 'OrganizationManager') {
      return [
        { label: 'Dashboard', icon: Home, page: 'dashboard' },
        { label: 'Organizations', icon: Building, page: 'organizations' },
        { label: 'Students', icon: GraduationCap, page: 'students' },
        { label: 'Lectures', icon: BookOpen, page: 'lectures' },
        { label: 'Gallery', icon: FileText, page: 'gallery' }
      ];
    }

    // Default for InstituteAdmin and other roles
    return [
      { label: 'Dashboard', icon: Home, page: 'dashboard' },
      { label: 'Users', icon: Users, page: 'users' },
      { label: 'Students', icon: GraduationCap, page: 'students' },
      { label: 'Teachers', icon: Users, page: 'teachers' },
      { label: 'Parents', icon: Users, page: 'parents' },
      { label: 'Grades', icon: BarChart3, page: 'grades' },
      { label: 'Classes', icon: Users, page: 'classes' },
      { label: 'Subjects', icon: BookOpen, page: 'subjects' },
      { label: 'Institutes', icon: Building2, page: 'institutes' },
      { label: 'Grading', icon: BarChart3, page: 'grading' },
      { label: 'Attendance', icon: UserCheck, page: 'attendance' },
      { label: 'Mark Attendance', icon: UserCheck, page: 'attendance-marking' },
      { label: 'Attendance Markers', icon: Users, page: 'attendance-markers' },
      { label: 'QR Attendance', icon: UserCheck, page: 'qr-attendance' },
      { label: 'Lectures', icon: BookOpen, page: 'lectures' },
      { label: 'Homework', icon: ClipboardList, page: 'homework' },
      { label: 'Exams', icon: FileText, page: 'exams' },
      { label: 'Results', icon: BarChart3, page: 'results' }
    ];
  };

  // Determine which navigation items to show
  const navigationItems = shouldShowLimitedNav 
    ? limitedNavItems.filter(item => item.roles.includes(user?.role || ''))
    : getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            {shouldShowLimitedNav ? 'Navigation' : 'Menu'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.role}
                </p>
              </div>
            </div>
            {selectedInstitute && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Institute: {selectedInstitute.name}
              </div>
            )}
            {shouldShowLimitedNav && (
              <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Please select an institute for full access
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handlePageChange(item.page)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                  ${currentPage === item.page 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
          {!shouldShowLimitedNav && (
            <>
              <button
                onClick={() => handlePageChange('profile')}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                  ${currentPage === 'profile' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => handlePageChange('appearance')}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                  ${currentPage === 'appearance' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </button>

              <button
                onClick={() => handlePageChange('settings')}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
                  ${currentPage === 'settings' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <X className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
