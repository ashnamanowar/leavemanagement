import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  role: string;
  supervisor?: {
    id: number;
    name: string;
  };
}

const LeaveRequest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      setError('Please log in to submit a leave request');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Parsed user:', parsedUser);
      
      if (parsedUser) {
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setError('Invalid user data. Please log in again.');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setError('Error parsing user data. Please log in again.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('Please log in first to submit a leave request');
      return;
    }

    try {
      const payload = {
        employeeId: user.id,
        reason: formData.reason
      };
      
      console.log('Sending leave request with payload:', payload);

      const response = await fetch('http://localhost:8081/api/simple-leave-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('Your session has expired. Please log in again.');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit leave request');
      }

      const data = await response.json();
      if (data.wasManagerAssigned === 'true') {
        setSuccess(`Leave request submitted successfully! A random manager (${data.managerName}) has been assigned to review your request.`);
      } else {
        setSuccess(`Leave request submitted successfully! Your manager (${data.managerName}) will review your request.`);
      }
      setFormData({ reason: '' });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while submitting the leave request');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Request Leave
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {!isAuthenticated ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to submit a leave request
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit Leave Request
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default LeaveRequest; 