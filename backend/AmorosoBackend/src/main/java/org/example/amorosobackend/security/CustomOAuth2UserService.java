package org.example.amorosobackend.security;

import java.util.Collections;
import java.util.Map;

import org.example.amorosobackend.domain.User;
import org.example.amorosobackend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository; // 사용자 데이터베이스
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 기본 OAuth2UserService를 사용해 사용자 정보 로드
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        // 클라이언트 이름 (google, kakao, naver 등)
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getName(); // 고유 사용자 ID (소셜 제공)
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 사용자 정보 가져오기 (provider마다 다름)
        String email = getEmail(provider, attributes);
        String name = getName(provider, attributes);

        // DB에서 사용자 조회 or 신규 사용자 저장
        User user = userRepository.findBySocialProviderAndSocialId(provider, providerId)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .socialProvider(provider)
                                .socialId(providerId)
                                .email(email)
                                .name(name)
                                .password("") // 소셜 로그인 사용자는 비밀번호 필요 없음
                                .role("ROLE_USER")
                                .build()
                ));

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().toString())),
                attributes,
                "email" // OAuth2User의 기본 사용자 식별 필드
        );
    }

    private String getEmail(String provider, Map<String, Object> attributes) {
        switch (provider) {
            case "google":
                return (String) attributes.get("email");
            case "kakao":
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                return (String) kakaoAccount.get("email");
            case "naver":
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                return (String) response.get("email");
            default:
                throw new IllegalArgumentException("지원하지 않는 소셜 제공자입니다.");
        }
    }

    private String getName(String provider, Map<String, Object> attributes) {
        switch (provider) {
            case "google":
                return (String) attributes.get("name");
            case "kakao":
                Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
                return (String) properties.get("nickname");
            case "naver":
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                return (String) response.get("name");
            default:
                throw new IllegalArgumentException("지원하지 않는 소셜 제공자입니다.");
        }
    }



}
