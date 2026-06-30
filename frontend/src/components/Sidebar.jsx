import React from 'react';
import {
  Drawer, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, Typography // <-- Typography இங்கே சேர்க்கப்பட்டுள்ளது
} from '@mui/material';
import {
  Dashboard, CloudUpload, History, Person,
  AdminPanelSettings, Home
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', private: true },
    { text: 'Analyze Resume', icon: <CloudUpload />, path: '/analyze', private: true },
    { text: 'History', icon: <History />, path: '/history', private: true },
    { text: 'My Profile', icon: <Person />, path: '/profile', private: true },
    { text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin', private: true, adminOnly: true },
  ];

  const filteredItems = menuItems.filter(item => {
    if (!item.private) return true;
    if (item.private && !user) return false;
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  const listContent = (
    <Box sx={{ overflow: 'auto', mt: 2 }}>
      <List>
        {filteredItems.map((menuItem) => {
          const isSelected = location.pathname === menuItem.path;
          return (
            <ListItem key={menuItem.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(menuItem.path);
                  if (onToggle) onToggle(); // Close sidebar drawer on mobile
                }}
                sx={{
                  mx: 1.5,
                  borderRadius: 3,
                  py: 1.2,
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: 'text.primary',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {menuItem.icon}
                </ListItemIcon>

                {/* FIX: HTML DOM எரரை தவிர்க்க primaryTypographyProps தூக்கப்பட்டு, Typography நேரடியா பாஸ் செய்யப்பட்டுள்ளது */}
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 700 : 500,
                      }}
                    >
                      {menuItem.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' },
        }}
      >
        <Toolbar />
        {listContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.default' },
        }}
      >
        <Toolbar />
        {listContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
export { drawerWidth };