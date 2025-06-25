package com.example.webbanquanao_be.repository;
import com.example.webbanquanao_be.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

@RepositoryRestResource(path = "product")
public interface ProductRepository extends JpaRepository<Product,Long> {

    Page<Product> findByProductNameContaining(@RequestParam("productName") String productName, Pageable pageable);
    Page<Product> findByListCategory_id(@RequestParam("id") int id, Pageable pageable);
    Page<Product> findByProductNameContainingAndListCategory_id(@RequestParam("productName") String productName,@RequestParam("id") int id, Pageable pageable);

}
