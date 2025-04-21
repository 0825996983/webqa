package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "orderdetails")
public class Order_Details {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    
    @Column(name = "quantity")
    private int quantity;


    @Column(name = "price")
    private BigDecimal price;

    @ManyToOne(    fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(    fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    @JoinColumn(name = "orders_id", nullable = false)
    private Orders orders;


}
