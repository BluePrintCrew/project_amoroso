package org.example.amorosobackend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class ReviewImageDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Request {
        private Integer reviewImageOrderNum;
        private Long reviewImageId;// 사용자가 지정한 이미지 순서
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Response {
        private Long reviewImageId;
        private String imageUrl;
        private Long reviewId;
        private Integer reviewImageOrderNum;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResponseList {
        private List<Response> images;
    }
}
