package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Order_Details;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@RepositoryRestResource(path = "OrderDetail",exported = false)
public interface OrderDetailRepository extends JpaRepository<Order_Details, Long> {

    List<Order_Details> findByOrdersId(Long orderId);
}
