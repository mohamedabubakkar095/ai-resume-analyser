import React, { useState } from 'react';
import { 
  Box, Container, Typography, TextField, Button, Card, 
  CardContent, Alert, Link, InputAdornment, IconButton, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  username: yup
    .string('Enter your username')
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string('Confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password confirmation is required'),
  role: yup
    .string('Select your role')
    .required('Role is required'),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user', // default role
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        await register(values.username, values.email, values.password, values.role);
        navigate('/dashboard');
      } catch (err) {
        setApiError(err.detail || err.username?.[0] || err.email?.[0] || "Registration failed. Please check inputs.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ py: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <Card sx={{ p: 2, borderRadius: 5 }}>
        <CardContent>
          <Box mb={3} textAlign="center">
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to begin optimization of your resume
            </Typography>
          </Box>

          {apiError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {apiError}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                placeholder="johndoe"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

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

              <FormControl fullWidth>
                <InputLabel id="role-select-label">Account Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  label="Account Role"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="user">User (Candidate)</MenuItem>
                  <MenuItem value="admin">System Admin</MenuItem>
                </Select>
              </FormControl>

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

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
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
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
              </Button>
            </Box>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                onClick={() => navigate('/login')} 
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Sign in instead
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
