package com.edu.datn.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.entities.OrderEntity;
import com.edu.datn.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Xem danh sách đơn hàng
    @GetMapping
    public ResponseEntity<List<OrderEntity>> getAllOrders() {
        List<OrderEntity> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Xem chi tiết đơn hàng bao gồm các mặt hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderEntity> getOrderDetails(@PathVariable Integer orderId) {
        OrderEntity order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderEntity> updateOrderStatus(
            @PathVariable("orderId") Integer orderId,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");

        // Kiểm tra xem trạng thái có hợp lệ hay không
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi nếu trạng thái không hợp lệ
        }

        try {
            // Gọi phương thức từ service để cập nhật trạng thái
            OrderEntity updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder); // Trả về đơn hàng đã cập nhật
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi trạng thái không hợp lệ
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Trả về lỗi không tìm thấy đơn hàng
        }
    }

}
