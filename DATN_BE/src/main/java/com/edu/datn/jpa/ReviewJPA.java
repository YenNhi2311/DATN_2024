package com.edu.datn.jpa;

import com.edu.datn.entities.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewJPA extends JpaRepository<ReviewEntity, Integer> {
}
