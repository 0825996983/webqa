package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Payment_Method;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(path = "paymentmethod",exported = false)
public interface PaymentMethodRepository extends JpaRepository<Payment_Method,Long> {
}
