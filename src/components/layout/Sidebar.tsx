import {
  Building,
  Building2,
  CreditCard,
  LayoutDashboard,
  Palette,
  Settings,
  User,
  Users,
  BookOpenCheck,
  School,
  UserPlus,
  UserRoundCog,
  Book,
  ListChecks,
  BarChart,
  Presentation,
  Image,
  Home,
  Calendar,
  FileVideo,
  FileSearch,
  BarChart3,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  currentPage, 
  onPageChange 
}: SidebarProps) {
  const { user, selectedInstitute } = useAuth();
  
  if (!user) return null;

  // Check if user is InstituteAdmin, Teacher, or Student without institute selected
  const isLimitedNavigation = 
    (user.userType === 'INSTITUTE_ADMIN' || user.userType === 'TEACHER' || user.userType === 'STUDENT') && 
    !selectedInstitute;

  // Limited navigation items for when no institute is selected
  const limitedNavItems = [
    {
      title: "Select Institute",
      icon: Building2,
      onClick: () => onPageChange('institutes'),
      active: currentPage === 'institutes'
    },
    {
      title: "Organizations", 
      icon: Building,
      onClick: () => onPageChange('organizations'),
      active: currentPage === 'organizations'
    },
    {
      title: "Payment",
      icon: CreditCard,
      onClick: () => onPageChange('payment'),
      active: currentPage === 'payment'
    },
    {
      title: "Profile",
      icon: User,
      onClick: () => onPageChange('profile'),
      active: currentPage === 'profile'
    },
    {
      title: "Appearance",
      icon: Palette,
      onClick: () => onPageChange('appearance'),
      active: currentPage === 'appearance'
    }
  ];

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onPageChange('dashboard'),
      active: currentPage === 'dashboard'
    },
    {
      title: "Users",
      icon: Users,
      onClick: () => onPageChange('users'),
      active: currentPage === 'users'
    },
    {
      title: "Students",
      icon: School,
      onClick: () => onPageChange('students'),
      active: currentPage === 'students'
    },
    {
      title: "Parents",
      icon: UserPlus,
      onClick: () => onPageChange('parents'),
      active: currentPage === 'parents'
    },
    {
      title: "Teachers",
      icon: UserRoundCog,
      onClick: () => onPageChange('teachers'),
      active: currentPage === 'teachers'
    },
    {
      title: "Classes",
      icon: BookOpenCheck,
      onClick: () => onPageChange('classes'),
      active: currentPage === 'classes'
    },
    {
      title: "Subjects",
      icon: Book,
      onClick: () => onPageChange('subjects'),
      active: currentPage === 'subjects'
    },
    {
      title: "Institutes",
      icon: Building2,
      onClick: () => onPageChange('institutes'),
      active: currentPage === 'institutes'
    },
    {
      title: "Attendance",
      icon: ListChecks,
      onClick: () => onPageChange('attendance'),
      active: currentPage === 'attendance'
    },
    {
      title: "Attendance Marking",
      icon: Calendar,
      onClick: () => onPageChange('attendance-marking'),
      active: currentPage === 'attendance-marking'
    },
    {
      title: "Attendance Markers",
      icon: Calendar,
      onClick: () => onPageChange('attendance-markers'),
      active: currentPage === 'attendance-markers'
    },
    {
      title: "New Attendance",
      icon: Calendar,
      onClick: () => onPageChange('new-attendance'),
      active: currentPage === 'new-attendance'
    },
    {
      title: "Grades",
      icon: BarChart,
      onClick: () => onPageChange('grades'),
      active: currentPage === 'grades'
    },
    {
      title: "Grading",
      icon: BarChart3,
      onClick: () => onPageChange('grading'),
      active: currentPage === 'grading'
    },
    {
      title: "Lectures",
      icon: Presentation,
      onClick: () => onPageChange('lectures'),
      active: currentPage === 'lectures'
    },
    {
      title: "Live Lectures",
      icon: FileVideo,
      onClick: () => onPageChange('live-lectures'),
      active: currentPage === 'live-lectures'
    },
    {
      title: "Gallery",
      icon: Image,
      onClick: () => onPageChange('gallery'),
      active: currentPage === 'gallery'
    },
    {
      title: "Homework",
      icon: Home,
      onClick: () => onPageChange('homework'),
      active: currentPage === 'homework'
    },
    {
      title: "Exams",
      icon: FileSearch,
      onClick: () => onPageChange('exams'),
      active: currentPage === 'exams'
    },
    {
      title: "Results",
      icon: BarChart,
      onClick: () => onPageChange('results'),
      active: currentPage === 'results'
    },
    {
      title: "Profile",
      icon: User,
      onClick: () => onPageChange('profile'),
      active: currentPage === 'profile'
    },
    {
      title: "Institute Details",
      icon: Building,
      onClick: () => onPageChange('institute-details'),
      active: currentPage === 'institute-details'
    },
    {
      title: "Organizations",
      icon: Building,
      onClick: () => onPageChange('organizations'),
      active: currentPage === 'organizations'
    },
    {
      title: "Payment",
      icon: CreditCard,
      onClick: () => onPageChange('payment'),
      active: currentPage === 'payment'
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => onPageChange('settings'),
      active: currentPage === 'settings'
    },
    {
      title: "Appearance",
      icon: Palette,
      onClick: () => onPageChange('appearance'),
      active: currentPage === 'appearance'
    }
  ];

  const getFilteredNavItems = () => {
    if (!user) return [];

    const userType = user.userType?.toUpperCase();
    
    switch (userType) {
      case 'STUDENT':
        return navItems.filter(item => 
          ['Dashboard', 'Attendance', 'Grades', 'Lectures', 'Homework', 'Exams', 'Results', 'Profile', 'Appearance'].includes(item.title)
        );
      case 'PARENT':
        return navItems.filter(item => 
          ['Dashboard', 'Students', 'Attendance', 'Grades', 'Lectures', 'Homework', 'Exams', 'Results', 'Profile', 'Appearance'].includes(item.title)
        );
      case 'TEACHER':
        return navItems.filter(item => 
          ['Dashboard', 'Users', 'Students', 'Parents', 'Classes', 'Subjects', 'Attendance', 'Grades', 'Grading', 'Lectures', 'Homework', 'Exams', 'Results', 'Profile', 'Appearance'].includes(item.title)
        );
      case 'INSTITUTE_ADMIN':
        return navItems.filter(item => 
          ['Dashboard', 'Users', 'Students', 'Parents', 'Teachers', 'Classes', 'Subjects', 'Institutes', 'Attendance', 'Attendance Markers', 'Grades', 'Grading', 'Lectures', 'Homework', 'Exams', 'Results', 'Profile', 'Institute Details', 'Appearance'].includes(item.title)
        );
      case 'ORGANIZATION_MANAGER':
        return navItems.filter(item => 
          ['Dashboard', 'Students', 'Lectures', 'Gallery', 'Users', 'Parents', 'Teachers',  'Grades', 'Classes', 'Subjects', 'Institutes', 'Attendance', 'Attendance Markers', 'Grading', 'Homework', 'Exams', 'Results', 'Organizations', 'Profile', 'Settings', 'Appearance'].includes(item.title)
        );
      case 'ATTENDANCE_MARKER':
        return navItems.filter(item => 
          ['Dashboard', 'Students', 'Classes', 'Subjects', 'Attendance', 'Attendance Marking', 'Profile', 'Appearance'].includes(item.title)
        );
      default:
        return navItems;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-sidebar border-r transform transition-transform duration-200 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-sidebar-foreground">EduPortal</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {(isLimitedNavigation ? limitedNavItems : getFilteredNavItems()).map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.active && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={item.onClick}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
