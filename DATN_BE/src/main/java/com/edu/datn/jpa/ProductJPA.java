package com.edu.datn.jpa;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edu.datn.dto.ProductDTO;
import com.edu.datn.entities.ProductEntity;

@Repository
public interface ProductJPA extends JpaRepository<ProductEntity, Integer> {

    @Query("SELECT p, pd, COUNT(od) AS totalSold " +
            "FROM OrderDetailsEntity od " +
            "JOIN od.productDetail pd " +
            "JOIN pd.product p " +
            "GROUP BY p.id, pd.id " +
            "ORDER BY totalSold DESC")
    List<Object[]> findTop8BestSellingProducts(Pageable pageable);

    List<ProductDTO> findByNameContainingIgnoreCase(String name);
}
