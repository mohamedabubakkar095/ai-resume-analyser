// import React, { useState, useEffect } from 'react';
// import { 
//   AppBar, Toolbar, IconButton, Typography, Badge, Menu, MenuItem, 
//   Box, Avatar, Tooltip, Divider, ListItemIcon
// } from '@mui/material';
// import { 
//   Menu as MenuIcon, Notifications as NotificationsIcon, 
//   DarkMode, LightMode, Logout, Person, AdminPanelSettings
// } from '@mui/icons-material';
// import { useAuth } from '../context/AuthContext';
// import { useColorMode } from '../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// const Navbar = ({ onSidebarToggle }) => {
//   const { user, logout } = useAuth();
//   const { mode, toggleColorMode } = useColorMode();
//   const navigate = useNavigate();

//   const [notifications, setNotifications] = useState([]);
//   const [notiAnchor, setNotiAnchor] = useState(null);
//   const [profileAnchor, setProfileAnchor] = useState(null);

//   const isNotiOpen = Boolean(notiAnchor);
//   const isProfileOpen = Boolean(profileAnchor);

//   // Fetch unread notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await api.get('notifications/');
//       setNotifications(response.data);
//     } catch (err) {
//       console.error("Failed to load notifications", err);
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchNotifications();
//       // Poll notifications every 45 seconds for a dynamic feel
//       const interval = setInterval(fetchNotifications, 45000);
//       return () => clearInterval(interval);
//     }
//   }, [user]);

//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   const handleMarkAllRead = async () => {
//     try {
//       await api.put('notifications/read-all/');
//       setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
//     } catch (err) {
//       console.error("Failed to mark notifications read", err);
//     }
//   };

//   const handleNotificationClick = async (id, index) => {
//     try {
//       await api.put(`notifications/${id}/read/`);
//       setNotifications(prev => {
//         const copy = [...prev];
//         copy[index].is_read = true;
//         return copy;
//       });
//     } catch (err) {
//       console.error("Failed to read notification", err);
//     }
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider', boxShadow: 'none' }}>
//       <Toolbar sx={{ justifyContent: 'space-between' }}>
        
