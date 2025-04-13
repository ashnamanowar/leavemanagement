import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export interface LoginResponse {
    id: number;
    userId: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'SUPERVISOR';
    token?: string;
}

const login = async (userId: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            userId,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export { login }; 