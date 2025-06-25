package com.example.webbanquanao_be.repository;


import com.example.webbanquanao_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

@RepositoryRestResource(path = "user",exported = false)
public interface UserRepository extends JpaRepository<User,Long> {
    public boolean existsByUserName(String userName);

    public boolean existsByEmail(String email);
    public User findByUserName(String userName);

    public User findByEmail(String email);

}
