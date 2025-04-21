package com.example.webbanquanao_be.dto;

import com.example.webbanquanao_be.entity.Order_Details;
import com.example.webbanquanao_be.entity.Orders;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class OrderHistoryResponse {

    private Long orderId;
    private String fullName;
    private String email;
    private String receiverPhone;
    private String shippingAddress;
    private String status;
    private BigDecimal totalPayment;
    private List<OrderItem> orderItems;

    // Constructor để tạo OrderHistoryResponse từ Orders và Order_Details
    public OrderHistoryResponse(Orders order, List<Order_Details> orderDetails) {
        this.orderId = order.getId();
        this.fullName = order.getName();
        this.email = order.getEmail();
        this.receiverPhone = order.getReceiverPhone();
        this.shippingAddress = order.getShippingAddress();
        this.status = order.getStatus().toString();
        this.totalPayment = order.getTotalPayment();

        // Tạo danh sách OrderItem từ orderDetails
        this.orderItems = orderDetails.stream()
                .map(item -> new OrderItem(
                        item.getProduct().getProductName(), // Tên sản phẩm
                        item.getProduct().getListGalery().get(0).getImageData(), // Lấy tên ảnh đầu tiên của sản phẩm
                        item.getQuantity(), // Số lượng sản phẩm
                        item.getProduct().getPrice() // Giá sản phẩm
                ))
                .collect(Collectors.toList());
    }

    // Lớp OrderItem dùng để chứa thông tin chi tiết sản phẩm trong đơn hàng
    @Getter
    @AllArgsConstructor
    public static class OrderItem {
        private String productName;
        private String productImage; // Hình ảnh sản phẩm (Lấy ảnh đầu tiên)
        private int quantity;        // Số lượng sản phẩm
        private BigDecimal price;    // Giá sản phẩm
    }
}
