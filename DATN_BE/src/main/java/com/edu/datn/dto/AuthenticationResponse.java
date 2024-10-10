package com.edu.datn.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationResponse {
  @JsonProperty("access_token")
  private String accessToken;

  @JsonProperty("refresh_token")
  private String refreshToken;

  @JsonProperty("role")
  private String role;

  @JsonProperty("message")
  private String message;

  @JsonProperty("user_id")
  private Integer userId;

  public AuthenticationResponse(
    String accessToken,
    String refreshToken,
    String role,
    String message,
    Integer userId
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.role = role;
    this.message = message;
    this.userId = userId;
  }

  public AuthenticationResponse() {}

  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
