import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { appConfig } from '../config/appConfig';

// Cliente para la API de productos
const httpClient = axios.create({
  baseURL: appConfig.productsApiUrl,
  timeout: 10000, // 10 segundos máximo
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: { response?: { status: number } }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cliente para la API de usuarios/auth
export const usersHttpClient = axios.create({
  baseURL: appConfig.usersApiUrl,
  timeout: 10000,
});

usersHttpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

usersHttpClient.interceptors.response.use(
  (response) => response,
  (error: { response?: { status: number } }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
