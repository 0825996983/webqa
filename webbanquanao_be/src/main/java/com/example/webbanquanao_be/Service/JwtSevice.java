package com.example.webbanquanao_be.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

/**
 * Lớp JwtService chịu trách nhiệm tạo, xác thực và trích xuất thông tin từ JWT
 */
@Component
public class JwtSevice {

    // Khóa bí mật dùng để ký JWT
    public static final String SERECT = "U29tZVNlY3JldEtleVdpdGhBdEFkZGl0aW9uYWxFbmNvZGluZw==5353463";


    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("isAdmin", true); // Thêm một claim cho biết đây có phải admin hay không
        claims.put("x", "ABC"); // Thêm claim tùy chỉnh
        return createToken(claims, userName);
    }

    /**
     * Tạo JWT với các claim đã chọn
     claims - thông tin thêm vào JWT
      userName - tên đăng nhập
      chuỗi JWT đã tạo
     */
    private String createToken(Map<String, Object> claims, String userName) {
        return Jwts.builder()
                .setClaims(claims) // Đặt các claim
                .setSubject(userName) // Đặt chủ thể của token (tên đăng nhập)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Thời gian phát hành token
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 1000)) // Token hết hạn sau 60 phút
                .signWith(SignatureAlgorithm.HS256, getSignKey()) // Ký JWT bằng thuật toán HS256 và khóa bí mật
                .compact();
    }

    /**
     * Lấy khóa bí mật để ký và xác thực JWT
      Key - khóa bí mật đã giải mã từ base64
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SERECT); // Giải mã khóa bí mật từ base64
        return Keys.hmacShaKeyFor(keyBytes); // Tạo khóa HMAC-SHA
    }




    /**
     * Trích xuất toàn bộ thông tin (claims) từ JWT
     * @param token - chuỗi JWT cần trích xuất
     * @return Claims - danh sách thông tin từ token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // Thiết lập khóa bí mật để giải mã JWT
                .build()
                .parseClaimsJws(token) // Phân tích JWT
                .getBody();
    }

    /**
     * Trích xuất thông tin cụ thể từ JWT
     * @param token - chuỗi JWT cần trích xuất
     * @param claimsTFunction - hàm trích xuất dữ liệu từ Claims
     * @return Giá trị của claim được yêu cầu
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    /**
     * Lấy thời gian hết hạn từ JWT
     * @param token - chuỗi JWT cần kiểm tra
     * @return Date - thời gian hết hạn của token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Lấy tên đăng nhập từ JWT
     * @param token - chuỗi JWT cần kiểm tra
     * @return String - tên đăng nhập từ token
     */
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Kiểm tra xem token đã hết hạn chưa
     * @param token - chuỗi JWT cần kiểm tra
     * @return boolean - true nếu token đã hết hạn, ngược lại false
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Xác thực tính hợp lệ của JWT
     token - chuỗi JWT cần kiểm tra
     userDetails - thông tin người dùng
    boolean - true nếu token hợp lệ, ngược lại false
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);

        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
