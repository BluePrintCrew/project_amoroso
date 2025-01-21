package org.example.amorosobackend.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys; // 이를 통해서 내 설정한 hmacShakeyFor() 생성 가능.
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtProvider {

    @Value("${spring.jwt.secret}")
    private String secretKey;
    private long validityInMilliseconds = 1000L * 60 * 60; // 1시간 예시

    private Key key;

    @PostConstruct
    protected void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 토큰 생성
    public String createToken(String email, String role) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)      // 토큰 내용(클레임)
                .setIssuedAt(now)       // 토큰 발행 시간
                .setExpiration(validity) // 만료 시간
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰에서 이메일(Subject) 추출
    public String getEmail(String token) {
        return parseClaims(token).getBody().getSubject();
    }

    // 토큰에서 role 추출
    public String getRole(String token) {
        return (String) parseClaims(token).getBody().get("role");
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.info("Token expired");
        } catch (JwtException | IllegalArgumentException e) {
            log.info("Invalid token");
        }
        return false;
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
