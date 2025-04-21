package com.example.webbanquanao_be.Service;


import com.example.webbanquanao_be.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
   public User findByUserName(String userName);
}
