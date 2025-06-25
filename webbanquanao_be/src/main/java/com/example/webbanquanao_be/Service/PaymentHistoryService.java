package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.dto.PaymentHistoryResponse;
import com.example.webbanquanao_be.entity.Orders;
import com.example.webbanquanao_be.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentHistoryService {

    @Autowired
    private OrdersRepository ordersRepository;

    // Lấy tất cả đơn hàng đã thanh toán

    // Phương thức lấy danh sách các đơn hàng đã thanh toán
    public List<PaymentHistoryResponse> getAllPaidOrders() {

        List<Orders> orders = ordersRepository.findAll();

        // Chuyển đổi từ Orders thành PaymentHistoryResponse
        return orders.stream()
                .map(order -> new PaymentHistoryResponse(
                        order.getId(),
                        order.getUser().getUserName(),// Giả sử User có phương thức getFullName
                        order.getName(),
                        order.getDateCreated(),
                        order.getUser().getEmail(),
                        order.getReceiverPhone(),
                        order.getShippingAddress(),
                        order.getStatus().name(),  // Trạng thái đơn hàng
                        order.getTotalPayment()
                ))
                .collect(Collectors.toList());
    }


}

