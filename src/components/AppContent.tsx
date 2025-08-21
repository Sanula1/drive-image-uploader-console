import React from 'react';
import Dashboard from '@/components/Dashboard';
import Users from '@/components/Users';
import Students from '@/components/Students';
import Parents from '@/components/Parents';
import Teachers from '@/components/Teachers';
import Classes from '@/components/Classes';
import Subjects from '@/components/Subjects';
import Institutes from '@/components/Institutes';
import Attendance from '@/components/Attendance';
import AttendanceMarking from '@/components/AttendanceMarking';
import AttendanceMarkers from '@/components/AttendanceMarkers';
import NewAttendance from '@/components/NewAttendance';
import Grades from '@/components/Grades';
import Grading from '@/components/Grading';
import Lectures from '@/components/Lectures';
import LiveLectures from '@/components/LiveLectures';
import Gallery from '@/components/Gallery';
import Homework from '@/components/Homework';
import Exams from '@/components/Exams';
import Results from '@/components/Results';
import Profile from '@/components/Profile';
import InstituteDetails from '@/components/InstituteDetails';
import Organizations from '@/components/Organizations';
import Settings from '@/components/Settings';
import Appearance from '@/components/Appearance';
import Payment from './Payment';

interface AppContentProps {
  currentPage: string;
}

const AppContent: React.FC<AppContentProps> = ({ currentPage }) => {
  return (
    <div className="flex-1 overflow-auto">
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'users' && <Users />}
      {currentPage === 'students' && <Students />}
      {currentPage === 'parents' && <Parents />}
      {currentPage === 'teachers' && <Teachers />}
      {currentPage === 'classes' && <Classes />}
      {currentPage === 'subjects' && <Subjects />}
      {currentPage === 'institutes' && <Institutes />}
      {currentPage === 'attendance' && <Attendance />}
      {currentPage === 'attendance-marking' && <AttendanceMarking />}
      {currentPage === 'attendance-markers' && <AttendanceMarkers />}
      {currentPage === 'new-attendance' && <NewAttendance />}
      {currentPage === 'grades' && <Grades />}
      {currentPage === 'grading' && <Grading />}
      {currentPage === 'lectures' && <Lectures />}
      {currentPage === 'live-lectures' && <LiveLectures />}
      {currentPage === 'gallery' && <Gallery />}
      {currentPage === 'homework' && <Homework />}
      {currentPage === 'exams' && <Exams />}
      {currentPage === 'results' && <Results />}
      {currentPage === 'profile' && <Profile />}
      {currentPage === 'institute-details' && <InstituteDetails />}
      {currentPage === 'organizations' && <Organizations />}
      {currentPage === 'payment' && <Payment />}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'appearance' && <Appearance />}
    </div>
  );
};

export default AppContent;
