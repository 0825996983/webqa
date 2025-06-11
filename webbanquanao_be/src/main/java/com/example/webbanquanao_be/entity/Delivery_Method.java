package com.example.webbanquanao_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "deliverymethod")
public class Delivery_Method {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "deliverymethodname")
    private String deliveryMethodName;

    @Column(name = "description")
    private String description;

    @Column(name = "paymentcost")
    private double paymentCost;

    @JsonIgnore  // ✅ Tránh vòng lặp Delivery_Method → Orders → Delivery_Method
    @OneToMany(mappedBy = "deliveryMethod",
            fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    private List<Orders> listOder;
}
