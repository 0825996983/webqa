package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "paymentmethod")
public class Payment_Method {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "paymentmethodname")
    private String paymentMethodName;

    @Column(name = "description")
    private String description;
    @Column(name = "paymentcost")

    private Double paymentCost;


    @OneToMany(mappedBy = "paymentMethod",
            fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    private List<Orders> listOder;


}
