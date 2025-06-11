package com.example.webbanquanao_be.repository;

import com.example.webbanquanao_be.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(path = "role",exported = false)
public interface RoleRepository extends JpaRepository<Role,Integer> {
    public  Role findByRoleName(String roleName);
}
