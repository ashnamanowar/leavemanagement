import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Mock user for direct login (skipping backend for now)
const MOCK_USER = {
    id: 1,
    name: "Test Employee",
    employeeId: 1,
    role: "EMPLOYEE"
};

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        role: 'EMPLOYEE'
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // Option 1: Try connecting to backend
            try {
                console.log('Attempting login with:', {
                    username: formData.userId,
                    password: formData.password
                });
                
                const response = await fetch('http://localhost:8081/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formData.userId,
                        password: formData.password
                    })
                });
                
                console.log('Login response status:', response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Login failed');
                }
                
                const data = await response.json();
                console.log('Login response data:', data);
                
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Navigate to employee dashboard
                navigate('/employee-dashboard');
                return;
            } catch (networkError) {
                console.error('Network error:', networkError);
                // Fall back to mock login if backend connection fails
            }
            
            // Option 2: Fall back to mock login
            console.log('Using mock login as fallback');
            localStorage.setItem('token', 'mock-jwt-token');
            localStorage.setItem('user', JSON.stringify(MOCK_USER));
            navigate('/employee-dashboard');
            
        } catch (error) {
            console.error('Login error:', error);
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" gutterBottom align="center">
                    Login
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="User ID"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={formData.role}
                            label="Role"
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <MenuItem value="EMPLOYEE">Employee</MenuItem>
                            <MenuItem value="MANAGER">Manager</MenuItem>
                            <MenuItem value="SUPERVISOR">Supervisor</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3 }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login; 