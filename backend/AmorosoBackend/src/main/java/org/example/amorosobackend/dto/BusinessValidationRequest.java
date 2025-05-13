package org.example.amorosobackend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BusinessValidationRequest {
    private String businessNumber; 
    private String startDate;       
    private String ownerName;       
    private String companyName;     
    private String businessAddress; 
} 