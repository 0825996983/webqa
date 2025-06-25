package com.example.webbanquanao_be.controller;

import com.example.webbanquanao_be.Security.JwtResponse;
import com.example.webbanquanao_be.Security.Loginrequest;
import com.example.webbanquanao_be.Service.AccountService;
import com.example.webbanquanao_be.Service.JwtSevice;
import com.example.webbanquanao_be.Service.UserService;
import com.example.webbanquanao_be.dto.UserResponse;
import com.example.webbanquanao_be.entity.User;
import com.example.webbanquanao_be.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Auth", description = "Xác thực và đăng nhập người dùng")
public class UserController {

    private final AccountService accountService;
    private final AuthenticationManager authenticationManager;
    private final JwtSevice jwtSevice;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản")
    public ResponseEntity<?> userRegistration(@Validated @RequestBody User user) {
        return accountService.userRegistration(user);
    }

    @GetMapping("/activate")
    @Operation(summary = "Kích hoạt tài khoản qua email")
    public ResponseEntity<?> activateAccount(@RequestParam String email, @RequestParam String activationCode) {
        return accountService.activateAccount(email, activationCode);
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập tài khoản")
    public ResponseEntity<?> login(@RequestBody Loginrequest loginrequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginrequest.getUserName(),
                            loginrequest.getPassword()
                    )
            );

            if (authentication.isAuthenticated()) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = userRepository.findByUserName(userDetails.getUsername());
                if (user == null) {
                    throw new RuntimeException("User not found");
                }

                List<String> roles = user.getListRole().stream()
                        .map(role -> role.getRoleName())
                        .collect(Collectors.toList());

                String jwt = jwtSevice.generateToken(user.getUserName());

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
