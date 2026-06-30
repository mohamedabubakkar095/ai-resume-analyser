import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Tabs, Tab, 
  CircularProgress, Alert, Button, Divider, Chip, Avatar, Stack
} from '@mui/material';
import { 
  Speed, Description, CheckCircle, Warning, ErrorOutlined, 
  Print, Person, Code, AutoAwesome, Checkroom, Report
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const AnalysisReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`analysis/report/${id}/`);
        setReport(response.data);
      } catch (err) {
        setError("Failed to load analysis report. It may have been deleted or is inaccessible.");
        console.error("Report fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handlePrint = () => {
    window.print();
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

  const { parsed_data, ats_score, created_at, resume, job_description } = report;
  const personal = parsed_data.personal_info || {};
  const skills = parsed_data.skills || {};
  const grammar = parsed_data.grammar_analysis || {};
  const formatting = parsed_data.formatting_problems || [];
  const missingKeywords = parsed_data.missing_keywords || [];
  const suggestions = parsed_data.suggestions || [];
  const jobMatch = parsed_data.job_match_percentage || 0;

  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box ref={printRef} className="printable-report">
      {/* Header Info */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4} flexDirection={{ xs: 'column', sm: 'row' }} gap={2} className="no-print">
        <Box>
          <Typography variant="h4" fontWeight={900} gutterBottom>
            Analysis Report
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generated on {new Date(created_at).toLocaleDateString()} for <strong>{resume.file_name}</strong>
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<Print />} onClick={handlePrint} sx={{ borderRadius: 3 }}>
            Print / PDF Report
          </Button>
          <Button variant="contained" onClick={() => navigate('/analyze')} sx={{ borderRadius: 3 }}>
            Analyze Another
          </Button>
        </Stack>
      </Box>

      {/* Main Gauges Section */}
      <Grid container spacing={3} mb={4}>
        {/* ATS Score Circular Indicator */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} gutterBottom>
                ATS Score Estimation
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={3}>
                Calculated based on structure, readability, and content depth.
              </Typography>
              
              <Box position="relative" display="inline-flex" mb={2}>
                <CircularProgress 
                  variant="determinate" 
                  value={ats_score} 
                  size={140} 
                  thickness={6} 
                  sx={{ color: getScoreColor(ats_score) }} 
                />
                <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="h4" component="div" fontWeight={850}>
                    {ats_score}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" fontWeight={700} color={getScoreColor(ats_score)}>
                {ats_score >= 80 ? "Excellent Match!" : ats_score >= 60 ? "Good Potential. Needs work." : "Needs Major Optimization."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Job Match Index Gauge */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={750} gutterBottom>
                Job Description Match
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={3}>
                {job_description ? `Compared against "${job_description.title}"` : "General Market readiness match Index (no target job loaded)."}
              </Typography>

              <Box position="relative" display="inline-flex" mb={2}>
                <CircularProgress 
                  variant="determinate" 
                  value={jobMatch} 
                  size={140} 
                  thickness={6} 
                  sx={{ color: getScoreColor(jobMatch) }} 
                />
                <Box position="absolute" top={0} left={0} bottom={0} right={0} display="flex" alignItems="center" justifyContent="center">
                  <Typography variant="h4" component="div" fontWeight={850}>
                    {jobMatch}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" fontWeight={700} color={getScoreColor(jobMatch)}>
                {jobMatch >= 80 ? "High Compatibility" : jobMatch >= 60 ? "Moderate Match" : "Low Match"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="no-print">
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<Person />} label="Personal & Summary" iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<Code />} label="Skills & Keywords" iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<AutoAwesome />} label="AI Suggestions" iconPosition="start" sx={{ fontWeight: 700 }} />
          <Tab icon={<ErrorOutlined />} label="Grammar & Layout" iconPosition="start" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {/* 1. General Profile & Summaries */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={750} mb={3}>Parsed Credentials</Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Name</Typography>
                    <Typography variant="body1" fontWeight={600}>{personal.name || "Not Found"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                    <Typography variant="body1" fontWeight={600}>{personal.email || "Not Found"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                    <Typography variant="body1" fontWeight={600}>{personal.phone || "Not Found"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">LinkedIn</Typography>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {personal.linkedin ? <a href={personal.linkedin} target="_blank" rel="noreferrer">{personal.linkedin}</a> : "Not Found"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">GitHub</Typography>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {personal.github ? <a href={personal.github} target="_blank" rel="noreferrer">{personal.github}</a> : "Not Found"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={750} gutterBottom>Experience Summary</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {parsed_data.experience_summary || "No specific experience logs parsed."}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h6" fontWeight={750} gutterBottom>Education Summary</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {parsed_data.education_summary || "No specific education details parsed."}
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h6" fontWeight={750} gutterBottom>Projects Summary</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {parsed_data.projects_summary || "No specific projects details parsed."}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 2. Skills & Keywords */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={750} mb={3}>Detected Skills</Typography>
                
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Technical Skills</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {skills.technical?.length > 0 ? (
                    skills.technical.map((sk) => <Chip key={sk} label={sk} color="primary" variant="outlined" />)
                  ) : (
                    <Typography variant="body2" color="text.disabled">None detected</Typography>
                  )}
                </Box>

                <Typography variant="subtitle2" fontWeight={700} mb={1}>Soft Skills</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {skills.soft?.length > 0 ? (
                    skills.soft.map((sk) => <Chip key={sk} label={sk} color="secondary" variant="outlined" />)
                  ) : (
                    <Typography variant="body2" color="text.disabled">None detected</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 2, border: '1px solid', borderColor: missingKeywords.length > 0 ? 'error.light' : 'divider', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={750} color={missingKeywords.length > 0 ? 'error.main' : 'text.primary'} mb={1} display="flex" alignItems="center" gap={1}>
                  {missingKeywords.length > 0 ? <Warning /> : <CheckCircle color="success" />} Missing Keywords
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={3}>
                  Keywords that recruiters/ATS seek but are missing from your file.
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={1}>
                  {missingKeywords.length > 0 ? (
                    missingKeywords.map((kw) => (
                      <Chip key={kw} label={kw} color="error" size="small" variant="filled" sx={{ width: 'fit-content' }} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">Fantastic! No major missing keywords detected.</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* 3. AI Suggestions */}
      <TabPanel value={tabValue} index={2}>
        <Card sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={750} mb={3}>Actionable Improvement Steps</Typography>
            {suggestions.length === 0 ? (
              <Alert severity="success" sx={{ borderRadius: 3 }}>Your resume looks outstanding! No improvements needed.</Alert>
            ) : (
              <Box display="flex" flexDirection="column" gap={2}>
                {suggestions.map((sug, index) => (
                  <Box key={index} display="flex" gap={2} alignItems="flex-start" p={2} bgcolor="action.hover" borderRadius={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28, fontSize: '0.875rem' }}>{index + 1}</Avatar>
                    <Typography variant="body2" sx={{ pt: 0.5, lineHeight: 1.6 }}>{sug}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* 4. Grammar & Layout */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Grammar analysis */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight={750}>Grammar & Punctuation</Typography>
                  <Chip label={`Score: ${grammar.score_out_of_10 || 10}/10`} color={grammar.score_out_of_10 >= 8 ? 'success' : 'warning'} />
                </Box>
                
                {grammar.errors?.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {grammar.errors.map((err, idx) => (
                      <Box key={idx} display="flex" gap={1} alignItems="flex-start">
                        <ErrorOutlined color="error" sx={{ mt: 0.2 }} />
                        <Typography variant="body2">{err}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="success" sx={{ borderRadius: 3 }}>Excellent spelling and grammar detected throughout!</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Formatting & Layout */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={750} mb={3}>Formatting & Layout Problems</Typography>
                
                {formatting.length > 0 ? (
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {formatting.map((err, idx) => (
                      <Box key={idx} display="flex" gap={1} alignItems="flex-start">
                        <Report color="warning" sx={{ mt: 0.2 }} />
                        <Typography variant="body2">{err}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="success" sx={{ borderRadius: 3 }}>Layout structure complies with modern recruiter scanning guidelines!</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Styles for printing */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-report {
            padding: 0 !important;
          }
          .MuiCard-root {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            break-inside: avoid;
            background-color: white !important;
            color: black !important;
            margin-bottom: 20px;
          }
          a {
            color: black !important;
            text-decoration: underline;
          }
        }
      `}</style>
    </Box>
  );
};

export default AnalysisReport;
