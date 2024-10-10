package com.edu.datn.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edu.datn.entities.OrderDetailsEntity;

public interface OrderDetailJPA extends JpaRepository<OrderDetailsEntity, Integer> {

}
