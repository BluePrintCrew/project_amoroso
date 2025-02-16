package org.example.amorosobackend.enums;

public enum CategoryCode {

    // 0. 전체보기
    ALL("전체보기"),

    // 1. 리빙 (Living) - 거실 가구
    LIVING_SOFA("LIV_SOFA"),                 // 소파
    LIVING_DISPLAY_CABINET("LIV_DISPLAY"),   // 장식장
    LIVING_TABLE("LIV_TABLE"),               // 탁자

    // 2. 베드룸 (Bedroom) - 침실 가구
    BEDROOM_BED("BED_BED"),                  // 침대
    BEDROOM_BED_BASE("BED_BASE"),            // 침대 깔판
    BEDROOM_NIGHTSTAND("BED_NIGHTSTAND"),    // 협탁

    // 3. 키친 (Kitchen) - 주방 가구
    KITCHEN_DINING_SET("KIT_DINING"),        // 식탁 & 의자

    // 4. 홈 오피스 (Home Office) - 사무용 가구
    OFFICE_DESK("OFF_DESK"),                 // 책상
    OFFICE_CHAIR("OFF_CHAIR"),               // 의자
    OFFICE_BOOKSHELF("OFF_BOOKSHELF"),       // 책장

    // 5. 드레스 룸 (Dressing Room) - 의류 수납 관련 가구
    DRESSING_WARDROBE("DRESS_WARDROBE"),     // 장롱
    DRESSING_TABLE("DRESS_TABLE"),           // 화장대
    DRESSING_DRESSER("DRESS_DRESSER"),       // 드레스
    DRESSING_DRAWER("DRESS_DRAWER"),         // 서랍장

    // 6. 기타 (Etc. or Other) - 기타 소품
    ETC_DECORATION("ETC_DECOR"),             // 소품 (여인상 소,대 / 사각기둥)
    ETC_WALL_MIRROR("ETC_WALL_MIRROR"),      // 벽걸이 (만도린 외 다수)
    ETC_ACCESSORY("ETC_ACCESSORY"),          // 소품 (동자다이 외 다수)
    ETC_GENERAL_MIRROR("ETC_GENERAL_MIRROR");// 거울 (해바라기경 외 다수)

    private final String code;

    CategoryCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}