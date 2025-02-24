package org.example.amorosobackend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.amorosobackend.enums.ElevatorType;

public class UserAddressDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class GetAddress {
        private Long addressId;
        private String recipientName;
        private String phoneNumber;
        private String postalCode;
        private String address;
        private String detailAddress;
        private Boolean isDefault;
        private Boolean freeLoweringService;
        private Boolean productInstallationAgreement;
        private Boolean vehicleEntryPossible;
        private String elevatorType;
    }
}

