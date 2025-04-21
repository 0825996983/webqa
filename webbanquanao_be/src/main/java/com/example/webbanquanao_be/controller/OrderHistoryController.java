package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.OrderService;
import com.example.webbanquanao_be.dto.OrderHistoryResponse;
import com.example.webbanquanao_be.entity.Order_Details;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderHistoryController {


    private final OrderService orderService;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<OrderHistoryResponse>> getOrderHistory(@PathVariable Long userId) {
        List<OrderHistoryResponse> orderHistory = orderService.getOrderHistory(userId);
        if (orderHistory.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orderHistory);
    }
}
