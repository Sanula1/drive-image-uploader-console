
import React, { useState } from 'react';
import AppContent from '@/components/AppContent';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  console.log('Index component rendering');
  
  return (
    <AppContent 
      currentPage={currentPage}
    />
  );
};

export default Index;
