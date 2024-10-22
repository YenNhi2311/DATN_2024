package com.edu.datn.controller;

import com.edu.datn.model.Message;
import com.edu.datn.service.ChatMessageService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
  @Autowired
  private ChatMessageService chatMessageService;

  // API để gửi tin nhắn
  @PostMapping("/send")
  public ResponseEntity<?> sendMessage(@RequestBody Message message) {
    chatMessageService.saveMessage(message);
    return ResponseEntity.ok("Message sent successfully");
  }

  // API để lấy tin nhắn giữa hai người dùng
  @GetMapping("/conversation")
  public ResponseEntity<List<Message>> getMessages(
    @RequestParam String sender,
    @RequestParam String receiver
  ) {
    List<Message> messages = chatMessageService.getMessagesBetweenUsers(
      sender,
      receiver
    );
    return ResponseEntity.ok(messages);
  }

  // API để đánh dấu tin nhắn là đã đọc
  @PutMapping("/read/{messageId}")
  public ResponseEntity<?> markAsRead(@PathVariable String messageId) {
    chatMessageService.markMessageAsRead(messageId);
    return ResponseEntity.ok("Message marked as read");
  }
}
