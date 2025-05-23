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
            // API ȣ�� �� ���� ó��
            ApiResponse response = restTemplate.getForObject(url, ApiResponse.class);
            
            if (response == null || response.getItems() == null || response.getItems().getItem() == null) {
                return EcommerceValidationResponse.builder()
                        .isValid(false)
                        .message("����Ǹž��� ������ ã�� �� �����ϴ�.")
                        .build();
            }

            ApiItem item = response.getItems().getItem();

            // �������� Ȯ��
            boolean isValidStatus = "����".equals(item.getOperSttusCdNm());

            return EcommerceValidationResponse.builder()
                    .registrationNumber(item.getPrmmiMnno())
                    .registrationDate(LocalDate.parse(item.getDclrDate(), DateTimeFormatter.BASIC_ISO_DATE))
                    .businessStatus(item.getOperSttusCdNm())
                    .domain(item.getDomnCn())
                    .serverLocation(item.getOpnServerPlaceAladr())
                    .salesMethod(item.getNtslMthdNm())
                    .productCategories(item.getTrtmntPrdlstNm())
                    .isValid(isValidStatus)
                    .message(isValidStatus ? "��ȿ�� ����Ǹž����Դϴ�." : "��ȿ���� ���� ����Ǹž����Դϴ�.")
                    .build();

        } catch (Exception e) {
            return EcommerceValidationResponse.builder()
                    .isValid(false)
                    .message("����Ǹž��� ���� �� ������ �߻��߽��ϴ�: " + e.getMessage())
                    .build();
        }
    }

    // API ������ �����ϱ� ���� ���� Ŭ������
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
        private String prmmiMnno;         // ����Ǹž� �Ű��ȣ
        private String dclrDate;          // �Ű�����
        private String operSttusCdNm;     // ��������
        private String domnCn;            // ������
        private String opnServerPlaceAladr; // ���� ��ġ
        private String ntslMthdNm;        // �Ǹ� ���
        private String trtmntPrdlstNm;    // ��� ǰ��

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