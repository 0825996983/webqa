package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Evaluate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(path = "evaluate",exported = false)
public interface EvaluateRepository extends JpaRepository<Evaluate,Long> {
}
