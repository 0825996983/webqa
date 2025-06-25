package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.entity.Cart;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;



    @Autowired
    public RedisCacheService(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    private String getCartKey(Long userId) {
        return "cart:" + userId;
    }

    public void saveCartToCache(Long userId, Cart cart) {
        try {
            String cartJson = objectMapper.writeValueAsString(cart);
            redisTemplate.opsForValue().set(getCartKey(userId), cartJson);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi serialize Cart thành JSON", e);
        }
    }

    public Cart getCartFromCache(Long userId) {
        String cartJson = redisTemplate.opsForValue().get(getCartKey(userId));
        if (cartJson == null) return null;
        try {
            return objectMapper.readValue(cartJson, Cart.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Lỗi deserialize Cart từ JSON", e);
        }
    }



    public void deleteCartCache(Long userId) {
        redisTemplate.delete(getCartKey(userId));
    }
}

