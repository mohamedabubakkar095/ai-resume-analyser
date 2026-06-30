// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import { ThemeModeProvider } from './context/ThemeContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Layout from './components/Layout';

// // Pages
// import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import UploadResume from './pages/UploadResume';
// import AnalysisReport from './pages/AnalysisReport';
// import History from './pages/History';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/AdminDashboard';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <ThemeModeProvider>
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Protected Candidate Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Dashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/analyze"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <UploadResume />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/report/:id"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <AnalysisReport />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/history"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <History />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Profile />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Protected Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute adminOnly>
//                   <Layout>
//                     <AdminDashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Fallback 404 Route */}
//             <Route
//               path="*"
//               element={
//                 <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
//                   <Typography variant="h3" fontWeight={800} gutterBottom>404</Typography>
//                   <Typography variant="body1" color="text.secondary">Page not found</Typography>
//                 </Box>
//               }
//             />
//           </Routes>
//         </ThemeModeProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// // Inline fallback box helper in case MUI Box/Typography is not defined inside routing fallback
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';

// export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";

// import { AuthProvider } from "./context/AuthContext";
// import { ThemeModeProvider } from "./context/ThemeContext";

// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/Layout";

// import LandingPage from "./pages/LandingPage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import UploadResume from "./pages/UploadResume";
// import AnalysisReport from "./pages/AnalysisReport";
// import History from "./pages/History";
// import Profile from "./pages/Profile";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <ThemeModeProvider>
//           <Routes>

//             {/* Public */}
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Dashboard */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Dashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Upload */}
//             <Route
//               path="/analyze"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <UploadResume />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Report */}
//             <Route
//               path="/report/:id"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <AnalysisReport />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* History */}
//             <Route
//               path="/history"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <History />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Profile */}
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Profile />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin */}
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute adminOnly>
//                   <Layout>
//                     <AdminDashboard />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />

//             {/* 404 */}
//             <Route
//               path="*"
//               element={
//                 <Box
//                   display="flex"
//                   flexDirection="column"
//                   justifyContent="center"
//                   alignItems="center"
//                   minHeight="100vh"
//                 >
//                   <Typography variant="h2">404</Typography>

//                   <Typography color="text.secondary">
//                     Page Not Found
//                   </Typography>
//                 </Box>
//               }
//             />

//           </Routes>
//         </ThemeModeProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { AuthProvider } from "./context/AuthContext";
import { ThemeModeProvider } from "./context/ThemeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import AnalysisReport from "./pages/AnalysisReport";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeModeProvider>
          <Routes>

            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Upload */}
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UploadResume />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Report */}
            <Route
              path="/report/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AnalysisReport />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* History */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Layout>
                    <History />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                /* FIX: Moved styling attributes inside the sx prop to prevent DOM bleeding */
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh"
                  }}
                >
                  <Typography variant="h2">404</Typography>

                  <Typography color="text.secondary">
                    Page Not Found
                  </Typography>
                </Box>
              }
            />

          </Routes>
        </ThemeModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;