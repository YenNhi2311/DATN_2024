package com.edu.datn.entities;

import java.time.LocalDateTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Integer commentId;

    @Column(name = "content", nullable = false, length = 255)
    private String content;

    // @CreationTimestamp
    // @Column(name = "createAt", nullable = false, updatable = false)
    // @Temporal(TemporalType.TIMESTAMP)

    @Column(name = "createAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createAt;

    // @UpdateTimestamp
    // @Column(name = "updateAt", nullable = false)
    // @Temporal(TemporalType.TIMESTAMP)
    
     @Column(name = "updateAt")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateAt;
    // @CreationTimestamp và @UpdateTimestamp: Sử dụng để tự động cập nhật các
    // trường thời gian khi tạo và cập nhật bản ghi.
    // @Temporal(TemporalType.TIMESTAMP): Chỉ định kiểu dữ liệu thời gian cho các
    // trường createAt và updateAt.

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
