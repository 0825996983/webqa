package com.example.webbanquanao_be.repository;


import com.example.webbanquanao_be.entity.Orders;
import com.example.webbanquanao_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "order",exported = false)
public interface OrdersRepository extends JpaRepository<Orders,Long> {
    Optional<Orders> findTopByUserAndStatus(User user, Orders.Status status);
    List<Orders> findByUser_IdAndStatus(Long userId, Orders.Status status);

    List<Orders> findByStatus(Orders.Status status);

    List<Orders> findAllByUser_UserName(String userName);


}
