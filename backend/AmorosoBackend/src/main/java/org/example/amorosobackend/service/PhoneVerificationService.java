package org.example.amorosobackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PhoneVerificationService {
    private final RestTemplate restTemplate;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${solapi.api.key}")
    private String apiKey;

    @Value("${solapi.api.secret}")
    private String apiSecret;

    private static final String API_URL = "https://api.solapi.com/messages/v4/send";
    private static final int VERIFICATION_CODE_LENGTH = 6;
    private static final int VERIFICATION_CODE_EXPIRY_MINUTES = 3;

    public void sendVerificationCode(String phoneNumber) {
        String verificationCode = generateVerificationCode();
        sendSms(phoneNumber, verificationCode);
        saveVerificationCode(phoneNumber, verificationCode);
    }

    public boolean verifyCode(String phoneNumber, String code) {
        String savedCode = redisTemplate.opsForValue().get("verification:" + phoneNumber);
        return savedCode != null && savedCode.equals(code);
    }

    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    private void saveVerificationCode(String phoneNumber, String code) {
        redisTemplate.opsForValue().set(
            "verification:" + phoneNumber,
            code,
            VERIFICATION_CODE_EXPIRY_MINUTES,
            TimeUnit.MINUTES
        );
    }

    private void sendSms(String phoneNumber, String code) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "HMAC-SHA256 apiKey=" + apiKey);

            Map<String, Object> message = new HashMap<>();
            message.put("to", phoneNumber);
            message.put("from", "01083272988"); // Sender number (registered in Solapi)
            message.put("text", "Your verification code is [" + code + "].");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("messages", new Object[]{message});

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            restTemplate.postForObject(API_URL, entity, JsonNode.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification code", e);
        }
    }
} 