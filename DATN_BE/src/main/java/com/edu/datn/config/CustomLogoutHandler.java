package com.edu.datn.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import com.edu.datn.entities.TokenEntity;
import com.edu.datn.jpa.TokenJPA;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenJPA tokenRepository;

    // Constructor nhận vào `TokenJPA` để tương tác với cơ sở dữ liệu lưu trữ token
    public CustomLogoutHandler(TokenJPA tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Phương thức `logout` được gọi khi người dùng thực hiện thao tác đăng xuất
    @Override
    public void logout(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {
        // Lấy header `Authorization` từ yêu cầu HTTP
        String authHeader = request.getHeader("Authorization");

        // Kiểm tra nếu header không tồn tại hoặc không bắt đầu bằng "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return; // Nếu điều kiện không thỏa mãn, kết thúc phương thức
        }

        // Cắt bỏ phần "Bearer " để lấy token
        String token = authHeader.substring(7);

        // Tìm kiếm token trong cơ sở dữ liệu bằng giá trị của access token
        TokenEntity storedToken = tokenRepository.findByAccessToken(token).orElse(null);

        // Nếu token tồn tại trong cơ sở dữ liệu
        if (storedToken != null) {
            // Đánh dấu token này đã đăng xuất bằng cách đặt giá trị `loggedOut` thành
            // `true`
            storedToken.setLoggedOut(true);
            // Lưu lại token đã được cập nhật vào cơ sở dữ liệu
            tokenRepository.save(storedToken);
        }
    }
}
