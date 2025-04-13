import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export interface Employee {
    id: number;
    username: string;
    password: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'SUPERVISOR';
    supervisor: Employee | null;
    available: boolean;
}

export const api = {
    // Test endpoint
    test: async () => {
        const response = await axios.get(`${API_BASE_URL}/test`);
        return response.data;
    },

    // Employee endpoints
    addEmployee: async (employee: Omit<Employee, 'id' | 'supervisor' | 'available'>) => {
        const response = await axios.post(`${API_BASE_URL}/add-employee`, employee);
        return response.data;
    },

    // Leave request endpoints
    requestLeave: async (employeeId: number, reason: string) => {
        const response = await axios.post(`${API_BASE_URL}/request-leave`, null, {
            params: { employeeId, reason }
        });
        return response.data;
    },

    // Availability endpoints
    toggleAvailability: async (employeeId: number) => {
        const response = await axios.put(`${API_BASE_URL}/toggle-availability/${employeeId}`);
        return response.data;
    }
}; 