import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const ToggleAvailability: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8020/api/toggle-availability/${employeeId}`, {
                method: 'PUT',
            });
            const data = await response.json();
            alert(`Employee ${data.id} availability toggled to ${data.available}`);
            setEmployeeId('');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while toggling availability');
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Toggle Employee Availability
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    margin="normal"
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Toggle Availability
                </Button>
            </Box>
        </Paper>
    );
};

export default ToggleAvailability; 