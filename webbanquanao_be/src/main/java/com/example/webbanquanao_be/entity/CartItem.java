package com.example.webbanquanao_be.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_item", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"cart_id", "product_id"})
})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với Cart (tránh vòng lặp Cart ↔ CartItem)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonBackReference  // ✅ Kết hợp với @JsonManagedReference trong Cart
    private Cart cart;

    // Liên kết với Product (giữ lại để trả thông tin sản phẩm)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Số lượng sản phẩm trong giỏ
    @Column(nullable = false)
    private int quantity;

    @Column(name = "price")
    private BigDecimal price;
}
