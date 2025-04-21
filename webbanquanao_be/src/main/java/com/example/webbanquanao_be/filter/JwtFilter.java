package com.example.webbanquanao_be.filter;

import com.example.webbanquanao_be.Service.JwtSevice;
import com.example.webbanquanao_be.Service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@AllArgsConstructor
@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtSevice jwtSevice;
    @Autowired
    private UserService userDetailSevice;  // Dịch vụ lấy thông tin người dùng từ database

    // Constructor mặc định
    public JwtFilter() {}

    /**
     * Xử lý request để kiểm tra JWT Token, nếu hợp lệ thì thiết lập authentication.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Lấy giá trị của Header "Authorization"
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userName = null;

        // Kiểm tra xem Header có chứa Token hợp lệ không (phải bắt đầu bằng "Bearer ")
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Cắt bỏ "Bearer " để lấy JWT Token
            userName = jwtSevice.extractUserName(token); // Trích xuất username từ token
            System.out.println("Extracted username: " + userName); // In ra để kiểm tra

        }




        // Nếu có userName nhưng chưa được xác thực trong SecurityContextHolder
        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Lấy thông tin chi tiết của user từ database
            UserDetails userDetails = userDetailSevice.loadUserByUsername(userName);

            // Kiểm tra tính hợp lệ của token
            if (jwtSevice.validateToken(token, userDetails)) {
                System.out.println("Token is valid: " + jwtSevice.validateToken(token, userDetails));

                // Tạo authentication token cho Spring Security
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Gán thông tin của request vào authentication token
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Đặt authentication vào SecurityContextHolder để đánh dấu user đã đăng nhập
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Tiếp tục chuỗi filter (đảm bảo request vẫn hoạt động bình thường)
        filterChain.doFilter(request, response);
    }
}
