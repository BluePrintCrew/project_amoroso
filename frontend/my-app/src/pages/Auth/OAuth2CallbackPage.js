import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredPKCEState, clearPKCEState } from '../../utils/pkce';
import styles from './OAuth2CallbackPage.module.css';

const OAuth2CallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const code = searchParams.get('code');
                const provider = location.pathname.split('/').pop();
                
                const codeVerifier = getStoredPKCEState();
                if (!codeVerifier) {
                    throw new Error('Code verifier not found');
                }

                const response = await fetch(`/api/v1/oauth2/token/${provider}?code=${code}&codeVerifier=${codeVerifier}`, {
                    method: 'POST'
                });
                
                if (!response.ok) {
                    throw new Error('Token exchange failed');
                }

                const data = await response.json();
                
                localStorage.setItem('accessToken', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refreshToken', data.refresh_token);
                }

                clearPKCEState();
                navigate('/');
            } catch (error) {
                console.error('OAuth2 콜백 처리 에러:', error);
                navigate('/login', { state: { error: '로그인에 실패했습니다.' } });
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.loader}></div>
            <p className={styles.text}>로그인 처리 중...</p>
        </div>
    );
};

export default OAuth2CallbackPage; 