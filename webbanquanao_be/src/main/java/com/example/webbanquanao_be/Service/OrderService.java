package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.dto.CheckoutRequest;
import com.example.webbanquanao_be.dto.OrderHistoryResponse;
import com.example.webbanquanao_be.entity.CartItem;
import com.example.webbanquanao_be.entity.Order_Details;
import com.example.webbanquanao_be.entity.Orders;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final UserRepository userRepository;
    private final OrdersRepository ordersRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final DeliveryMethodRepository deliveryMethodRepository;

    // Tạo đơn hàng tạm thời từ thông tin người dùng và giỏ hàng
    public Orders    createTemporaryOrder(CheckoutRequest request) {

        // Lấy thông tin người dùng
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Orders order = new Orders();
        order.setUser(user);  // Gán user vào đơn hàng
        order.setName(request.getFullName());
        order.setEmail(request.getEmail());
        order.setReceiverPhone(request.getPhoneNumber());
        order.setShippingAddress(request.getShippingAddress());

        // Lấy giỏ hàng của người dùng
        List<CartItem> cartItems = cartItemRepository.findByCart_User_Id(request.getUserId());

        // Tính tổng tiền từ giỏ hàng
        BigDecimal total = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalPayment(total);

        // Thiết lập phương thức thanh toán và giao hàng
        order.setPaymentMethod(paymentMethodRepository.findById(2L).orElseThrow()); // 2 là PayPal
        order.setDeliveryMethod(deliveryMethodRepository.findById(1L).orElseThrow()); // giao hàng mặc định

        // Lưu đơn hàng tạm thời
        Orders savedOrder = ordersRepository.save(order);
        return savedOrder;
    }

    public Orders createOrderAfterPayPal(Long userId, String token) {
        // Tìm người dùng
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Lấy đơn hàng tạm thời
        Orders order = ordersRepository.findTopByUserAndStatus(user, Orders.Status.PENDING)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng tạm thời"));

        // Cập nhật thông tin đơn hàng sau khi thanh toán thành công
        order.setStatus(Orders.Status.FINISHED);  // Đổi trạng thái đơn hàng thành "hoàn thành"
        order.setDateCreated(new Date()); // Cập nhật ngày tạo đơn hàng thành ngày hiện tại


        // Tính lại tổng tiền từ giỏ hàng (nếu có thay đổi)
        BigDecimal total = cartItemRepository.findByCart_User_Id(userId).stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPayment(total);  // Cập nhật tổng tiền thanh toán

        // Cập nhật phương thức thanh toán (PayPal)
        order.setPaymentMethod(paymentMethodRepository.findById(2L).orElseThrow()); // 2 = PayPal
        order.setDeliveryMethod(deliveryMethodRepository.findById(1L).orElseThrow()); // giao hàng mặc định

        // Lưu lại thông tin đơn hàng đã được cập nhật
        Orders savedOrder = ordersRepository.save(order);

        // Lưu chi tiết đơn hàng (Order_Details)
        List<CartItem> cartItems = cartItemRepository.findByCart_User_Id(userId);
        for (CartItem item : cartItems) {
            Order_Details detail = new Order_Details();
            detail.setOrders(savedOrder);
            detail.setProduct(item.getProduct());
            detail.setQuantity(item.getQuantity());
            detail.setPrice(item.getProduct().getPrice());

            orderDetailRepository.save(detail);
        }

        // Xoá giỏ hàng sau khi thanh toán
        cartItemRepository.deleteByCart_User_Id(userId);

        // Không cần xóa đơn hàng tạm thời nữa, vì đơn hàng đã được cập nhật

        return savedOrder;
    }

    public List<OrderHistoryResponse> getOrderHistory(Long userId) {
        // Lấy tất cả đơn hàng đã thanh toán của người dùng
        List<Orders> orders = ordersRepository.findByUser_IdAndStatus(userId, Orders.Status.FINISHED);

        // Nếu không có đơn hàng nào thì trả về danh sách rỗng
        if (orders.isEmpty()) {
            return List.of();
        }

        // Chuyển đổi từng đơn hàng thành OrderHistoryResponse và lấy chi tiết đơn hàng
        return orders.stream().map(order -> {
            // Sử dụng phương thức mới `findByOrdersId` thay vì `findByOrderId`
            List<Order_Details> orderDetails = orderDetailRepository.findByOrdersId(order.getId());
            return new OrderHistoryResponse(order, orderDetails);
        }).collect(Collectors.toList());
    }

    public List<Orders> findAllByUsername(String username) {
        return ordersRepository.findAllByUser_UserName(username);
    }

}
