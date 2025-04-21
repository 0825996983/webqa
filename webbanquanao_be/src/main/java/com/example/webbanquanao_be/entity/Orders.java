package com.example.webbanquanao_be.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity 
@Data
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "datecreated")
    @CreationTimestamp
    private Date dateCreated;
    @Column(name = "name")
    private String name;

    @Column(name = "shippingaddress", length = 512)
    private String shippingAddress;


    @Column(name = "receiver_phone", length = 20)
    private String receiverPhone;
    @Column(name = "email")
    private String email;


    @Column(name = "shippingcost")
    private BigDecimal shippingCost;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column(name = "totalpayment")
    private BigDecimal totalPayment;


    @OneToMany(mappedBy = "orders",
            fetch = FetchType.LAZY, cascade = CascadeType.ALL
    )
    private List<Order_Details> listOrderDetail;


    @ManyToOne(    fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    @JoinColumn(name = "user_id", nullable = false)
    private User user;



    @ManyToOne(    fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    @JoinColumn(name = "paymentmethod_id")
    private Payment_Method paymentMethod;

    @ManyToOne(    fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH }
    )
    @JoinColumn(name = "deliverymethod_id")
    private Delivery_Method deliveryMethod;

    public enum Status{
        FINISHED("Đã thanh toán"), PENDING("Chưa thanh toán");

        Status(String s) {
        }
    }




}
