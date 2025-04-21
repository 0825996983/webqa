package com.example.webbanquanao_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
public class PaymentHistoryResponse {
    private Long orderId;
    private String userName;
    private String fullName;
    private Date dateCreated;
    private String email;
    private String receiverPhone;
    private String shippingAddress;
    private String status;
    private BigDecimal totalPayment;
}
