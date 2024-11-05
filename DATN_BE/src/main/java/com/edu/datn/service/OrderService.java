package com.edu.datn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.OrderEntity;
import com.edu.datn.jpa.OrderJPA;

@Service
public class OrderService {

    @Autowired
    private OrderJPA orderRepository;

    private static final List<String> VALID_STATUSES = List.of("Chờ xác nhận", "Đã xác nhận", "Chờ vận chuyển", "Đã giao");

    // Lấy danh sách tất cả đơn hàng
    public List<OrderEntity> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy chi tiết đơn hàng
    public OrderEntity getOrderById(Integer orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    // Cập nhật trạng thái đơn hàng
    public OrderEntity updateOrderStatus(Integer orderId, String status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ");
        }
    
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    
        order.setStatus(status); // Cập nhật trạng thái
        return orderRepository.save(order); // Lưu lại thay đổi
    }
}

