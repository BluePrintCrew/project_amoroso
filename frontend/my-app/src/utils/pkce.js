import pkceChallenge from 'pkce-challenge';

// PKCE 관련 유틸리티 함수들

// 랜덤 문자열 생성 함수
function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// base64url 인코딩 함수
function base64URLEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// SHA-256 해시 함수
async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
}

// Code Verifier와 Challenge 생성
export async function generatePKCEPair() {
    // 43자에서 128자 사이의 랜덤 문자열 생성 (RFC 7636 권장)
    const codeVerifier = generateRandomString(96);
    
    // Code Challenge 생성
    const hashedVerifier = await sha256(codeVerifier);
    const codeChallenge = base64URLEncode(hashedVerifier);
    
    return {
        codeVerifier,
        codeChallenge
    };
}

// PKCE 상태 저장
export function storePKCEState(codeVerifier) {
    sessionStorage.setItem('code_verifier', codeVerifier);
}

// PKCE 상태 검색
export function getStoredPKCEState() {
    return sessionStorage.getItem('code_verifier');
}

// PKCE 상태 제거
export function clearPKCEState() {
    sessionStorage.removeItem('code_verifier');
} 