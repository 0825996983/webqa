package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
@Table(name = "evaluate")
public class Evaluate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;
    @Column(name = "rating")
    private int Rating;

    @Column(name = "comment")
    private String comment;


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
