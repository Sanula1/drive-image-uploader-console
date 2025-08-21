import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateToPage = useCallback((page: string) => {
    console.log('Navigating to page:', page);
    
    // Map internal page names to URL routes
    const routeMap: Record<string, string> = {
      'dashboard': '/',
      'institutes': '/institutes',
      'institute-users': '/institutes/users', 
      'institute-classes': '/institutes/classes',
      'organizations': '/organizations',
      'profile': '/profile',
      'users': '/users',
      'students': '/students',
      'teachers': '/teachers',
      'parents': '/parents',
      'classes': '/classes',
      'subjects': '/subjects',
      'grades': '/grades',
      'grading': '/grading',
      'attendance': '/attendance',
      'attendance-marking': '/attendance-marking',
      'attendance-markers': '/attendance-markers',
      'qr-attendance': '/qr-attendance',
      'lectures': '/lectures',
      'live-lectures': '/live-lectures',
      'homework': '/homework',
      'exams': '/exams',
      'results': '/results',
      'select-institute': '/select-institute',
      'select-class': '/select-class',
      'select-subject': '/select-subject',
      'parent-children': '/parent-children',
      'teacher-students': '/teacher-students',
      'teacher-homework': '/teacher-homework',
      'teacher-exams': '/teacher-exams',
      'teacher-lectures': '/teacher-lectures',
      'settings': '/settings',
      'appearance': '/appearance',
      'institute-details': '/institute-details',
      'gallery': '/gallery'
    };
    
    const route = routeMap[page] || `/${page}`;
    navigate(route);
  }, [navigate]);

  const getPageFromPath = useCallback((pathname: string): string => {
    // Handle root path
    if (pathname === '/') return 'dashboard';
    
    // Handle nested institute routes  
    if (pathname === '/institutes/users') return 'institute-users';
    if (pathname === '/institutes/classes') return 'institute-classes';
    
    // Remove leading slash for simple routes
    return pathname.slice(1);
  }, []);

  return {
    navigateToPage,
    getPageFromPath
  };
};
