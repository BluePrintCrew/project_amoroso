package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2Service {

    private final ClientRegistrationRepository clientRegistrationRepository;
    private final RestTemplate restTemplate;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    public String generateAuthorizationUrl(String provider, String codeChallenge, String codeChallengeMethod) {
        ClientRegistration registration = clientRegistrationRepository.findByRegistrationId(provider);
        
        return UriComponentsBuilder
                .fromUriString(registration.getProviderDetails().getAuthorizationUri())
                .queryParam("client_id", registration.getClientId())
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", String.join(" ", registration.getScopes()))
                .queryParam("code_challenge", codeChallenge)
                .queryParam("code_challenge_method", codeChallengeMethod)
                .build()
                .toUriString();
    }

    public Map<String, String> exchangeCodeForToken(String provider, String code, String codeVerifier) {
        ClientRegistration registration = clientRegistrationRepository.findByRegistrationId(provider);
        
        Map<String, String> params = new HashMap<>();
        params.put("client_id", registration.getClientId());
        params.put("client_secret", registration.getClientSecret());
        params.put("code", code);
        params.put("code_verifier", codeVerifier);
        params.put("redirect_uri", redirectUri);
        params.put("grant_type", "authorization_code");

        // OAuth2 토큰 엔드포인트로 요청
        Map<String, String> response = restTemplate.postForObject(
                registration.getProviderDetails().getTokenUri(),
                params,
                Map.class
        );

        return response;
    }
}