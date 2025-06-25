package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Cart;
import com.example.webbanquanao_be.entity.CartItem;
import com.example.webbanquanao_be.entity.Product;
import com.example.webbanquanao_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@RepositoryRestResource(exported = false)
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

     Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    List<CartItem> findByCart(Cart cart);


    List<CartItem> findByCart_User_Id(Long userId);

    void deleteByCart_User_Id(Long userId);

}
