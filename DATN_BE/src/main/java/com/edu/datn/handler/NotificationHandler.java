package com.edu.datn.handler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
public class NotificationHandler extends TextWebSocketHandler {
  //Danh sách các session kết nối
  private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session)
    throws Exception {
    sessions.add(session); // Thêm session mới khi client kết nối
  }

  @Override
  public void afterConnectionClosed(
    WebSocketSession session,
    CloseStatus status
  )
    throws Exception {
    sessions.remove(session); // Xóa session khi kết nối đóng
  }

  // Hàm gửi thông báo
  public void sendNotification(String message) {
    for (WebSocketSession session : sessions) {
      try {
        session.sendMessage(new TextMessage(message)); // Gửi tin nhắn đến tất cả các session đang kết nối
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}
