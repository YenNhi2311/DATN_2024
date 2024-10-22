package com.edu.datn.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OTPService {
    private final Random random = new Random();
    private final int OTP_LENGTH = 6;
    private final EmailService emailService;

    @Autowired
    public OTPService(EmailService emailService) {
        this.emailService = emailService;
    }

    // Tạo mã OTP ngẫu nhiên
    public String generateOTP() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10)); // Thêm số ngẫu nhiên (0-9)
        }
        return otp.toString();
    }

    // Gửi mã OTP qua email
    public void sendOTPEmail(String email, String otp) {
        String subject = "Mã OTP của bạn";

        // Thiết kế nội dung email với HTML
        String body = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        .container { font-family: Arial, sans-serif; padding: 20px; }" +
                "        .otp { font-size: 24px; font-weight: bold; color: #1e90ff; }" +
                "        .support { font-size: 12px; color: #777; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class='container'>" +
                "        <h3>Xin chào,</h3>" +
                "        <p>Bạn đã yêu cầu mã OTP để xác nhận tài khoản của mình. Đây là mã OTP của bạn:</p>" +
                "        <p class='otp'>" + otp + "</p>" +
                "        <p>Mã OTP này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>" +
                "        <p>Nếu bạn không yêu cầu mã OTP này, hãy liên hệ với chúng tôi ngay lập tức.</p>" +
                "        <br><hr>" +
                "        <p class='support'>Email được gửi từ hệ thống hỗ trợ. Vui lòng không trả lời email này.</p>" +
                "    </div>" +
                "</body>" +
                "</html>";

        // Gửi email với nội dung HTML
        emailService.sendEmail(email, subject, body);
    }
}
