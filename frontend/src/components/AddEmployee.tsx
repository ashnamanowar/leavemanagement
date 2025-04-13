import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';
import * as authService from '../services/authService';

const AddEmployee: React.FC = () => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        name: '',
        role: 'EMPLOYEE'
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('http://localhost:8081/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess('Employee added successfully!');
                setFormData({ userId: '', password: '', name: '', role: 'EMPLOYEE' });
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add employee');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while adding the employee');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Add New Employee
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
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                >
                    Add Employee
                </Button>
            </Box>
        </Paper>
    );
};

export default AddEmployee; 