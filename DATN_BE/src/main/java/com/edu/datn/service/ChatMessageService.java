package com.edu.datn.service;

import com.edu.datn.model.Message;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {
  @Autowired
  private MongoTemplate mongoTemplate;

  // Lưu tin nhắn vào MongoDB
  public void saveMessage(Message message) {
    mongoTemplate.save(message, "messages");
  }

  // Lấy tất cả tin nhắn giữa hai người dùng
  public List<Message> getMessagesBetweenUsers(String sender, String receiver) {
    Query query = new Query();
    query.addCriteria(
      Criteria
        .where("sender")
        .is(sender)
        .and("receiver")
        .is(receiver)
        .orOperator(
          Criteria.where("sender").is(receiver).and("receiver").is(sender)
        )
    );
    return mongoTemplate.find(query, Message.class, "messages");
  }

  // Đánh dấu tin nhắn là đã đọc
  public void markMessageAsRead(String messageId) {
    Query query = new Query();
    query.addCriteria(Criteria.where("_id").is(new ObjectId(messageId)));
    Update update = new Update();
    update.set("isRead", true);
    mongoTemplate.updateFirst(query, update, "messages");
  }
}
