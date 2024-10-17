package com.edu.datn.dto;

import java.time.LocalDateTime;

public class OTPDetails {
    private String otp;
    private LocalDateTime createdAt;

    public OTPDetails(String otp, LocalDateTime createdAt) {
        this.otp = otp;
        this.createdAt = createdAt;
    }

    public String getOtp() {
        return otp;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isExpired(long expirationTimeInMinutes) {
        return LocalDateTime.now().isAfter(createdAt.plusMinutes(expirationTimeInMinutes));
    }
}
