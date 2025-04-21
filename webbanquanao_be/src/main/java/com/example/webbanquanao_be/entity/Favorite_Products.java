package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
@Table(name = "favoriteproduct")
public class Favorite_Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
