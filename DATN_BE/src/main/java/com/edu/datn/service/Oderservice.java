package com.edu.datn.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.OrderDTO;
import com.edu.datn.dto.OrderDetailDTO;
import com.edu.datn.entities.OrderDetailsEntity;
import com.edu.datn.entities.OrderEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.jpa.OrderDetailJPA;
import com.edu.datn.jpa.OrderJPA;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.jpa.UserJPA;

import jakarta.transaction.Transactional;

@Service
public class Oderservice {
    @Autowired
    private OrderJPA orderRepository;

    @Autowired
    private OrderDetailJPA orderDetailsRepository;

    @Autowired
    private UserJPA userRepository;

    @Autowired
    private ProductDetailsJPA productDetailsRepository;

    @Transactional
    public OrderEntity createOrder(OrderDTO orderDTO, Integer userId) {
        // Tạo và lưu OrderEntity
        OrderEntity order = new OrderEntity();
        // Thiết lập các thuộc tính của OrderEntity từ orderDTO
        order.setTotal(orderDTO.getTotal());
        order.setShippingFee(orderDTO.getShippingFee());
        order.setSpecificAddress(orderDTO.getSpecificAddress());
        order.setWardCommune(orderDTO.getWardCommune());
        order.setDistrict(orderDTO.getDistrict());
        order.setProvince(orderDTO.getProvince());
        order.setStatus(orderDTO.getStatus());
        // Lưu order vào cơ sở dữ liệu
        OrderEntity savedOrder = orderRepository.save(order);

        // Duyệt qua danh sách orderDetails và lưu OrderDetailsEntity
        for (OrderDetailDTO detailDTO : orderDTO.getOrderDetails()) {
            OrderDetailsEntity orderDetail = new OrderDetailsEntity();
            orderDetail.setOrder(savedOrder); // Liên kết với đơn hàng
            orderDetail.setPrice(detailDTO.getPrice());
            orderDetail.setQuantity(detailDTO.getQuantity());

            // Lấy ProductDetailsEntity từ productDetailId
            ProductDetailsEntity productDetail = productDetailsRepository.findById(detailDTO.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Product Detail not found"));

            orderDetail.setProductDetail(productDetail);

            // Lưu OrderDetailsEntity vào cơ sở dữ liệu
            orderDetailsRepository.save(orderDetail);
        }

        return savedOrder;
    }
}
