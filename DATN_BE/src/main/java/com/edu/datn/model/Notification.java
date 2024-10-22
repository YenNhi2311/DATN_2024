package com.edu.datn.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @Id
    private String id;

    private Integer postId;
    private Integer receiverId;
    private String message;
    private String type;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    // Constructor, getters and setters
}
