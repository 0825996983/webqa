package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.config.PayPalConfig;
import com.example.webbanquanao_be.dto.CheckoutRequest;
import com.example.webbanquanao_be.entity.CartItem;
import com.example.webbanquanao_be.entity.Order_Details;
import com.example.webbanquanao_be.entity.Orders;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.CartItemRepository;
import com.example.webbanquanao_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PayPalService {
     private final UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private final PayPalConfig payPalConfig;

    private final CartItemRepository cartItemRepository; // Thêm repository để lấy CartItem

    public String getAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(payPalConfig.getClientId(), payPalConfig.getSecret());
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<?> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
                payPalConfig.getBaseUrl() + "/v1/oauth2/token",
                request,
                Map.class
        );
        return (String) response.getBody().get("access_token");
    }

    public String createOrder(CheckoutRequest request) {
        String accessToken = getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Lấy giỏ hàng của người dùng từ request (request chứa userId)
        List<CartItem> cartItems = cartItemRepository.findByCart_User_Id(request.getUserId());
        // Tính tổng số tiền từ giỏ hàng
        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Định nghĩa đơn hàng PayPal
        Map<String, Object> order = new HashMap<>();
        order.put("intent", "CAPTURE");
        order.put("purchase_units", List.of(
                Map.of("amount", Map.of(
                        "currency_code", "USD",
                        "value", totalAmount.toPlainString()  // Tổng số tiền đã tính toán
                ))
        ));
        order.put("application_context", Map.of(
                "return_url", payPalConfig.getReturnUrl(),
                "cancel_url", payPalConfig.getCancelUrl()
        ));

        // Gửi thông tin đơn hàng đến PayPal
        HttpEntity<?> entity = new HttpEntity<>(order, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
                payPalConfig.getBaseUrl() + "/v2/checkout/orders",
                entity,
                Map.class
        );


        // Trả về approvalUrl (URL để người dùng duyệt thanh toán)
        List<Map<String, String>> links = (List<Map<String, String>>) response.getBody().get("links");
        return links.stream()
                .filter(link -> "approve".equals(link.get("rel")))
                .map(link -> link.get("href"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy approval_url"));
    }

    public boolean captureOrder(String orderId) {
        String accessToken = getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
                payPalConfig.getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture",
                entity,
                Map.class
        );

        String status = (String) response.getBody().get("status");
        return "COMPLETED".equalsIgnoreCase(status);
    }
}
