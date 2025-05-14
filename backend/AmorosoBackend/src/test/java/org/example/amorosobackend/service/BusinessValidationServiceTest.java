package org.example.amorosobackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.example.amorosobackend.dto.BusinessValidationRequest;
import org.example.amorosobackend.dto.BusinessValidationResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BusinessValidationServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private BusinessValidationService businessValidationService;

    private ObjectMapper realObjectMapper;

    @BeforeEach
    void setUp() {
        realObjectMapper = new ObjectMapper();
        ReflectionTestUtils.setField(businessValidationService, "apiKey", "test-api-key");
    }

    @Test
    void validateBusiness_ValidRequest_ReturnsSuccessResponse() throws Exception {
        // Given
        BusinessValidationRequest request = BusinessValidationRequest.builder()
                .businessNumber("1234567890")
                .startDate("20240101")
                .ownerName("John Doe")
                .companyName("Test Company")
                .businessAddress("Test Address")
                .build();

        ObjectNode statusNode = realObjectMapper.createObjectNode()
                .put("tax_type", "GENERAL_TAXATION")
                .put("b_stt", "ACTIVE_BUSINESS");

        ObjectNode dataNode = realObjectMapper.createObjectNode()
                .put("valid", "01")
                .put("valid_msg", "Valid")
                .set("status", statusNode);

        ObjectNode responseNode = realObjectMapper.createObjectNode();
        responseNode.putArray("data").add(dataNode);

        when(restTemplate.postForObject(anyString(), any(), any()))
                .thenReturn(responseNode);

        // When
        BusinessValidationResponse response = businessValidationService.validateBusiness(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isValid()).isTrue();
        assertThat(response.getBusinessNumber()).isEqualTo("1234567890");
        assertThat(response.getTaxationType()).isEqualTo("GENERAL_TAXATION");
        assertThat(response.getBusinessStatus()).isEqualTo("ACTIVE_BUSINESS");
    }

    @Test
    void validateBusiness_InvalidResponse_ThrowsException() {
        // Given
        BusinessValidationRequest request = BusinessValidationRequest.builder()
                .businessNumber("1234567890")
                .startDate("20240101")
                .ownerName("John Doe")
                .companyName("Test Company")
                .businessAddress("Test Address")
                .build();

        when(restTemplate.postForObject(anyString(), any(), any()))
                .thenReturn(null);

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            businessValidationService.validateBusiness(request)
        );
    }

    @Test
    void validateBusiness_ApiError_ThrowsException() {
        // Given
        BusinessValidationRequest request = BusinessValidationRequest.builder()
                .businessNumber("1234567890")
                .startDate("20240101")
                .ownerName("John Doe")
                .companyName("Test Company")
                .businessAddress("Test Address")
                .build();

        when(restTemplate.postForObject(anyString(), any(), any()))
                .thenThrow(new RuntimeException("API Error"));

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            businessValidationService.validateBusiness(request)
        );
    }
} 