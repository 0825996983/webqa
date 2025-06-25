package com.example.webbanquanao_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToMany(mappedBy = "orders", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Order_Details> listOrderDetail;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "paymentmethod_id")
    private Payment_Method paymentMethod;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = {
            CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.DETACH, CascadeType.REFRESH
    })
    @JoinColumn(name = "deliverymethod_id")
    private Delivery_Method deliveryMethod;

    public enum Status {
        PENDING("Chưa thanh toán"),
        PROCESSING("Đang xử lý"),
        SHIPPING("Đang giao hàng"),
        COMPLETED("Đã hoàn thành"),
        CANCELED("Đã hủy"),
        FAILED("Thất bại"),
        FINISHED("Đã thanh toán");

        private final String label;

        Status(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
