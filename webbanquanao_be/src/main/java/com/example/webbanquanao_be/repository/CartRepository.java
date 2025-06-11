package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Cart;

import com.example.webbanquanao_be.entity.CartItem;
import com.example.webbanquanao_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;


@RepositoryRestResource(exported = false)
public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser(User user);


}

