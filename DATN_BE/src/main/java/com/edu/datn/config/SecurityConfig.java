package com.edu.datn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.edu.datn.filter.JwtAuthenticationFilter;
import com.edu.datn.service.UserDetailsServiceImp;

@Configuration // Đánh dấu lớp này là một lớp cấu hình của Spring
@EnableWebSecurity // Kích hoạt bảo mật web với Spring Security
public class SecurityConfig {
  // Các dependency cần thiết cho bảo mật
  private final UserDetailsServiceImp userDetailsServiceImp; // Service để tải thông tin người dùng từ DB
  private final JwtAuthenticationFilter jwtAuthenticationFilter; // Bộ lọc để xác thực JWT
  private final CustomLogoutHandler logoutHandler;
  private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint; // Xử lý đăng xuất tùy chỉnh

  // Constructor khởi tạo các dependency
  public SecurityConfig(
      UserDetailsServiceImp userDetailsServiceImp,
      JwtAuthenticationFilter jwtAuthenticationFilter,
      CustomLogoutHandler logoutHandler,
      CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
    this.userDetailsServiceImp = userDetailsServiceImp;
    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.logoutHandler = logoutHandler;
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
  }

  // Bean cấu hình SecurityFilterChain để định nghĩa các quy tắc bảo mật
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
      throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(CorsConfigurer::and)
        .authorizeHttpRequests(
            req -> req
                // Các endpoint không yêu cầu xác thực
                .requestMatchers("/login/**", "/register/**", "/forgot-password/**", "/password-reset/**",
                    "/api/home/**", "/api/**", "/api/cart/**", "/api/addresses/**", "/assets/img/**", "/ws/**",
                    "/profile/**")
                .permitAll()
                // Các endpoint chỉ cho phép quyền ADMIN truy cập
                .requestMatchers("/admin/**")
                .hasAuthority("admin")
                // Yêu cầu xác thực cho tất cả các yêu cầu khác
                .anyRequest()
                .authenticated())
        .userDetailsService(userDetailsServiceImp) // Cấu hình service để tải thông tin người
        // dùng
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Cấu hình không sử dụng session,
                                                                                      // mỗi request đều độc lập
                                                                                      // (stateless)
        )
        // Thêm bộ lọc JWT trước bộ lọc xác thực UsernamePasswordAuthenticationFilter
        .addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class)
        // Cấu hình xử lý khi người dùng không có quyền truy cập (403) hoặc không xác
        // thực (401)
        .exceptionHandling(
            e -> e
                .accessDeniedHandler(
                    (request, response, accessDeniedException) -> response.setStatus(403))
                .authenticationEntryPoint(customAuthenticationEntryPoint))
        // Cấu hình đăng xuất
        .logout(
            l -> l
                .logoutUrl("/logout") // Định nghĩa URL đăng xuất
                .addLogoutHandler(logoutHandler) // Thêm xử lý đăng xuất tùy chỉnh
                .logoutSuccessHandler(
                    (request, response, authentication) -> SecurityContextHolder.clearContext())) // Xóa thông tin người
        // dùng sau khi đăng
        // xuất
        .build(); // Xây dựng và trả về cấu hình SecurityFilterChain
  }

  // Bean để mã hóa mật khẩu người dùng
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(); // Sử dụng BCrypt để mã hóa mật khẩu
  }

  // Bean để quản lý xác thực
  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration configuration)
      throws Exception {
    return configuration.getAuthenticationManager(); // Trả về AuthenticationManager từ cấu hình
  }

  // Cấu hình CORS
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:3000"); // Địa chỉ front-end
    configuration.addAllowedMethod("*"); // Cho phép tất cả các phương thức (GET, POST, PUT, DELETE...)
    configuration.addAllowedHeader("*"); // Cho phép tất cả các headers
    configuration.setAllowCredentials(true); // Để gửi cookie hoặc token từ trình duyệt
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Cấu hình CORS cho tất cả các đường dẫn
    return source;
  }
}
