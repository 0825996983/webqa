package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Service.CartService;
import com.example.webbanquanao_be.dto.AddToCartRequest;
import com.example.webbanquanao_be.dto.CartItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@Tag(name = " Cart", description = "Xử lý các thao tác với giỏ hàng")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping
    @Operation(summary = "Thêm sản phẩm vào giỏ hàng")
    public ResponseEntity<CartItemResponse> addToCart(@RequestBody AddToCartRequest request) {
        CartItemResponse response = cartService.addToCart(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Lấy danh sách sản phẩm trong giỏ hàng của người dùng")
    public ResponseEntity<List<CartItemResponse>> getUserCart(@PathVariable Long userId) {
        List<CartItemResponse> cartItems = cartService.getCartItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    @PutMapping("/{userId}/{productId}/increase")
    @Operation(summary = "Tăng số lượng sản phẩm trong giỏ hàng")
    public ResponseEntity<CartItemResponse> increaseQuantity(
            @PathVariable Long userId, @PathVariable Long productId) {
        CartItemResponse response = cartService.increaseQuantity(userId, productId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/{productId}/decrease")
    @Operation(summary = "Giảm số lượng sản phẩm trong giỏ hàng")
    public ResponseEntity<CartItemResponse> decreaseQuantity(
            @PathVariable Long userId, @PathVariable Long productId) {
        CartItemResponse response = cartService.decreaseQuantity(userId, productId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}/{productId}")
    @Operation(summary = "Xóa sản phẩm khỏi giỏ hàng")
    public ResponseEntity<Void> deleteProductFromCart(
            @PathVariable Long userId, @PathVariable Long productId) {
        cartService.deleteProductFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
