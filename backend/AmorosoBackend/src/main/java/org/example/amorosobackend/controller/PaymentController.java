//package org.example.amorosobackend.controller;
//
//import io.portone.sdk.server.PortOneClient;
//import io.portone.server.sdk.exception.PortOneException;
//import io.portone.server.sdk.model.Amount;
//import io.portone.server.sdk.model.PaymentDetail;
//import io.portone.server.sdk.model.PortOneResponse;
//import io.portone.sdk.server.payment.CancelledPayment;
////import io.portone.server.sdk.webhook.PortOneWebhook;
////import io.portone.server.sdk.webhook.PortOneWebhookVerificationException;
//import org.example.amorosobackend.dto.PaymentDTO.PaymentCompleteRequest;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import javax.servlet.http.HttpServletRequest;
//import java.util.Enumeration;
//import java.util.HashMap;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@RestController
//@RequestMapping("/api")
//public class PaymentController {
//
//    // PortOne SDK 클라이언트 초기화 (V2_API_SECRET는 환경변수로 설정)
//    private final PortOneClient portOneClient = new PortOneClient(System.getenv("V2_API_SECRET"));
//
//    // in-memory 결제 저장소 (paymentId -> PaymentInfo)
//    private final Map<String, PaymentInfo> paymentStore = new ConcurrentHashMap<>();
//
//    // in-memory 상품 정보 (예: "shoes")
//    private final Map<String, Item> items = new HashMap<>();
//
//    public PaymentController() {
//        // 상품 정보 초기화
//        items.put("shoes", new Item("신발", 1000, "KRW"));
//    }
//
//    // 상품 정보 조회: GET /api/item
//    @GetMapping("/item")
//    public ResponseEntity<ItemResponse> getItem() {
//        String id = "shoes";
//        Item item = items.get(id);
//        if (item == null) {
//            return ResponseEntity.notFound().build();
//        }
//        ItemResponse response = new ItemResponse(id, item.getName(), item.getPrice(), item.getCurrency());
//        return ResponseEntity.ok(response);
//    }
//
//    // 결제 완료 후 검증 요청: POST /api/payment/complete
//    @PostMapping("/payment/complete")
//    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteRequest req) {
//        String paymentId = req.getPaymentId();
//        if (paymentId == null || paymentId.isEmpty()) {
//            return ResponseEntity.badRequest().body("올바르지 않은 요청입니다.");
//        }
//        PaymentInfo payment = syncPayment(paymentId);
//        if (payment == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("결제 동기화에 실패했습니다.");
//        }
//        Map<String, String> response = new HashMap<>();
//        response.put("status", payment.getStatus());
//        return ResponseEntity.ok(response);
//    }
//
//    // 결제 동기화 메서드 (Node 코드의 syncPayment와 동일한 로직)
//    private PaymentInfo syncPayment(String paymentId) {
//        // 결제 저장소에 없으면 기본 상태(PENDING) 저장
//        paymentStore.putIfAbsent(paymentId, new PaymentInfo("PENDING"));
//        PaymentInfo storedPayment = paymentStore.get(paymentId);
//        PaymentDetail actualPayment;
//        try {
//            PortOneResponse<PaymentDetail> paymentRes = portOneClient.payment().getPayment(paymentId);
//            actualPayment = paymentRes.getResponse();
//        } catch (PortOneException e) {
//            return null;
//        }
//        if ("PAID".equals(actualPayment.getStatus())) {
//            if (!verifyPayment(actualPayment)) {
//                return null;
//            }
//            if ("PAID".equals(storedPayment.getStatus())) {
//                return storedPayment;
//            }
//            storedPayment.setStatus("PAID");
//            System.out.println("결제 성공: " + actualPayment);
//        } else {
//            return null;
//        }
//        return storedPayment;
//    }
//
//    // 결제 검증 메서드 (Node 코드의 verifyPayment와 동일한 로직)
//    private boolean verifyPayment(PaymentDetail payment) {
//        String customData = payment.getCustomData();
//        if (customData == null) {
//            return false;
//        }
//        try {
//            // JSON 파싱은 org.json 라이브러리를 사용 (또는 Jackson ObjectMapper 등)
//            org.json.JSONObject json = new org.json.JSONObject(customData);
//            String itemKey = json.getString("item");
//            Item item = items.get(itemKey);
//            if (item == null) {
//                return false;
//            }
//            Amount amount = payment.getAmount();
//            return payment.getOrderName().equals(item.getName()) &&
//                    amount.getTotal() == item.getPrice() &&
//                    payment.getCurrency().equals(item.getCurrency());
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    // 웹훅 처리: POST /api/payment/webhook
//    // (body는 raw text로 받아야 PortOne SDK에서 검증할 수 있음)
//    @PostMapping(value = "/payment/webhook", consumes = "application/json")
//    public ResponseEntity<?> webhook(@RequestBody String body, HttpServletRequest request) {
//        // 헤더 정보를 Map으로 변환
//        Map<String, String> headers = new HashMap<>();
//        Enumeration<String> headerNames = request.getHeaderNames();
//        while (headerNames.hasMoreElements()) {
//            String headerName = headerNames.nextElement();
//            headers.put(headerName, request.getHeader(headerName));
//        }
//        try {
//            String webhookSecret = System.getenv("V2_WEBHOOK_SECRET");
//            // PortOne SDK의 웹훅 검증 (verify 메서드 사용)
//            PortOneWebhook webhook = PortOneWebhook.verify(webhookSecret, body, headers);
//            if (webhook.getData() != null && webhook.getData().getPaymentId() != null) {
//                syncPayment(webhook.getData().getPaymentId());
//            }
//            return ResponseEntity.ok().build();
//        } catch (PortOneWebhookVerificationException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }
//}
