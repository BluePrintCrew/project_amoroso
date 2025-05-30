import axios from 'axios';

// API 기본 URL 설정 (환경에 따라 변경 필요)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 오류 처리 (토큰 만료)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 오류인 경우 로그인 페이지로 리다이렉트
    if (error.response && error.response.status === 401) {
      console.error('인증 만료 또는 유효하지 않은 토큰');
      // 개발 중에는 주석 처리하고, 프로덕션에서 활성화
      // localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;