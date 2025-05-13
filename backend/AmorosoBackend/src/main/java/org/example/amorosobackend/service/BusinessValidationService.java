package org.example.amorosobackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.example.amorosobackend.dto.BusinessValidationRequest;
import org.example.amorosobackend.dto.BusinessValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.example.amorosobackend.dto.BusinessStatusResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;

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
    private static final String STATUS_API_URL = "https://api.odcloud.kr/api/nts-businessman/v1/status";

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

           
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

        
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            //
            String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                    .queryParam("serviceKey", apiKey)
                    .build()
                    .encode()
                    .toUriString();


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

    public BusinessStatusResponse checkBusinessStatus(String businessNumber) {
        try {
            Map<String, List<String>> requestBody = new HashMap<>();
            requestBody.put("b_no", List.of(businessNumber));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, List<String>>> entity = new HttpEntity<>(requestBody, headers);

            String url = UriComponentsBuilder.fromHttpUrl(STATUS_API_URL)
                    .queryParam("serviceKey", apiKey)
                    .build()
                    .encode()
                    .toUriString();

            JsonNode response = restTemplate.postForObject(url, entity, JsonNode.class);

            if (response != null && response.has("data") && response.get("data").size() > 0) {
                JsonNode data = response.get("data").get(0);
                
                return BusinessStatusResponse.builder()
                        .businessNumber(businessNumber)
                        .taxationType(data.get("tax_type").asText())
                        .taxTypeCode(data.get("tax_type_cd").asText())
                        .businessStatus(data.get("b_stt").asText())
                        .businessStatusCode(data.get("b_stt_cd").asText())
                        .endDate(data.get("end_dt").asText())
                        .taxTypeChangeDate(data.get("tax_type_change_dt").asText())
                        .lastTaxationType(data.get("rbf_tax_type").asText())
                        .lastTaxTypeCode(data.get("rbf_tax_type_cd").asText())
                        .build();
            }

            throw new RuntimeException("Failed to check business status");
        } catch (Exception e) {
            throw new RuntimeException("Failed to check business status", e);
        }
    }
} 