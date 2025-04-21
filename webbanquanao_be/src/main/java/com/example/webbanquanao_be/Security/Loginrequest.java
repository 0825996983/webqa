package com.example.webbanquanao_be.Security;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Loginrequest {
    private String userName;
    private String password;



}
