package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.enums.ImageType;

public class ImageControllerDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageRequestDTO {
        private Long productId;
        private Integer imageOrder;
        private String imageType;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ImageResponseDTO {
        private String imageUri;
        // private boolean isMainImage;
        private Long productId;
        private String imageType;
        private Integer imageOrder;
    }
}
