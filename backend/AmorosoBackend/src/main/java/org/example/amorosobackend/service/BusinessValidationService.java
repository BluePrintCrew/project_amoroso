package org.example.amorosobackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.example.amorosobackend.dto.BusinessValidationRequest;
import org.example.amorosobackend.dto.BusinessValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BusinessValidationService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${business.validation.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.odcloud.kr/api/nts-businessman/v1/validate";

    public BusinessValidationResponse validateBusiness(BusinessValidationRequest request) {
        try {

            Map<String, Object> business = new HashMap<>();
            business.put("b_no", request.getBusinessNumber());
            business.put("start_dt", request.getStartDate());
            business.put("p_nm", request.getOwnerName());
            business.put("b_nm", request.getCompanyName());
            business.put("b_adr", request.getBusinessAddress());

            Map<String, Object> requestBody = new HashMap<>();
            ArrayList<Map<String, Object>> businesses = new ArrayList<>();
            businesses.add(business);
            requestBody.put("businesses", businesses);

            // 헤더 명시 및 json 으로 파일변경
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 헤더와 , 바디 설정
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            //
            String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                    .queryParam("serviceKey", apiKey)
                    .build()
                    .encode()
                    .toUriString();

            // post형태로 pai 호출 및 응답 받기
            JsonNode response = restTemplate.postForObject(url, entity, JsonNode.class);


            if (response != null && response.has("data") && response.get("data").size() > 0) {
                JsonNode data = response.get("data").get(0);
                JsonNode status = data.get("status");
                
                return BusinessValidationResponse.builder()
                        .businessNumber(request.getBusinessNumber())
                        .isValid("01".equals(data.get("valid").asText()))
                        .validationMessage(data.has("valid_msg") ? data.get("valid_msg").asText() : "")
                        .taxationType(status.get("tax_type").asText())
                        .businessStatus(status.get("b_stt").asText())
                        .companyName(request.getCompanyName())
                        .ownerName(request.getOwnerName())
                        .businessAddress(request.getBusinessAddress())
                        .startDate(request.getStartDate())
                        .build();
            }

            throw new RuntimeException("Failed to validate business number");
        } catch (Exception e) {
            throw new RuntimeException("Failed to validate business number", e);
        }
    }
} 