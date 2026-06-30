import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  Avatar, CircularProgress, Alert, Stack
} from '@mui/material';
import { Person, Phone, Link as LinkIcon, Edit, CheckCircle } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  full_name: yup.string().max(100, 'Name too long'),
  phone: yup.string().max(20, 'Phone number too long'),
  linkedin_url: yup.string().url('Enter a valid URL (e.g. https://...)').nullable(),
  github_url: yup.string().url('Enter a valid URL (e.g. https://...)').nullable(),
  bio: yup.string().max(500, 'Bio too long'),
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const profile = user?.profile || {};

  const formik = useFormik({
    initialValues: {
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      linkedin_url: profile.linkedin_url || '',
      github_url: profile.github_url || '',
      bio: profile.bio || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSuccess(false);
      setError(null);
      try {
        await updateProfile(values);
        setSuccess(true);
      } catch (err) {
        setError(err.detail || "Failed to update profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box maxWidth="md" mx="auto" width="100%">
      <Box mb={4}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal details, developer bio, and career portal links.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 3, borderRadius: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Side: Avatar Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  mb: 1
                }}
              >
                {user?.email?.[0].toUpperCase() || 'U'}
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={750}>
                  {profile.full_name || user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                  Role: {user?.role}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Inputs */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 1 }}>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Typography variant="h6" fontWeight={750} display="flex" alignItems="center" gap={1}>
                    <Edit fontSize="small" /> Edit Information
                  </Typography>

                  <TextField
                    fullWidth
                    id="full_name"
                    name="full_name"
                    label="Full Name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.full_name && Boolean(formik.errors.full_name)}
                    helperText={formik.touched.full_name && formik.errors.full_name}
                  />

                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    InputProps={{
                      startAdornment: (
                        <Box mr={1} display="flex" alignItems="center" color="action.active">
                          <Phone fontSize="small" />
                        </Box>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    id="linkedin_url"
                    name="linkedin_url"
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/..."
                    value={formik.values.linkedin_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.linkedin_url && Boolean(formik.errors.linkedin_url)}
                    helperText={formik.touched.linkedin_url && formik.errors.linkedin_url}
                    InputProps={{
                      startAdornment: (
                        <Box mr={1} display="flex" alignItems="center" color="action.active">
                          <LinkIcon fontSize="small" />
                        </Box>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    id="github_url"
                    name="github_url"
                    label="GitHub URL"
                    placeholder="https://github.com/..."
                    value={formik.values.github_url}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.github_url && Boolean(formik.errors.github_url)}
                    helperText={formik.touched.github_url && formik.errors.github_url}
                    InputProps={{
                      startAdornment: (
                        <Box mr={1} display="flex" alignItems="center" color="action.active">
                          <LinkIcon fontSize="small" />
                        </Box>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    id="bio"
                    name="bio"
                    label="Professional Bio"
                    placeholder="Tell recruiters about your goals and technical passions..."
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                    helperText={formik.touched.bio && formik.errors.bio}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={formik.isSubmitting}
                    sx={{ py: 1.5, mt: 1, width: 'fit-content' }}
                  >
                    {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Save Profile Details"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
