package org.example.amorosobackend.controller;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.domain.PaymentGroup;
import org.example.amorosobackend.dto.PaymentDTO;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
import org.example.amorosobackend.repository.PaymentGroupRepository;
import org.example.amorosobackend.service.OrderService;
import org.example.amorosobackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final PaymentGroupRepository paymentGroupRepository;

    // 아임포트 클라이언트 선언
    private IamportClient iamportClient;

    // 생성자 주입을 통해 아임포트 클라이언트 초기화
    @Autowired
    public PaymentController(@Value("${iamport.api_key}") String apiKey,
                             @Value("${iamport.api_secret}") String apiSecret,
                             PaymentService paymentService,
                             OrderService orderService,
                            PaymentGroupRepository paymentGroupRepository) {
        this.iamportClient = new IamportClient(apiKey, apiSecret);
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.paymentGroupRepository = paymentGroupRepository;
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO.PaymentVerifyResponse> verifyPayment(
            @RequestBody PaymentDTO.PaymentVerifyRequest request) throws Exception {

        // 아임포트 결제 정보 조회
        IamportResponse<Payment> response = iamportClient.paymentByImpUid(request.getImpUid());
        Payment paymentData = response.getResponse();

        if (paymentData == null) {
            return ResponseEntity.badRequest()
                    .body(new PaymentDTO.PaymentVerifyResponse(false, "유효하지 않은 결제 정보입니다."));
        }

        // PaymentGroup 조회
        PaymentGroup paymentGroup = paymentService.getByPaymentGroupId(request.getPaymentGroupId());

        // 결제 금액 검증
        BigDecimal amountPaid = paymentData.getAmount();
        if (amountPaid.compareTo(BigDecimal.valueOf(paymentGroup.getTotalAmount())) != 0) {
            return ResponseEntity.badRequest()
                    .body(new PaymentDTO.PaymentVerifyResponse(false, "결제 금액이 주문 금액과 일치하지 않습니다."));
        }

        // 모든 관련 주문의 상태 업데이트
        for (Order order : paymentGroup.getOrders()) {
            orderService.updatePaymentStatus(order, PaymentStatus.COMPLETED);
            orderService.updateOrderStatus(order, OrderStatus.PAYMENT_COMPLETED);
        }

        // PaymentGroup 상태 업데이트
        paymentGroup.setPaymentStatus(PaymentStatus.COMPLETED);
        paymentGroupRepository.save(paymentGroup);

        return ResponseEntity.ok(new PaymentDTO.PaymentVerifyResponse(true, "결제가 성공적으로 완료되었습니다."));
    }

}

