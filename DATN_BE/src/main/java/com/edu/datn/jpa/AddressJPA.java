package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.AddressEntity;

@Repository
public interface AddressJPA extends JpaRepository<AddressEntity, Integer> {
    List<AddressEntity> findByUser_UserId(Integer userId);
}
