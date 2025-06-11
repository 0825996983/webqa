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

    @Autowired
    private RedisCacheService redisCacheService;

    public CartItemResponse addToCart(AddToCartRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Cart cart = redisCacheService.getCartFromCache(user.getId());

        if (cart == null) {

            cart = cartRepository.findByUser(user);
            if (cart == null) {
                cart = new Cart();
                cart.setUser(user);
                cart.setCartItems(new ArrayList<>());
                cart = cartRepository.save(cart);

            }
            redisCacheService.saveCartToCache(user.getId(), cart);
        } else if (cart.getUser() == null) {
            cart.setUser(user); // 🔥 Fix lỗi Hibernate null user
        }

        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + 1);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(1);
            newItem.setPrice(product.getPrice());
            cart.getCartItems().add(newItem);
        }

        cart = cartRepository.save(cart);
        redisCacheService.saveCartToCache(user.getId(), cart);

        CartItem updatedItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst()
                .get();

        return convertToResponse(updatedItem);
    }

    public List<CartItemResponse> getCartItemsByUserId(Long userId) {
        Cart cart = redisCacheService.getCartFromCache(userId);

        if (cart == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart = cartRepository.findByUser(user);
            if (cart == null) {
                return new ArrayList<>();
            }
            redisCacheService.saveCartToCache(userId, cart);
        }

        List<CartItemResponse> result = new ArrayList<>();
        for (CartItem item : cart.getCartItems()) {
            result.add(convertToResponse(item));
        }
        return result;
    }

    public CartItemResponse increaseQuantity(Long userId, Long productId) {
        Cart cart = redisCacheService.getCartFromCache(userId);

        if (cart == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart = cartRepository.findByUser(user);
            if (cart == null) {
                throw new RuntimeException("Giỏ hàng không tồn tại");
            }
            cart.setUser(user); // đảm bảo user không null
        } else if (cart.getUser() == null) {
            // Gán lại user nếu bị mất do deserialize từ Redis
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart.setUser(user);
        }

        Optional<CartItem> itemOpt = cart.getCartItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng");
        }

        CartItem cartItem = itemOpt.get();
        cartItem.setQuantity(cartItem.getQuantity() + 1);

        cart = cartRepository.save(cart);
        redisCacheService.saveCartToCache(userId, cart);

        return convertToResponse(cartItem);
    }

    public CartItemResponse decreaseQuantity(Long userId, Long productId) {
        Cart cart = getCartOrThrow(userId);
        ensureUserAssigned(cart, userId);

        Optional<CartItem> itemOpt = cart.getCartItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng");
        }

        CartItem cartItem = itemOpt.get();
        if (cartItem.getQuantity() > 1) {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
        } else {
            cart.getCartItems().remove(cartItem);
            cartItemRepository.delete(cartItem);
        }

        cart = cartRepository.save(cart);
        redisCacheService.saveCartToCache(userId, cart);

        return convertToResponse(cartItem);
    }

    public void deleteProductFromCart(Long userId, Long productId) {
        Cart cart = getCartOrThrow(userId);
        ensureUserAssigned(cart, userId);

        Optional<CartItem> itemOpt = cart.getCartItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (itemOpt.isEmpty()) {
            throw new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng");
        }

        CartItem cartItem = itemOpt.get();
        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        cart = cartRepository.save(cart);
        redisCacheService.saveCartToCache(userId, cart);
    }

    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getProductName());
        response.setQuantity(cartItem.getQuantity());
        response.setPrice(cartItem.getPrice());

        List<Galery> galeries = galeryRepository.findByProductId(cartItem.getProduct().getId());
        if (!galeries.isEmpty()) {
            response.setImageData(galeries.get(0).getImageData());
        }

        return response;
    }

    private Cart getCartOrThrow(Long userId) {
        Cart cart = redisCacheService.getCartFromCache(userId);
        if (cart == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart = cartRepository.findByUser(user);
            if (cart == null) {
                throw new RuntimeException("Giỏ hàng không tồn tại");
            }
        }
        return cart;
    }

    // Đảm bảo cart có User trước khi lưu
    private void ensureUserAssigned(Cart cart, Long userId) {
        if (cart.getUser() == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            cart.setUser(user);
        }
    }
}
