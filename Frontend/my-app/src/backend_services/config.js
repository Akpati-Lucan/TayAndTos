// services/backend/config.js
import axios from 'axios';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api';

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000
});
