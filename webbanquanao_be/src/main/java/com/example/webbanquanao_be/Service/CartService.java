package com.example.webbanquanao_be.Service;

import com.example.webbanquanao_be.dto.AddToCartRequest;
import com.example.webbanquanao_be.dto.CartItemResponse;
import com.example.webbanquanao_be.entity.*;
import com.example.webbanquanao_be.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private GaleryRepository galeryRepository;

    @Autowired
    private UserRepository userRepository;

    // Thêm sản phẩm vào giỏ hàng
    public CartItemResponse addToCart(AddToCartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);  // Lưu giỏ hàng mới nếu không có
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);  // Cập nhật số lượng
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(1);  // Thêm sản phẩm mới vào giỏ
            cartItem.setPrice(product.getPrice());
        }

        cartItem = cartItemRepository.save(cartItem);

        return convertToResponse(cartItem);
    }

    // Lấy tất cả sản phẩm trong giỏ hàng của người dùng
    public List<CartItemResponse> getCartItemsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            return new ArrayList<>();
        }

        List<CartItem> items = cartItemRepository.findByCart(cart);
        List<CartItemResponse> result = new ArrayList<>();

        for (CartItem item : items) {
            result.add(convertToResponse(item));  // Sử dụng phương thức chuyển đổi
        }

        return result;
    }

    // Tăng số lượng sản phẩm trong giỏ hàng
    public CartItemResponse increaseQuantity(Long userId, Long productId) {
        CartItem cartItem = getCartItemByUserAndProduct(userId, productId);
        cartItem.setQuantity(cartItem.getQuantity() + 1);
        cartItem = cartItemRepository.save(cartItem);
        return convertToResponse(cartItem);
    }

    // Giảm số lượng sản phẩm trong giỏ hàng
    public CartItemResponse decreaseQuantity(Long userId, Long productId) {
        CartItem cartItem = getCartItemByUserAndProduct(userId, productId);

        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            cartItem = cartItemRepository.save(cartItem);
        } else {
            cartItemRepository.delete(cartItem);  // Xóa sản phẩm khi số lượng = 1
        }
        return convertToResponse(cartItem);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    public void deleteProductFromCart(Long userId, Long productId) {
        CartItem cartItem = getCartItemByUserAndProduct(userId, productId);
        cartItemRepository.delete(cartItem);
    }

    // Lấy CartItem dựa trên userId và productId
    private CartItem getCartItemByUserAndProduct(Long userId, Long productId) {
        Cart cart = cartRepository.findByUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        return cartItemRepository.findByCartAndProduct(cart, productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tìm thấy"))).orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng"));
    }

    // Chuyển đổi CartItem sang CartItemResponse để trả về frontend
    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();

        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getProductName());
        response.setQuantity(cartItem.getQuantity());
        response.setPrice(cartItem.getPrice());

        // Lấy ảnh sản phẩm từ Galery
        List<Galery> galeries = galeryRepository.findByProductId(cartItem.getProduct().getId());
        if (!galeries.isEmpty()) {
            response.setImageData(galeries.get(0).getImageData());
        }

        return response;
    }
}
