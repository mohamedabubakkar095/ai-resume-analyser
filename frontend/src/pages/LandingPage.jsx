import React from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent,
  Stack, useTheme, Avatar
} from '@mui/material';
import {
  Psychology, History, CloudUpload, Speed, ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "ATS Score Predictor",
      description: "Get an instant estimation of how well your resume scores under industry-standard Applicant Tracking Systems."
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: "AI Keyword Analysis",
      description: "Detect missing keywords and get specific, automated suggestions to align your resume with target job descriptions."
    },
    {
      icon: <CloudUpload sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: "Instant PDF Parsing",
      description: "Upload your resume in PDF format. Our algorithm extracts skills, experience, and educational background instantly."
    },
    {
      icon: <History sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: "Detailed Reports & History",
      description: "Store your previous analysis runs and track improvement changes over time with a comprehensive dashboard."
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.1,
            mb: 3
          }}
        >
          Optimize Your Resume For <br />
          <span style={{
            background: 'linear-gradient(90deg, #7c3aed 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ATS Success with AI
          </span>
        </Typography>

        <Typography
          variant="h5"
          component="p"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            mb: 5,
            fontWeight: 400,
            fontSize: { xs: '1.1rem', md: '1.3rem' }
          }}
        >
          Analyze your resume against any job description, extract key insights, correct formatting & grammar problems, and boost your hireability instantly.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 8, justifyContent: "center" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.8, fontSize: '1rem', borderRadius: 4 }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
          </Button>
          {!isAuthenticated && (
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ px: 4, py: 1.8, fontSize: '1rem', borderRadius: 4, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              Sign In
            </Button>
          )}
        </Stack>

        {/* Floating Screen Mockup */}
        <Box
          sx={{
            mx: 'auto',
            maxWidth: 900,
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            bgcolor: 'background.paper',
            p: 1
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80"
            alt="Dashboard preview"
            sx={{ width: '100%', height: 'auto', display: 'block', borderRadius: 5 }}
          />
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 }, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
            Packed with Recruiter-Grade Features
          </Typography>

          {/* FIX: flexWrap மற்றும் gap-ஐ sx ஆப்ஜெக்ட்டிற்குள் பாதுகாப்பாக மாற்றியாச்சு */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 4
            }}
          >
            {features.map((featureItem, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(25% - 24px)' },
                  display: 'flex'
                }}
              >
                <Card
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                    border: '1px solid rgba(255,255,255,0.03)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: 'primary.light',
                      boxShadow: '0 8px 30px rgba(124, 58, 237, 0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.05)', width: 64, height: 64 }}>
                      {featureItem.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" fontWeight={700}>
                      {featureItem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {featureItem.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Trust Banner */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Ready to land your dream interview?
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of software engineers, designers, and managers who used AI to boost their CV quality.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate(isAuthenticated ? '/analyze' : '/register')}
          sx={{ borderRadius: 4, px: 5, py: 1.8, fontWeight: 700 }}
        >
          Analyze Your Resume Now
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;
