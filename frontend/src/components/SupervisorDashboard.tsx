import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Supervisor Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">Welcome, {user.name}</Typography>
        <Typography>User ID: {user.userId}</Typography>
        <Typography>Role: {user.role}</Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/manage-employees')}
        >
          Manage Employees
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/view-reports')}
        >
          View Reports
        </Button>
      </Box>
    </Box>
  );
};

export default SupervisorDashboard; 