//         {/* display flex-ஐ sx-க்குள் மாற்றியுள்ளோம் */}
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <IconButton edge="start" color="inherit" aria-label="menu" onClick={onSidebarToggle} sx={{ mr: 2, display: { md: 'none' } }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #7c3aed 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => navigate('/')}>
//             AI Resume Analyzer
//           </Typography>
//         </Box>

//         {/* display, gap போன்றவற்றை sx-க்குள் மாற்றியுள்ளோம் */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           {/* Theme Toggle */}
//           <Tooltip title="Toggle theme">
//             <IconButton color="inherit" onClick={toggleColorMode}>
//               {mode === 'dark' ? <LightMode /> : <DarkMode />}
//             </IconButton>
//           </Tooltip>

//           {/* Notifications Dropdown */}
//           <Tooltip title="Notifications">
//             <IconButton color="inherit" onClick={(e) => setNotiAnchor(e.currentTarget)}>
//               <Badge badgeContent={unreadCount} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>

//           <Menu
//             anchorEl={notiAnchor}
//             open={isNotiOpen}
//             onClose={() => setNotiAnchor(null)}
//             slotProps={{
//               paper: { sx: { width: 320, maxHeight: 400, borderRadius: 3 } }
//             }}
//           >
//             <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
//               {unreadCount > 0 && (
//                 <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }} onClick={handleMarkAllRead}>
//                   Mark all as read
//                 </Typography>
//               )}
//             </Box>
//             <Divider />
//             {notifications.length === 0 ? (
//               <MenuItem disabled sx={{ py: 2 }}>
//                 <Typography variant="body2" color="text.secondary" align="center" sx={{ width: "100%" }}>No notifications yet</Typography>
//               </MenuItem>
//             ) : (
//               notifications.map((noti, index) => (
//                 <MenuItem 
//                   key={noti.id} 
//                   onClick={() => handleNotificationClick(noti.id, index)}
//                   sx={{ 
//                     whiteSpace: 'normal', 
//                     py: 1.5,
//                     bgcolor: noti.is_read ? 'transparent' : 'action.hover'
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                     <Typography variant="body2" sx={{ fontWeight: noti.is_read ? 400 : 600 }}>{noti.message}</Typography>
//                     <Typography variant="caption" color="text.secondary">{new Date(noti.created_at).toLocaleTimeString()}</Typography>
//                   </Box>
//                 </MenuItem>
//               ))
//             )}
//           </Menu>

//           {/* User Profile Menu */}
//           <Tooltip title="Profile settings">
//             <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0, ml: 1 }}>
//               <Avatar 
//                 sx={{ 
//                   bgcolor: 'primary.main', 
//                   backgroundImage: user?.profile?.profile_picture ? `url(${user.profile.profile_picture})` : 'none',
//                   fontWeight: 700 
//                 }}
//               >
//                 {user?.email?.[0].toUpperCase() || 'U'}
//               </Avatar>
//             </IconButton>
//           </Tooltip>

//           <Menu
//             anchorEl={profileAnchor}
//             open={isProfileOpen}
//             onClose={() => setProfileAnchor(null)}
//             slotProps={{
//               paper: { sx: { width: 220, borderRadius: 3 } }
//             }}
//           >
//             <Box sx={{ px: 2, py: 1.5 }}>
//               <Typography variant="subtitle2" fontWeight={700}>{user?.profile?.full_name || user?.username}</Typography>
//               <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
//             </Box>
//             <Divider />
//             <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>
//               <ListItemIcon><Person fontSize="small" /></ListItemIcon>
//               My Profile
//             </MenuItem>
//             {user?.role === 'admin' && (
//               <MenuItem onClick={() => { setProfileAnchor(null); navigate('/admin'); }}>
//                 <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
//                 Admin Panel
//               </MenuItem>
//             )}
//             <Divider />
//             <MenuItem onClick={logout}>
//               <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
//               Logout
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, IconButton, Typography, Badge, Menu, MenuItem, 
  Box, Avatar, Tooltip, Divider, ListItemIcon
} from '@mui/material';
import { 
  Menu as MenuIcon, Notifications as NotificationsIcon, 
  DarkMode, LightMode, Logout, Person, AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notiAnchor, setNotiAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);

  const isNotiOpen = Boolean(notiAnchor);
  const isProfileOpen = Boolean(profileAnchor);

  // Fetch unread notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get('notifications/');
      setNotifications(response.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 45 seconds for a dynamic feel
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await api.put('notifications/read-all/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  const handleNotificationClick = async (id, index) => {
    try {
      await api.put(`notifications/${id}/read/`);
      setNotifications(prev => {
        const copy = [...prev];
        copy[index].is_read = true;
        return copy;
      });
    } catch (err) {
      console.error("Failed to read notification", err);
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={onSidebarToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #7c3aed 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => navigate('/')}>
            AI Resume Analyzer
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title="Toggle theme">
            <IconButton color="inherit" onClick={toggleColorMode}>
              {mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications Dropdown */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={(e) => setNotiAnchor(e.currentTarget)}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notiAnchor}
            open={isNotiOpen}
            onClose={() => setNotiAnchor(null)}
            slotProps={{
              paper: { sx: { width: 320, maxHeight: 400, borderRadius: 3 } }
            }}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
              {unreadCount > 0 && (
                <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }} onClick={handleMarkAllRead}>
                  Mark all as read
                </Typography>
              )}
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <MenuItem disabled sx={{ py: 2 }}>
                {/* FIX 1: Shifted alignment attributes directly to the sx style core */}
                <Typography variant="body2" color="text.secondary" sx={{ width: "100%", textAlign: 'center' }}>
                  No notifications yet
                </Typography>
              </MenuItem>
            ) : (
              /* FIX 2: Renamed iterator variable from 'noti' to 'notification' to bypass attribute leakage collisions */
              notifications.map((notification, index) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={() => handleNotificationClick(notification.id, index)}
                  sx={{ 
                    whiteSpace: 'normal', 
                    py: 1.5,
                    bgcolor: notification.is_read ? 'transparent' : 'action.hover'
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: notification.is_read ? 400 : 600 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* User Profile Menu */}
          <Tooltip title="Profile settings">
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ p: 0, ml: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  backgroundImage: user?.profile?.profile_picture ? `url(${user.profile.profile_picture})` : 'none',
                  fontWeight: 700 
                }}
              >
                {user?.email?.[0].toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileAnchor}
            open={isProfileOpen}
            onClose={() => setProfileAnchor(null)}
            slotProps={{
              paper: { sx: { width: 220, borderRadius: 3 } }
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>{user?.profile?.full_name || user?.username}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setProfileAnchor(null); navigate('/profile'); }}>
              <ListItemIcon><Person fontSize="small" /></ListItemIcon>
              My Profile
            </MenuItem>
            {user?.role === 'admin' && (
              <MenuItem onClick={() => { setProfileAnchor(null); navigate('/admin'); }}>
                <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
                Admin Panel
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={logout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;