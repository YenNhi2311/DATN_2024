package com.edu.datn.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.OTPDetails;
import com.edu.datn.dto.RepuestOPTDto; // Corrected typo here
import com.edu.datn.dto.ResetPasswordDto;
import com.edu.datn.dto.VerifyOTPDto;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.AuthenticationService;
import com.edu.datn.service.JwtService;
import com.edu.datn.service.OTPService;
import com.edu.datn.service.UserService;

@RestController
@RequestMapping("/password-reset")
public class PasswordResetController {
    private final UserService userService;
    private final OTPService otpService;
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    // Use ConcurrentHashMap for thread-safe operations
    private final Map<String, OTPDetails> otpStore = new ConcurrentHashMap<>();

    // Lấy thời gian hết hạn OTP từ application.properties
    @Value("${otp.expiration.time}")
    private long OTP_EXPIRATION_TIME;

    public PasswordResetController(UserService userService, OTPService otpService,
            AuthenticationService authenticationService, JwtService jwtService) {
        this.userService = userService;
        this.otpService = otpService;
        this.authenticationService = authenticationService;
        this.jwtService = jwtService; // Using it as part of your service logic
    }

    // Yêu cầu OTP
    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOTP(@RequestBody RepuestOPTDto requestOTPDto) {
        String username = requestOTPDto.getUsername();

        UserEntity user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("Tên đăng nhập không hợp lệ.");
        }

        String otp = otpService.generateOTP();

        // Log OTP để kiểm tra
        System.out.println("Generated OTP for user: " + username + " is: " + otp);

        try {
            otpService.sendOTPEmail(user.getEmail(), otp);
            otpStore.put(username, new OTPDetails(otp, LocalDateTime.now()));

            return ResponseEntity.ok("Mã OTP đã được gửi tới email.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Có lỗi xảy ra khi gửi mã OTP, vui lòng thử lại sau.");
        }
    }

    // Xác thực OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody VerifyOTPDto verifyOTPDto) {
        String username = verifyOTPDto.getUsername();
        String userOtp = verifyOTPDto.getOtp();

        // Log để kiểm tra xem username và OTP từ request có đúng không
        System.out.println("Verifying OTP for user: " + username + " with OTP: " + userOtp);

        OTPDetails otpDetails = otpStore.get(username);
        if (otpDetails == null) {
            return ResponseEntity.badRequest().body("Mã OTP không được tìm thấy.");
        }

        // Log để kiểm tra mã OTP đã lưu
        System.out.println("Stored OTP for user: " + username + " is: " + otpDetails.getOtp());

        if (otpDetails.isExpired(OTP_EXPIRATION_TIME)) {
            otpStore.remove(username);
            return ResponseEntity.badRequest().body("Mã OTP đã hết hạn.");
        }

        if (!otpDetails.getOtp().equals(userOtp)) {
            return ResponseEntity.badRequest().body("Mã OTP không hợp lệ.");
        }

        otpStore.remove(username);
        return ResponseEntity.ok("OTP hợp lệ. Bạn có thể đổi mật khẩu.");
    }

    // API để người dùng đặt lại mật khẩu mới
    @PostMapping("/change-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        String username = resetPasswordDto.getUsername();
        String newPassword = resetPasswordDto.getNewPassword();
        String confirmPassword = resetPasswordDto.getConfirmPassword();

        // Kiểm tra mật khẩu xác nhận có khớp không
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không khớp.");
        }

        // Kiểm tra độ mạnh của mật khẩu
        if (!isPasswordStrong(newPassword)) {
            return ResponseEntity.badRequest()
                    .body("Mật khẩu phải ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt.");
        }

        // Tìm user theo username
        UserEntity user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("Tên đăng nhập không hợp lệ.");
        }

        try {

            user.setPassword(newPassword);
            userService.updateUser(user);

            // Xóa tất cả các token cũ của người dùng (nếu có)
            authenticationService.revokeAllTokenByUser(user);

            // Tạo token mới cho người dùng
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            authenticationService.saveUserToken(accessToken, refreshToken, user);

            // Tạo phản hồi bao gồm thông tin người dùng và token mới (không bao gồm mật
            // khẩu)
            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("user_id", user.getUserId());
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);

            // Trả về thông tin người dùng và token mới
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Xử lý lỗi khi cập nhật mật khẩu
            return ResponseEntity.status(500).body("Đã xảy ra lỗi khi đặt lại mật khẩu: " + e.getMessage());
        }
    }

    // Hàm kiểm tra độ mạnh của mật khẩu
    private boolean isPasswordStrong(String password) {
        String passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
        return password.matches(passwordPattern);
    }

}
