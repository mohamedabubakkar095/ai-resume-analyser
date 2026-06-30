import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Alert, Tooltip, InputAdornment
} from '@mui/material';
import { Search, Delete, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const History = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async (query = "") => {
    try {
      const response = await api.get(`history/${query ? `?q=${query}` : ""}`);
      setHistory(response.data);
    } catch (err) {
      setError("Failed to retrieve scan history.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchHistory(searchQuery);
  };

  const handleDeleteHistory = async (id, index) => {
    if (window.confirm("Are you sure you want to delete this analysis record?")) {
      try {
        await api.delete(`analysis/report/${id}/`);
        setHistory(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error("Failed to delete record", err);
        alert("Failed to delete the record. Please try again.");
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          Analysis Log History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your previous scans, view score progressions, and load reports.
        </Typography>
      </Box>

      {/* Search Bar - Fixed: display and gap properties moved inside sx */}
      <Box mb={4} component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by resume filename or target job description title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" size="large" sx={{ px: 4, borderRadius: 3 }}>
          Search
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>
      )}

      {loading ? (
        /* Fixed: layout props moved inside sx */
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <CircularProgress color="primary" />
        </Box>
      ) : history.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No records found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              You haven't run any resume analyses yet, or your search query returned empty.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/analyze')}>
              Analyze Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell><Typography fontWeight={700}>Resume Filename</Typography></TableCell>
                <TableCell><Typography fontWeight={700}>Target Job</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={700}>ATS Score</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={700}>Date Scanned</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={700}>File Size</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight={700}>Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.file_name}</TableCell>
                  <TableCell>{row.job_title}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight={700} color={getScoreColor(row.ats_score)}>
                      {row.ats_score}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {new Date(row.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {(row.file_size / 1024).toFixed(2)} KB
                  </TableCell>
                  <TableCell align="center">
                    {/* Fixed: display, justifyContent, and gap properties moved inside sx */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View Report">
                        <IconButton color="primary" onClick={() => navigate(`/report/${row.id}`)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Record">
                        <IconButton color="error" onClick={() => handleDeleteHistory(row.id, index)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default History;