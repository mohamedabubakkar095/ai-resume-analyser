import React, { useState } from 'react';
import { 
  Box, Container, Typography, TextField, Button, Card, 
  CardContent, Alert, Link, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  // If redirected because of token expiration
  const isExpired = new URLSearchParams(location.search).get('expired');
  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        await login(values.email, values.password);
        navigate(from, { replace: true });
      } catch (err) {
        setApiError(err.detail || "Invalid login credentials. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ py: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Card sx={{ p: 2, borderRadius: 5 }}>
        <CardContent>
          <Box mb={3} textAlign="center">
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage and analyze your resumes
            </Typography>
          </Box>

          {isExpired && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>
              Your session has expired. Please sign in again.
            </Alert>
          )}

          {apiError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {apiError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                color="primary"
                variant="contained"
                fullWidth
                size="large"
                type="submit"
                disabled={formik.isSubmitting}
                sx={{ py: 1.5, mt: 1 }}
              >
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                onClick={() => navigate('/register')} 
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
