import React from 'react';
import { generatePKCEPair, storePKCEState } from '../../utils/pkce';
import styles from './OAuth2Login.module.css';

const OAuth2Login = () => {
    const handleLogin = async (provider) => {
        try {
            console.log(`${provider} 로그인 시작`);
            
            const { codeVerifier, codeChallenge } = await generatePKCEPair();
            console.log('PKCE 생성 완료:', { codeVerifier, codeChallenge });
            
            storePKCEState(codeVerifier);
            console.log('코드 검증기 저장 완료');
            
            const requestUrl = `/api/v1/oauth2/authorize/${provider}?codeChallenge=${encodeURIComponent(codeChallenge)}&codeChallengeMethod=S256`;
            console.log('요청 URL:', requestUrl);
            
            console.log('백엔드 요청 시작');
            console.log('실제 요청 URL:', window.location.origin + requestUrl);
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('백엔드 응답 상태:', response.status);
            console.log('백엔드 응답 타입:', response.headers.get('content-type'));
            console.log('백엔드 응답 헤더:', Object.fromEntries(response.headers.entries()));
            
            const responseText = await response.text();
            console.log('원본 응답 텍스트:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('파싱된 응답 데이터:', data);
            } catch (error) {
                console.error('JSON 파싱 에러:', error);
                throw new Error('응답을 JSON으로 파싱할 수 없습니다.');
            }
            
            if (!data.authorizationUrl) {
                throw new Error('인증 URL이 없습니다.');
            }
            
            console.log('인증 URL로 리다이렉트 예정:', data.authorizationUrl);
            const shouldRedirect = window.confirm(
                '백엔드 응답 확인:\n' +
                `Status: ${response.status}\n` +
                `URL: ${data.authorizationUrl}\n\n` +
                '리다이렉트를 진행하시겠습니까?'
            );
            
            if (shouldRedirect) {
                try {
                    // URL이 유효한지 확인
                    new URL(data.authorizationUrl);
                    // 새 창에서 열기
                    window.open(data.authorizationUrl, '_self');
                } catch (error) {
                    console.error('잘못된 URL 형식:', error);
                    throw new Error('잘못된 인증 URL 형식입니다.');
                }
            }
        } catch (error) {
            console.error('OAuth2 로그인 에러:', error);
            alert('로그인 처리 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div className={styles.socialLoginContainer}>
            <h3 className={styles.title}>소셜 로그인</h3>
            <div className={styles.buttonContainer}>
                <button 
                    className={`${styles.socialButton} ${styles.google}`}
                    onClick={() => handleLogin('google')}
                >
                    Google로 계속하기
                </button>
                <button 
                    className={`${styles.socialButton} ${styles.kakao}`}
                    onClick={() => handleLogin('kakao')}
                >
                    Kakao로 계속하기
                </button>
                <button 
                    className={`${styles.socialButton} ${styles.naver}`}
                    onClick={() => handleLogin('naver')}
                >
                    Naver로 계속하기
                </button>
            </div>
        </div>
    );
};

export default OAuth2Login; 