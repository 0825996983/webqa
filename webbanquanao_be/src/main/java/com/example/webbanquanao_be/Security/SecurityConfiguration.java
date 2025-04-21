package com.example.webbanquanao_be.Security;

import com.example.webbanquanao_be.Service.UserService;
import com.example.webbanquanao_be.filter.JwtFilter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@AllArgsConstructor
public class SecurityConfiguration {

    private JwtFilter jwtFilter; // Bộ lọc JWT để kiểm tra token trong request

    // Bean dùng để mã hóa mật khẩu bằng BCrypt
    @Bean


    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình Authentication Provider để xác thực user thông qua UserService
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider dap = new DaoAuthenticationProvider();
        dap.setUserDetailsService(userService); // Sử dụng UserService để lấy thông tin user
        dap.setPasswordEncoder(passwordEncoder()); // Dùng BCrypt để kiểm tra mật khẩu
        return dap;
    }

    // Cấu hình bảo mật của ứng dụng
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.authorizeHttpRequests(
                configurer -> configurer
                        .requestMatchers("/api/payment-history/paid").permitAll()
                        .requestMatchers("/api/paypal/capture-order/**").permitAll()
                        .requestMatchers("/api/cart/**").authenticated()
                        .requestMatchers(HttpMethod.GET, Endpoints.PUBLIC_GET_ENDPOINTS).authenticated()
                        .requestMatchers(HttpMethod.POST, Endpoints.PUBLIC_POST_ENDPOINTS).authenticated()    // API POST public - Ai cũng có thể truy cập
                        .requestMatchers(HttpMethod.GET, Endpoints.ADMIN_GET_ENDPOINTS).hasAuthority("ADMIN") // Chỉ ADMIN mới có quyền GET
                        .requestMatchers(HttpMethod.POST, Endpoints.ADMIN_POST_ENDPOINTS).hasAuthority("ADMIN") // Chỉ ADMIN mới có quyền POST
        );

        // Cấu hình CORS - Chỉ cho phép frontend từ địa chỉ được khai báo truy cập
        http.cors(cors -> {
            cors.configurationSource(request -> {
                CorsConfiguration corsConfig = new CorsConfiguration();
                corsConfig.addAllowedOrigin(Endpoints.front_end_host);                       // Chỉ cho phép frontend gọi API
                corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE")); // Cho phép các phương thức HTTP
                corsConfig.addAllowedHeader("*");                                            // Cho phép tất cả header trong request
                return corsConfig;
            });
        });

        // Quản lý session theo dạng STATELESS - Không lưu trạng thái đăng nhập trên server
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Tắt CSRF - Không cần thiết khi dùng JWT
        http.csrf(csrf -> csrf.disable());

        // Thêm bộ lọc JWT trước khi xử lý xác thực user bằng UsernamePasswordAuthenticationFilter
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        // Cấu hình HTTP Basic (chế độ xác thực đơn giản) nhưng không cần thiết vì dùng JWT
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    // Quản lý Authentication (xác thực user)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
