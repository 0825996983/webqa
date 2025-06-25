package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Favorite_Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(path = "favoriteproduct",exported = false)
public interface FavoriteProductRepository extends JpaRepository<Favorite_Products,Integer> {
}
