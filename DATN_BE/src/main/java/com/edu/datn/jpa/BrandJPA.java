package com.edu.datn.jpa;

import com.edu.datn.entities.BrandsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandJPA extends JpaRepository<BrandsEntity, Integer> {
    // Additional query methods if needed
}
