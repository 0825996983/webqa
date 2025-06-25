package com.example.webbanquanao_be.repository;


import com.example.webbanquanao_be.entity.Galery;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;


@RepositoryRestResource(path = "category",exported = false)
public interface GaleryRepository extends JpaRepository<Galery,Long> {

    // Lấy danh sách ảnh theo product_id
    List<Galery> findByProductId(Long productId);


}
