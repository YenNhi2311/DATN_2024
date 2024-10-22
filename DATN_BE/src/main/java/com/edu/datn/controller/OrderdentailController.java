package com.edu.datn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.OrderDTO;
import com.edu.datn.entities.OrderEntity;
import com.edu.datn.service.Oderservice;

@RestController
@RequestMapping("/api/order")
public class OrderdentailController {
    @Autowired
    private Oderservice orderservice;

    @PostMapping("/create/{userId}")
    public ResponseEntity<OrderEntity> createOrder(@RequestBody OrderDTO orderDTO,
            @PathVariable("userId") Integer userId) {
        // Gọi service để tạo đơn hàng
        OrderEntity order = orderservice.createOrder(orderDTO, userId);
        return ResponseEntity.ok(order);
    }

}
