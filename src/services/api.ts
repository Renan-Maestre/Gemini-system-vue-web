import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL || 'http://localhost/api',
  headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  }
})

// Interceptor para adicionar o token automaticamente em rotas privadas
api.interceptors.request.use(config => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
