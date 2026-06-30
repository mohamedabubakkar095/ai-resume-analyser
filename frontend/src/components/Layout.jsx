import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from '../components/Navbar'; 
import Sidebar, { drawerWidth } from '../components/Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation Bar */}
      <Navbar onSidebarToggle={handleSidebarToggle} />

      {/* Navigation Drawer / Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

      {/* Main App Content View Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Toolbar Spacer to push content below fixed header */}
        <Toolbar />
        
        {/* Child Components Render Area */}
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;