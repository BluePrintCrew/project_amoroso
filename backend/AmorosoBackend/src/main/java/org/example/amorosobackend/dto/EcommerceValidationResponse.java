package org.example.amorosobackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EcommerceValidationResponse {
    private String registrationNumber;    // ����Ǹž� �Ű��ȣ
    private LocalDate registrationDate;   // ����Ǹž� �Ű�����
    private String businessStatus;        // ��������
    private String domain;               // ����Ǹ� ����Ʈ ������
    private String serverLocation;       // ���� ��ġ ���
    private String salesMethod;          // ����Ǹ� ���
    private String productCategories;    // ��� ǰ��
    private boolean isValid;             // ��ȿ�� ����Ǹž��� ����
    private String message;              // ���� ��� �޽���
} 