package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcommerceValidationRequest {
    private String businessNumber;  // ����ڵ�Ϲ�ȣ
    private String brandName;      // ��ȣ��
} 