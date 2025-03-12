package org.example.amorosobackend.controller;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.service.OAuth2Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;

    @GetMapping("/authorize/{provider}")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(
            @PathVariable String provider,
            @RequestParam String codeChallenge,
            @RequestParam(defaultValue = "S256") String codeChallengeMethod) {
        
        String authUrl = oAuth2Service.generateAuthorizationUrl(provider, codeChallenge, codeChallengeMethod);
        return ResponseEntity.ok(Map.of("authorizationUrl", authUrl));
    }

    @PostMapping("/token/{provider}")
    public ResponseEntity<Map<String, String>> getToken(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestParam String codeVerifier) {
        
        Map<String, String> tokens = oAuth2Service.exchangeCodeForToken(provider, code, codeVerifier);
        return ResponseEntity.ok(tokens);
    }
} 