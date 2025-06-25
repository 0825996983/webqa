package com.example.webbanquanao_be.dto;


import com.example.webbanquanao_be.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String userName;

    private String email;

    private List<String> roleName;


}
