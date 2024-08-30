import axios from 'axios';

const AUTH_API_URL = 'http://localhost:3000/api/auth'; 

export const authApi = {
  register: (userData: any) => axios.post(`${AUTH_API_URL}/signup`, userData),
  login: (credentials: any) => axios.post(`${AUTH_API_URL}/signin`, credentials),
  logout: () => axios.post(`${AUTH_API_URL}/signout`),
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
};

// Add this function to check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > expiry;
  } catch (e) {
    return true;
  }
};