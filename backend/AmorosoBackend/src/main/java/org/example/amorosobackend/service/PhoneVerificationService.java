package org.example.amorosobackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
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
        log.info("입력된 코드 : {} " ,code);
        log.info(" 저장된 코드 : {}", savedCode);
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

    @Data
    static class message{
        String phoneNumber;
        String verificationCode;
    }
    private void sendSms(String phoneNumber, String code) {
        try {
            // 1. 메시지 객체 생성
            Map<String, Object> message = new HashMap<>();
            message.put("to", phoneNumber.replace("-", "")); // 하이픈 제거 필수
            message.put("from", "01083272988");
            message.put("text", "Your verification code is [" + code + "].");

            // 2. messages 배열 생성
            List<Map<String, Object>> messages = new ArrayList<>();
            messages.add(message);

            // 3. 전체 요청 본문 생성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("messages", messages); //  Solapi는 "messages"라는 배열 키를 요구



            // ISO 8601 형식의 날짜 생성
            String date = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME) + "Z";

            // 12-64바이트 랜덤 salt 생성
            String salt = generateRandomSalt();

            // HMAC-SHA256 서명 생성 (date + salt를 연결한 문자열로)
            String signature = generateHmacSignature(date + salt);

            // 헤더 설정 (공식 문서 형식에 맞춤)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "HMAC-SHA256 apiKey=" + apiKey + ", date=" + date + ", salt=" + salt + ", signature=" + signature);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            System.out.println("최종 jsonBody: " + jsonBody);
            // API 호출
            JsonNode response = restTemplate.postForObject(API_URL, entity, JsonNode.class);

            // 응답 로깅 (선택사항)
            System.out.println("SMS 전송 응답: " + response);

        } catch (Exception e) {
            System.err.println("SMS 전송 실패: " + e.getMessage());
            throw new RuntimeException("Failed to send verification code", e);
        }
    }

    private String generateRandomSalt() {
        // 12-64바이트 랜덤 문자열 생성
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder salt = new StringBuilder();

        // 16바이트 길이로 생성
        for (int i = 0; i < 16; i++) {
            salt.append(chars.charAt(random.nextInt(chars.length())));
        }

        return salt.toString();
    }

    private String generateHmacSignature(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // 헥사 문자열로 변환
            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            return result.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to generate HMAC signature", e);
        }
    }
}