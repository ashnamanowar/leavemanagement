import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import AddEmployee from './components/AddEmployee';
import LeaveRequest from './components/LeaveRequest';
import ToggleAvailability from './components/ToggleAvailability';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Leave Management System
          </Typography>
          {user?.username ? (
            <Button color="inherit" onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Employee Routes */}
            <Route path="/employee-dashboard" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/request-leave" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <LeaveRequest />
              </ProtectedRoute>
            } />
            <Route path="/toggle-availability" element={
              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                <ToggleAvailability />
              </ProtectedRoute>
            } />

            {/* Manager Routes */}
            <Route path="/manager-dashboard" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-employee" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <AddEmployee />
              </ProtectedRoute>
            } />

            {/* Supervisor Routes */}
            <Route path="/supervisor-dashboard" element={
              <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App; 