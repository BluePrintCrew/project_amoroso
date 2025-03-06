package org.example.amorosobackend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        String token = resolveToken(header);

        log.info("[JWT 필터] 요청 URI: {}", request.getRequestURI());
        log.info("[JWT 필터] Authorization 헤더: {}", header != null ? "존재함" : "없음");

        try {
            if (token != null) {
                log.info("[JWT 필터] 추출된 토큰: {}", token);

                if (jwtProvider.validateToken(token)) {
                    log.info("[JWT 필터] 유효한 JWT 토큰입니다.");

                    String email = jwtProvider.getEmail(token);
                    String role = jwtProvider.getRole(token);

                    log.info("[JWT 필터] 인증된 사용자: 이메일={}, 권한={}", email, role);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null,
                                    AuthorityUtils.createAuthorityList(role));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("[JWT 필터] 토큰이 유효하지 않습니다.");
                }
            } else {
                log.warn("[JWT 필터] Authorization 헤더에서 유효한 토큰을 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            log.error("[JWT 필터] JWT 처리 중 오류 발생: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
