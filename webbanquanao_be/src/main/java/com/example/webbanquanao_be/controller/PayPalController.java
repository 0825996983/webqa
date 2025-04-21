package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.PayPalService;
import com.example.webbanquanao_be.Service.OrderService;
import com.example.webbanquanao_be.dto.CheckoutRequest;
import com.example.webbanquanao_be.entity.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@RequiredArgsConstructor
public class PayPalController {

    private final PayPalService payPalService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CheckoutRequest request) {
        // Tạo đơn hàng tạm thời
        Orders order = orderService.createTemporaryOrder(request);
        String approvalUrl = payPalService.createOrder(request); // Tạo đơn hàng trên PayPal
        return ResponseEntity.ok().body(Map.of("approvalUrl", approvalUrl)); // Trả về URL PayPal
    }




    @GetMapping("/capture-order")
    public ResponseEntity<?> captureOrder(@RequestParam String token,  @RequestParam Long userId) {
        boolean success = payPalService.captureOrder(token);

        if (success) {
            // ✨ Sau khi capture thành công  ,lưu đơn hàng
            Orders order = orderService.createOrderAfterPayPal(userId, token);
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.badRequest().body("Thanh toán thất bại!");
        }
    }
}
