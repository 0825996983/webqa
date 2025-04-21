package com.example.webbanquanao_be.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String shippingAddress;
    private int paymentMethodId;
    private int deliveryMethodId;
}

