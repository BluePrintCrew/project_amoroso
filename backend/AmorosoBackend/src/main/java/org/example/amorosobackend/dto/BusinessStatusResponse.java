package org.example.amorosobackend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Business Status Check Response")
public class BusinessStatusResponse {
    @Schema(description = "Business registration number")
    private String businessNumber;

    @Schema(description = "Tax type name")
    private String taxationType;

    @Schema(description = "Tax type code")
    private String taxTypeCode;

    @Schema(description = "Business status name")
    private String businessStatus;

    @Schema(description = "Business status code")
    private String businessStatusCode;

    @Schema(description = "Business end date (if closed)")
    private String endDate;

    @Schema(description = "Last tax type change date")
    private String taxTypeChangeDate;

    @Schema(description = "Previous tax type name")
    private String lastTaxationType;

    @Schema(description = "Previous tax type code")
    private String lastTaxTypeCode;
} 