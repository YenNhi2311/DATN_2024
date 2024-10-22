package com.edu.datn.model;

import java.util.Date;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "messages") // Đánh dấu đây là một document trong MongoDB, thuộc collection "messages"
public class Message {
  @Id // Đánh dấu đây là ID của document
  private String id;

  @Field("sender") // Tùy chọn, dùng nếu bạn muốn ánh xạ tên trường khác trong MongoDB
  private String sender;

  @Field("receiver")
  private String receiver;

  @Field("content")
  private String content;

  @Field("timestamp")
  private Date timestamp;

  @Field("isRead") // Trường này sẽ được lưu trong MongoDB với tên "isRead"
  private boolean isRead;
}
