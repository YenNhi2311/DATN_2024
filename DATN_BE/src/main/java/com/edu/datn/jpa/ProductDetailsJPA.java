package com.edu.datn.jpa;

import com.edu.datn.entities.ProductDetailsEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDetailsJPA
    extends JpaRepository<ProductDetailsEntity, Integer> {
      
  @Query("SELECT pd FROM ProductDetailsEntity pd JOIN pd.product p WHERE pd.product.productId = :productId")
  List<ProductDetailsEntity> findByProductId(
      @Param("productId") Integer productId);

  List<ProductDetailsEntity> findByProductDetailId(Integer productDetailId);

  List<ProductDetailsEntity> findByProductProductId(Integer productId);


}
