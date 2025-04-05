package org.example.amorosobackend.controller;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.amorosobackend.domain.Order;
import org.example.amorosobackend.dto.PaymentDTO;
import org.example.amorosobackend.enums.OrderStatus;
import org.example.amorosobackend.enums.PaymentStatus;
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

    // 아임포트 클라이언트 선언
    private IamportClient iamportClient;

    // 생성자 주입을 통해 아임포트 클라이언트 초기화
    @Autowired
    public PaymentController(@Value("${iamport.api_key}") String apiKey,
                             @Value("${iamport.api_secret}") String apiSecret,
                             PaymentService paymentService,
                             OrderService orderService) {
        this.iamportClient = new IamportClient(apiKey, apiSecret);
        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    /**
     * 결제 완료 후 아임포트로부터 imp_uid를 받아 결제 정보를 검증하고,
     * 결제가 유효하면 해당 주문의 상태를 업데이트합니다.
     *
     * @return 처리 결과 메시지
     * @throws IamportResponseException 아임포트 API 호출 시 발생하는 예외
     * @throws IOException IO 예외
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentDTO.PaymentVerifyResponse> verifyPayment(@RequestBody PaymentDTO.PaymentVerifyRequest request) throws IamportResponseException, IOException {


        IamportResponse<Payment> response = iamportClient.paymentByImpUid(request.getImpUid());
        Payment paymentData = response.getResponse();

        if (paymentData == null) {
            return ResponseEntity.badRequest().body(new PaymentDTO.PaymentVerifyResponse(false, "유효하지 않은 결제 정보입니다."));
        }

        log.info("getOrderId = {}", request.getOrderId());
        Order order = orderService.getOrderById(request.getOrderId());
        if (order == null) {
            return ResponseEntity.badRequest().body(new PaymentDTO.PaymentVerifyResponse(false, "해당 주문을 찾을 수 없습니다."));
        }

        BigDecimal amountPaid = paymentData.getAmount();
        log.info("amount paid = {} order.getTotalPrice = {}", amountPaid,order.getTotalPrice());
        if (amountPaid.compareTo(BigDecimal.valueOf(order.getTotalPrice())) != 0) {
            return ResponseEntity.badRequest().body(new PaymentDTO.PaymentVerifyResponse(false, "결제 금액이 주문 금액과 일치하지 않습니다."));
        }

        orderService.updatePaymentStatus(order, PaymentStatus.COMPLETED);
        orderService.updateOrderStatus(order, OrderStatus.PAYMENT_COMPLETED);

        return ResponseEntity.ok(new PaymentDTO.PaymentVerifyResponse(true, "결제가 성공적으로 완료되었습니다."));
    }


}

