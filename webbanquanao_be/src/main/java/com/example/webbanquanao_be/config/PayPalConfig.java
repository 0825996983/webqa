package com.example.webbanquanao_be.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "paypal")
@Data
public class PayPalConfig {
    private String clientId;
    private String secret;
    private String baseUrl;
    private String returnUrl;
    private String cancelUrl;
}
