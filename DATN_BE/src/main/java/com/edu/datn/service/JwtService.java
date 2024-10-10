package com.edu.datn.service;

import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.TokenJPA;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // Khóa bí mật được sử dụng để ký JWT, lấy từ cấu hình ứng dụng
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    // Thời gian hết hạn của Access Token, lấy từ cấu hình ứng dụng
    @Value("${application.security.jwt.access-token-expiration}")
    private long accessTokenExpire;

    // Thời gian hết hạn của Refresh Token, lấy từ cấu hình ứng dụng
    @Value("${application.security.jwt.refresh-token-expiration}")
    private long refreshTokenExpire;

    // Repository để tương tác với cơ sở dữ liệu liên quan đến token
    private final TokenJPA tokenRepository;

    // Constructor để tiêm TokenJPA vào JwtService
    public JwtService(TokenJPA tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    /**
     * Trích xuất tên người dùng (username) từ token JWT.
     *
     * @param token JWT token
     * @return Tên người dùng
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Kiểm tra xem Access Token có hợp lệ hay không.
     *
     * @param token JWT token
     * @param user  Thông tin người dùng
     * @return true nếu token hợp lệ, ngược lại false
     */
    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);

        // Kiểm tra token có tồn tại trong cơ sở dữ liệu và chưa bị đăng xuất
        boolean validToken = tokenRepository
                .findByAccessToken(token)
                .map(t -> !t.isLoggedOut())
                .orElse(false);

        // Kiểm tra username, token chưa hết hạn và token hợp lệ
        return username.equals(user.getUsername()) && !isTokenExpired(token) && validToken;
    }

    /**
     * Kiểm tra xem Refresh Token có hợp lệ hay không.
     *
     * @param token JWT Refresh Token
     * @param user  Thông tin người dùng
     * @return true nếu Refresh Token hợp lệ, ngược lại false
     */
    public boolean isValidRefreshToken(String token, UserEntity user) {
        String username = extractUsername(token);

        // Kiểm tra Refresh Token có tồn tại trong cơ sở dữ liệu và chưa bị đăng xuất
        boolean validRefreshToken = tokenRepository
                .findByRefreshToken(token)
                .map(t -> !t.isLoggedOut())
                .orElse(false);

        // Kiểm tra username, Refresh Token chưa hết hạn và hợp lệ
        return username.equals(user.getUsername()) && !isTokenExpired(token) && validRefreshToken;
    }

    /**
     * Kiểm tra xem token đã hết hạn chưa.
     *
     * @param token JWT token
     * @return true nếu đã hết hạn, ngược lại false
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Trích xuất thời gian hết hạn từ token JWT.
     *
     * @param token JWT token
     * @return Ngày hết hạn
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Trích xuất một claim cụ thể từ token JWT.
     *
     * @param token    JWT token
     * @param resolver Hàm xử lý claim
     * @param <T>      Kiểu dữ liệu của claim
     * @return Giá trị của claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /**
     * Trích xuất tất cả các claims từ token JWT.
     *
     * @param token JWT token
     * @return Đối tượng Claims chứa tất cả các thông tin trong token
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigninKey()) // Đặt khóa bí mật để xác thực token
                    .build()
                    .parseClaimsJws(token) // Phân tích token
                    .getBody(); // Lấy phần body chứa các claims
        } catch (SignatureException e) {
            // Xử lý ngoại lệ khi chữ ký không hợp lệ
            throw new IllegalArgumentException("Chữ ký JWT không hợp lệ");
        } catch (Exception e) {
            // Xử lý các ngoại lệ khác liên quan đến token không hợp lệ
            throw new IllegalArgumentException("JWT token không hợp lệ");
        }
    }

    /**
     * Tạo một Access Token mới cho người dùng.
     *
     * @param user Thông tin người dùng
     * @return JWT Access Token
     */
    public String generateAccessToken(UserEntity user) {
        return generateToken(user, accessTokenExpire);
    }

    /**
     * Tạo một Refresh Token mới cho người dùng.
     *
     * @param user Thông tin người dùng
     * @return JWT Refresh Token
     */
    public String generateRefreshToken(UserEntity user) {
        return generateToken(user, refreshTokenExpire);
    }

    /**
     * Tạo một token JWT với thời gian hết hạn được chỉ định.
     *
     * @param user       Thông tin người dùng
     * @param expireTime Thời gian hết hạn của token
     * @return JWT token
     */
    private String generateToken(UserEntity user, long expireTime) {
        return Jwts.builder()
                .setSubject(user.getUsername()) // Đặt chủ thể của token là username của người dùng
                .setIssuedAt(new Date()) // Đặt thời gian phát hành token
                .setExpiration(new Date(System.currentTimeMillis() + expireTime)) // Đặt thời gian hết hạn
                .signWith(getSigninKey())// Ký token bằng khóa bí mật
                .setHeaderParam("typ", "JWT")
                .compact(); // Xây dựng và nén token thành chuỗi
    }

    /**
     * Lấy đối tượng SecretKey từ khóa bí mật đã mã hóa Base64.
     *
     * @return Đối tượng SecretKey
     */
    private SecretKey getSigninKey() {
        byte[] keyBytes = java.util.Base64.getDecoder().decode(secretKey); // Giải mã khóa bí mật từ Base64
        return Keys.hmacShaKeyFor(keyBytes); // Tạo đối tượng SecretKey từ mảng byte
    }
}
