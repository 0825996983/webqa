package com.example.webbanquanao_be.repository;


import com.example.webbanquanao_be.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(path = "category")
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
