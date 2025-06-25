//package com.example.webbanquanao_be.controller;
//
//import com.example.webbanquanao_be.Service.PaymentHistoryService;
//import com.example.webbanquanao_be.dto.PaymentHistoryResponse;
//import com.example.webbanquanao_be.entity.Orders;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/payment-history")
//public class PaymentHistoryController {
//
//    @Autowired
//    private PaymentHistoryService paymentHistoryService;
//
//
//    @GetMapping("/paid")
//    public List<PaymentHistoryResponse> getAllPaidOrders() {
//        return paymentHistoryService.getAllPaidOrders();
//    }
//
//
//
//
//}
//
