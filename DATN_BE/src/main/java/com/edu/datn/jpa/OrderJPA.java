package com.edu.datn.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.OrderEntity;

@Repository
public interface OrderJPA extends JpaRepository<OrderEntity, Integer> {
    // Bạn có thể thêm các phương thức tùy chỉnh nếu cần
}
