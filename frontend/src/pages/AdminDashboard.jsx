import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, 
  CircularProgress, Alert, Tooltip, Avatar, Chip
} from '@mui/material';
import { 
  Delete, People, CloudQueue, TrendingUp, Speed 
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('admin/stats/'),
        api.get('admin/users/')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError("Failed to fetch administrative data. Make sure you are logged in as an Admin.");
      console.error("Admin Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to permanently delete this user? This will delete all their uploaded resumes and analyses as well!")) {
      try {
        await api.delete(`admin/users/${userId}/`);
        setUsers(prev => prev.filter(u => u.id !== userId));
        // Refresh metrics
        const statsRes = await api.get('admin/stats/');
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to delete user", err);
        alert(err.response?.data?.error || "Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} mx="auto" maxWidth="md">
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={950} gutterBottom>
          System Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor general system statistics, user uploads, and moderate user accounts.
        </Typography>
      </Box>

      {/* Stats Counter Boxes */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box p={2}>
              <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.12)', color: 'info.main', width: 56, height: 56 }}>
                <People />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
              <Typography variant="h5" fontWeight={800}>{stats?.total_users}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box p={2}>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'secondary.main', width: 56, height: 56 }}>
                <CloudQueue />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Uploads</Typography>
              <Typography variant="h5" fontWeight={800}>{stats?.total_resumes}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box p={2}>
              <Avatar sx={{ bgcolor: 'rgba(124, 58, 237, 0.12)', color: 'primary.main', width: 56, height: 56 }}>
                <TrendingUp />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Analyses</Typography>
              <Typography variant="h5" fontWeight={800}>{stats?.total_analyses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box p={2}>
              <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', width: 56, height: 56 }}>
                <Speed />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">System Avg ATS</Typography>
              <Typography variant="h5" fontWeight={800} color="#f59e0b">{stats?.avg_ats}/100</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4} mb={4}>
        {/* Timeline Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} mb={3}>
                System-Wide Scan Activity (Last 7 Days)
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                {stats?.scans_timeline?.length === 0 ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No scanning activity logged in the past week</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer>
                    <AreaChart data={stats?.scans_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <ChartTooltip />
                      <Area type="monotone" dataKey="scans" stroke="#10b981" fill="rgba(16, 185, 129, 0.15)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Registered Users List */}
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box p={3}>
            <Typography variant="h6" fontWeight={750}>Registered User Database</Typography>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', borderTop: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell><Typography fontWeight={700}>Username</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Email</Typography></TableCell>
                  <TableCell><Typography fontWeight={700}>Full Name</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={700}>Account Role</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={700}>Date Registered</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight={700}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.profile?.full_name || "N/A"}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={u.role} 
                        color={u.role === 'admin' ? 'primary' : 'default'} 
                        size="small" 
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {new Date(u.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete Account">
                        <IconButton color="error" onClick={() => handleDeleteUser(u.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
