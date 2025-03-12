import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredPKCEState, clearPKCEState } from '../utils/pkce';

const OAuth2Callback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // URL에서 인증 코드와 provider 추출
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');
                const provider = location.pathname.split('/').pop();
                
                // 저장된 코드 검증기 가져오기
                const codeVerifier = getStoredPKCEState();
                if (!codeVerifier) {
                    throw new Error('Code verifier not found');
                }

                // 토큰 교환
                const response = await fetch(`/api/v1/oauth2/token/${provider}?code=${code}&codeVerifier=${codeVerifier}`, {
                    method: 'POST'
                });
                
                if (!response.ok) {
                    throw new Error('Token exchange failed');
                }

                const data = await response.json();
                
                // 토큰 저장
                localStorage.setItem('accessToken', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }

                // PKCE 상태 정리
                clearPKCEState();

                // 로그인 성공 후 리다이렉트
                navigate('/');
            } catch (error) {
                console.error('OAuth2 콜백 처리 에러:', error);
                navigate('/login', { state: { error: '로그인에 실패했습니다.' } });
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div>
            <p>로그인 처리 중...</p>
        </div>
    );
};

export default OAuth2Callback; 