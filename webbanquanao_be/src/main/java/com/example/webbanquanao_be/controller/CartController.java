package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.CartService;
import com.example.webbanquanao_be.dto.AddToCartRequest;
import com.example.webbanquanao_be.dto.CartItemResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartService cartService;

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(@RequestBody AddToCartRequest request) {
        CartItemResponse response = cartService.addToCart(request);
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemResponse>> getUserCart(@PathVariable Long userId) {
        List<CartItemResponse> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    // Tăng số lượng sản phẩm trong giỏ hàng
    @PutMapping("/{userId}/{productId}/increase")
    public ResponseEntity<CartItemResponse> increaseQuantity(
            @PathVariable Long userId, @PathVariable Long productId) {
        CartItemResponse response = cartService.increaseQuantity(userId, productId);
        return ResponseEntity.ok(response);
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    @PutMapping("/{userId}/{productId}/decrease")
    public ResponseEntity<CartItemResponse> decreaseQuantity(
            @PathVariable Long userId, @PathVariable Long productId) {
        CartItemResponse response = cartService.decreaseQuantity(userId, productId);
        return ResponseEntity.ok(response);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<Void> deleteProductFromCart(
            @PathVariable Long userId, @PathVariable Long productId) {
        cartService.deleteProductFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
