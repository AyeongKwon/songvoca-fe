import axios from 'axios';

// 백엔드 API base URL (환경변수로 관리)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// axios 인스턴스 생성
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 매 요청에 JWT 토큰 자동 첨부
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 받으면 로그인 화면으로 리다이렉트
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // 로그인 페이지로 이동 (이미 로그인 페이지면 무한 루프 방지)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;