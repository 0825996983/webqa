package com.example.webbanquanao_be.Security;
import com.example.webbanquanao_be.dto.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
  private  String jwt;
  private UserResponse user;
}
