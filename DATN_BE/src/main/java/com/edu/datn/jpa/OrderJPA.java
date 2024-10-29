package com.edu.datn.jpa;

import com.edu.datn.dto.RevenueByLocationDto;
import com.edu.datn.entities.OrderEntity;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderJPA extends JpaRepository<OrderEntity, Integer> {
  List<OrderEntity> findByStatus(String status);

  @Query(
    "SELECT od.productDetail.product.name AS productName, SUM(od.quantity) AS quantitySold, SUM(od.price * od.quantity) AS revenue " +
    "FROM OrderDetailsEntity od JOIN od.order o " +
    "WHERE MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year AND o.status = 'RECEIVED' " +
    "GROUP BY od.productDetail.product.name " +
    "ORDER BY SUM(od.quantity) DESC"
  )
  List<Object[]> findBestSellingProductsByMonth(
    @Param("month") int month,
    @Param("year") int year,
    Pageable pageable
  );

  @Query(
    "SELECT new com.edu.datn.dto.RevenueByLocationDto(o.province, SUM(o.total)) " +
    "FROM OrderEntity o " +
    "WHERE YEAR(o.orderDate) = :year " +
    "AND o.status = 'RECEIVED' " +
    "GROUP BY o.province"
  )
  List<RevenueByLocationDto> findRevenueByLocationAndYear(
    @Param("year") int year,
    Pageable pageable
  );

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'RECEIVED' AND DATE(o.orderDate) = :date"
  )
  Integer countReceivedOrdersByDate(@Param("date") LocalDate date);

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'RECEIVED' AND MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year"
  )
  Integer countReceivedOrdersByMonth(
    @Param("month") int month,
    @Param("year") int year
  );

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'RECEIVED' AND YEAR(o.orderDate) = :year"
  )
  Integer countReceivedOrdersByYear(@Param("year") int year);

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'CANCELED' AND DATE(o.orderDate) = :date"
  )
  Integer countCanceledOrdersByDate(@Param("date") LocalDate date);

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'CANCELED' AND MONTH(o.orderDate) = :month AND YEAR(o.orderDate) = :year"
  )
  Integer countCanceledOrdersByMonth(
    @Param("month") int month,
    @Param("year") int year
  );

  @Query(
    "SELECT COUNT(o) FROM OrderEntity o WHERE o.status = 'CANCELED' AND YEAR(o.orderDate) = :year"
  )
  Integer countCanceledOrdersByYear(@Param("year") int year);

  @Query(
    "SELECT SUM(od.quantity) FROM OrderDetailsEntity od JOIN od.order o WHERE o.status = 'RECEIVED'"
  )
  Integer countTotalProductsSold();
}
