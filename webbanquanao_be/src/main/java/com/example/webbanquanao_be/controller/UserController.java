package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Security.JwtResponse;
import com.example.webbanquanao_be.Security.Loginrequest;
import com.example.webbanquanao_be.Service.AccountService;
import com.example.webbanquanao_be.Service.JwtSevice;
import com.example.webbanquanao_be.Service.UserService;
import com.example.webbanquanao_be.dto.UserResponse;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@CrossOrigin(origins = "*")
@AllArgsConstructor
@RequestMapping("/account")
public class UserController {

    private AccountService accountService;
    private AuthenticationManager authenticationManager;
    private JwtSevice jwtSevice;  // Service xử lý JWT
    private UserService userService;

    private UserRepository userRepository;

    /**
     * API đăng ký tài khoản mới
     */

    @PostMapping("/register")
    public ResponseEntity<?> userRegistration(@Validated @RequestBody User user) {
        ResponseEntity<?> response = accountService.userRegistration(user);
        return response;
    }

     /**
     * API kích hoạt tài khoản thông qua email
     */

    @GetMapping("/activate")
    public ResponseEntity<?> activateAccount(@RequestParam String email, @RequestParam String activationCode) {
        ResponseEntity<?> response = accountService.activateAccount(email, activationCode);
        return response;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Loginrequest loginrequest) {
        try {
            // Xác thực thông tin đăng nhập
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginrequest.getUserName(),  // Tên đăng nhập
                            loginrequest.getPassword()   // Mật khẩu
                    )
            );

            // Nếu xác thực thành công, tạo JWT
            if (authentication.isAuthenticated()) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = userRepository.findByUserName(userDetails.getUsername());
                if (user == null) {
                    throw new RuntimeException("User not found");
                }

                List<String> roles = user.getListRole()
                        .stream()
                        .map(role -> role.getRoleName())
                        .collect(Collectors.toList());

                final String jwt = jwtSevice.generateToken(user.getUserName());

                return ResponseEntity.ok(new JwtResponse(jwt,
                        new UserResponse(
                                user.getId(),
                                user.getUserName(),
                                user.getEmail(),
                                roles
                        )));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Tên đăng nhập hoặc mật khẩu không chính xác");
        }
        return ResponseEntity.badRequest().body("Xác thực không thành công");
    }
}
