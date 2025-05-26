package org.example.amorosobackend.service;

import lombok.RequiredArgsConstructor;
import org.example.amorosobackend.dto.EcommerceValidationRequest;
import org.example.amorosobackend.dto.EcommerceValidationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class EcommerceValidationService {

    private final RestTemplate restTemplate;

    @Value("${api.ecommerce.key}")
    private String apiKey;

    private static final String API_URL = "http://apis.data.go.kr/1130000/MllBsDtl_2Service/getMllBsInfoDetail_2";

    public EcommerceValidationResponse validateEcommerceBusiness(EcommerceValidationRequest request) {
        String url = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("serviceKey", apiKey)
                .queryParam("pageNo", "1")
                .queryParam("numOfRows", "10")
                .queryParam("resultType", "json")
                .queryParam("brno", request.getBusinessNumber())
                .queryParam("bzmnNm", request.getBrandName())
                .build()
                .toUriString();

        try {
            // API 호출 및 결과 처리
            ApiResponse response = restTemplate.getForObject(url, ApiResponse.class);
            
            if (response == null || response.getItems() == null || response.getItems().getItem() == null) {
                return EcommerceValidationResponse.builder()
                        .isValid(false)
                        .message("통신판매업 정보를 찾을 수 없습니다.")
                        .build();
            }

            ApiItem item = response.getItems().getItem();

            // 운영상태 확인
            boolean isValidStatus = "정상".equals(item.getOperSttusCdNm());

            return EcommerceValidationResponse.builder()
                    .registrationNumber(item.getPrmmiMnno())
                    .registrationDate(LocalDate.parse(item.getDclrDate(), DateTimeFormatter.BASIC_ISO_DATE))
                    .businessStatus(item.getOperSttusCdNm())
                    .domain(item.getDomnCn())
                    .serverLocation(item.getOpnServerPlaceAladr())
                    .salesMethod(item.getNtslMthdNm())
                    .productCategories(item.getTrtmntPrdlstNm())
                    .isValid(isValidStatus)
                    .message(isValidStatus ? "유효한 통신판매업체입니다." : "유효하지 않은 통신판매업체입니다.")
                    .build();

        } catch (Exception e) {
            return EcommerceValidationResponse.builder()
                    .isValid(false)
                    .message("통신판매업 검증 중 오류가 발생했습니다: " + e.getMessage())
                    .build();
        }
    }

    // API 응답을 처리하기 위한 내부 클래스들
    private static class ApiResponse {
        private Items items;
        public Items getItems() { return items; }
        public void setItems(Items items) { this.items = items; }
    }

    private static class Items {
        private ApiItem item;
        public ApiItem getItem() { return item; }
        public void setItem(ApiItem item) { this.item = item; }
    }

    private static class ApiItem {
        private String prmmiMnno;         // 통신판매 신고번호
        private String dclrDate;          // 신고일자
        private String operSttusCdNm;     // 운영상태
        private String domnCn;            // 도메인
        private String opnServerPlaceAladr; // 서버 위치
        private String ntslMthdNm;        // 판매 방법
        private String trtmntPrdlstNm;    // 취급 품목

        // Getters and Setters
        public String getPrmmiMnno() { return prmmiMnno; }
        public void setPrmmiMnno(String prmmiMnno) { this.prmmiMnno = prmmiMnno; }
        public String getDclrDate() { return dclrDate; }
        public void setDclrDate(String dclrDate) { this.dclrDate = dclrDate; }
        public String getOperSttusCdNm() { return operSttusCdNm; }
        public void setOperSttusCdNm(String operSttusCdNm) { this.operSttusCdNm = operSttusCdNm; }
        public String getDomnCn() { return domnCn; }
        public void setDomnCn(String domnCn) { this.domnCn = domnCn; }
        public String getOpnServerPlaceAladr() { return opnServerPlaceAladr; }
        public void setOpnServerPlaceAladr(String opnServerPlaceAladr) { this.opnServerPlaceAladr = opnServerPlaceAladr; }
        public String getNtslMthdNm() { return ntslMthdNm; }
        public void setNtslMthdNm(String ntslMthdNm) { this.ntslMthdNm = ntslMthdNm; }
        public String getTrtmntPrdlstNm() { return trtmntPrdlstNm; }
        public void setTrtmntPrdlstNm(String trtmntPrdlstNm) { this.trtmntPrdlstNm = trtmntPrdlstNm; }
    }
} 