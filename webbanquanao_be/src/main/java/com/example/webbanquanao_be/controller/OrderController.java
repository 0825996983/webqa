package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.OrderService;
import com.example.webbanquanao_be.dto.OrderHistoryResponse;
import com.example.webbanquanao_be.entity.Orders;
import com.example.webbanquanao_be.repository.OrdersRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/orders")
@AllArgsConstructor
@Tag(name = " Orders", description = "Quản lý đơn hàng của người dùng")
public class OrderController {

    private final OrderService orderService;
    private final OrdersRepository ordersRepository;

    @GetMapping("/user")
    @Operation(summary = "Lấy đơn hàng của người dùng đang đăng nhập")
    public ResponseEntity<List<OrderHistoryResponse>> getUserOrders(Principal principal) {
        String username = principal.getName();
        List<Orders> orders = orderService.findAllByUsername(username);

        List<OrderHistoryResponse> response = orders.stream()
                .map(order -> new OrderHistoryResponse(order, order.getListOrderDetail()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{userId}")
    @Operation(summary = "Lấy lịch sử đơn hàng theo userId")
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory(@PathVariable Long userId) {
        List<OrderHistoryResponse> orderHistory = orderService.getOrderHistory(userId);
        if (orderHistory.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orderHistory);
    }
}
