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
import java.util.List;

@Component
@AllArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtSevice jwtSevice;

    @Autowired
    private UserService userDetailSevice;

    // Endpoint được public hoặc không cần token
    private static final List<String> WHITELIST = List.of(
            "/swagger-ui", "/swagger-ui.html", "/v3/api-docs",
            "/account/login", "/account/register", "/account/activate",
            "/api/payment-history/paid", "/api/paypal/capture-order",
            "/product/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        //  Cho phép preflight (CORS)
        if ("OPTIONS".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Nếu request là từ WHITELIST → cho qua
        boolean isPublic = WHITELIST.stream().anyMatch(path::startsWith);
        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userName = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            userName = jwtSevice.extractUserName(token);
        }

        //  Nếu không có token → KHÔNG chặn, CHO request tiếp tục
        if (userName == null) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Nếu đã có xác thực rồi → bỏ qua
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailSevice.loadUserByUsername(userName);

            if (jwtSevice.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid JWT");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
