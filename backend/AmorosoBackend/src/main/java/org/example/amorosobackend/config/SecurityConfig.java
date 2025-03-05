package org.example.amorosobackend.config;


import lombok.RequiredArgsConstructor; // @RequiredArgsConstructor
import org.example.amorosobackend.security.CustomOAuth2UserService;
import org.example.amorosobackend.security.JwtAuthenticationFilter;
import org.example.amorosobackend.security.JwtProvider;
import org.springframework.context.annotation.Bean; // @Bean
import org.springframework.context.annotation.Configuration; // @Configuration
import org.springframework.security.authentication.AuthenticationManager; // AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // @EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy; // SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder; // PasswordEncoder
import org.springframework.security.web.SecurityFilterChain; // SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity // @PreAuthorize 등의 메서드 권한 설정 활성화
public class SecurityConfig {

    private final JwtProvider jwtProvider; // JWT 생성/검증 로직
    private final CustomOAuth2UserService customOAuth2UserService; // OAuth2UserService 구현체

    // PasswordEncoder Bean 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // SecurityFilterChain Bean 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 적용
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (REST API에 불필요)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 비활성화
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/","/v3/api-docs/**","/swagger-ui/**","/api/v1/auth/**", "/oauth2/**",
                                "/api/v1/Test-User/**").permitAll() // 인증 없이 접근 가능
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:3000/loginSuccess")
                        .failureUrl("http://localhost:3000/loginFailure")
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 소셜 사용자 정보 처리
                        )
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .build();
    }

    // CORS 설정을 위한 Bean 정의
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:3000")); // 허용할 Origin 설정
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드 설정
        configuration.setAllowedHeaders(List.of("*")); // 허용할 헤더 설정
        configuration.setAllowCredentials(true); // 자격 증명 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}
