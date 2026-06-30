// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import CircularProgress from '@mui/material/CircularProgress';
// import Box from '@mui/material/Box';

// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, loading, isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress color="primary" />
//       </Box>
//     );
//   }

//   if (!isAuthenticated) {
//     // Redirect to login page and save original path
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (adminOnly && user?.role !== 'admin') {
//     // Admin only pages, normal user gets redirected to dashboard
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      /* Fixed styling: system props moved inside the sx prop */
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and save original path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    // Admin only pages, normal user gets redirected to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;