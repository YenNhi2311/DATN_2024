package com.edu.datn.config;

import com.edu.datn.handler.NotificationHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry
      .addHandler(getNotificationHandler(), "/notifications")
      .setAllowedOrigins("*");
  }

  @Bean
  WebSocketHandler getNotificationHandler() {
    return new NotificationHandler();
  }
}
