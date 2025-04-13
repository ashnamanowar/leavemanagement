import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LeaveRequest {
  id: number;
  employee: {
    id: number;
    name: string;
  };
  reason: string;
  requestDate: string;
  status: string;
}

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      const response = await fetch('http://localhost:8020/api/pending-leaves');
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      } else {
        setError('Failed to fetch pending leave requests');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching leave requests');
    }
  };

  const handleApproveReject = async (requestId: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:8020/api/leave/${requestId}/status?status=${status}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchPendingLeaves(); // Refresh the list
      } else {
        setError('Failed to update leave request status');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while updating leave request status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manager Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, {user.username}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Role: {user.role}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-employee')}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h5" gutterBottom>
        Pending Leave Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employee.name}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button
                    color="success"
                    onClick={() => handleApproveReject(request.id, 'APPROVED')}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleApproveReject(request.id, 'REJECTED')}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManagerDashboard; 