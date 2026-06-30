import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, Button, 
  CircularProgress, Alert, useTheme, Avatar
} from '@mui/material';
import { 
  Speed, AssignmentTurnedIn, NotificationsActive, 
  TrendingUp, AddCircleOutlined, Launch
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('dashboard/stats/');
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Dashboard stats error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: 'auto', maxWidth: 'md' }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>{error}</Alert>
      </Box>
    );
  }

  // Predefined nice gradient colors for skills bar chart
  const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#f43f5e'];

  return (
    <Box>
      {/* Welcome Heading */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4, 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2 
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={950} gutterBottom>
            Developer Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Insights on your uploaded resumes, parsed keywords, and ATS trends.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlined />}
          onClick={() => navigate('/analyze')}
          sx={{ borderRadius: 4, px: 3, py: 1.2 }}
        >
          Analyze New Resume
        </Button>
      </Box>

      {/* Top 3 Stat Cards - Fixed: Using MUI v6 'size' layout */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box sx={{ p: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(124, 58, 237, 0.12)', color: 'primary.main', width: 56, height: 56 }}>
                <AssignmentTurnedIn fontSize="large" />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Total Resumes Scanned</Typography>
              <Typography variant="h4" fontWeight={850}>{stats?.total_scans}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box sx={{ p: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: 'secondary.main', width: 56, height: 56 }}>
                <Speed fontSize="large" />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Average ATS Score</Typography>
              <Typography variant="h4" fontWeight={850} color="secondary.main">{stats?.avg_ats}/100</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
            <Box sx={{ p: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(239, 68, 68, 0.12)', color: 'error.main', width: 56, height: 56 }}>
                <NotificationsActive fontSize="large" />
              </Avatar>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Unread Notifications</Typography>
              <Typography variant="h4" fontWeight={850} color="error.main">{stats?.unread_notifications}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={4}>
        {/* ATS Score Progress Line Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight={750} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="primary" /> ATS Score Timeline
                </Typography>
                <Button size="small" endIcon={<Launch />} onClick={() => navigate('/history')}>View History</Button>
              </Box>

              <Box sx={{ width: '100%', height: 300 }}>
                {stats?.history_chart_data?.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">Upload a resume to plot timeline data</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer>
                    <AreaChart data={stats?.history_chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis dataKey="date" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                      <YAxis stroke={theme.palette.text.secondary} domain={[0, 100]} fontSize={12} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.palette.background.paper, 
                          borderColor: theme.palette.divider, 
                          borderRadius: 12,
                          color: theme.palette.text.primary
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke={theme.palette.primary.main} 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#scoreColor)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Technical Skills Distribution */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} mb={3}>
                Most Frequently Parsed Skills
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                {stats?.top_skills?.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">No skills data available. Please upload a resume first.</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={stats?.top_skills} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.08)" />
                      <XAxis type="number" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                      <YAxis type="category" dataKey="skill" stroke={theme.palette.text.secondary} fontSize={12} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme.palette.background.paper, 
                          borderColor: theme.palette.divider, 
                          borderRadius: 12
                        }} 
                      />
                      <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                        {stats?.top_skills?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;