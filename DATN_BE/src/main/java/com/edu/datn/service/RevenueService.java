package com.edu.datn.service;

import com.edu.datn.dto.BestSellingProductDto;
import com.edu.datn.dto.RevenueByLocationDto;
import com.edu.datn.dto.RevenueDTO;
import com.edu.datn.entities.OrderEntity;
import com.edu.datn.jpa.OrderJPA;
import com.edu.datn.mappers.OrderMapper;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class RevenueService {
  @Autowired
  private OrderJPA orderRepository;

  @Autowired
  private OrderMapper orderMapper;

  public List<RevenueDTO> getRevenues(String periodType) {
    // Lấy tất cả các đơn hàng với trạng thái là "receive"
    List<OrderEntity> orders = orderRepository.findByStatus("RECEIVED");
    Map<String, Double> revenueMap = new HashMap<>();

    for (OrderEntity order : orders) {
      String period;
      switch (periodType.toLowerCase()) {
        case "day":
          period = order.getOrderDate().toLocalDate().toString(); // Lấy ngày
          break;
        case "month":
          period =
            order.getOrderDate().getMonth() +
            " " +
            order.getOrderDate().getYear(); // Lấy tháng
          break;
        case "year":
          period = String.valueOf(order.getOrderDate().getYear()); // Lấy năm
          break;
        default:
          throw new IllegalArgumentException(
            "Invalid period type: " + periodType
          );
      }
      revenueMap.put(
        period,
        revenueMap.getOrDefault(period, 0.0) + order.getTotal()
      );
    }

    List<RevenueDTO> revenues = new ArrayList<>();
    for (Map.Entry<String, Double> entry : revenueMap.entrySet()) {
      revenues.add(new RevenueDTO(entry.getKey(), entry.getValue()));
    }

    return revenues;
  }

  public List<BestSellingProductDto> getBestSellingProductsByMonth(
    int month,
    int year
  ) {
    Pageable pageable = PageRequest.of(0, 10); // Lấy 10 sản phẩm
    return orderRepository
      .findBestSellingProductsByMonth(month, year, pageable)
      .stream()
      .map(
        result ->
          new BestSellingProductDto(
            (String) result[0], // Tên sản phẩm
            ((Number) result[1]).intValue(), // Số lượng bán
            ((Number) result[2]).doubleValue() // Doanh thu
          )
      )
      .collect(Collectors.toList());
  }

  public List<RevenueByLocationDto> getTop5RevenueByLocation(int year) {
    Pageable pageable = PageRequest.of(0, 5); // Trang đầu tiên và 5 bản ghi
    return orderRepository.findRevenueByLocationAndYear(year, pageable);
  }

  public Integer getReceivedOrderCountByDate(LocalDate date) {
    return orderRepository.countReceivedOrdersByDate(date);
  }

  public Integer getReceivedOrderCountByMonth(int month, int year) {
    return orderRepository.countReceivedOrdersByMonth(month, year);
  }

  public Integer getReceivedOrderCountByYear(int year) {
    return orderRepository.countReceivedOrdersByYear(year);
  }

  public Integer getCanceledOrderCountByDate(LocalDate date) {
    return orderRepository.countCanceledOrdersByDate(date);
  }

  public Integer getCanceledOrderCountByMonth(int month, int year) {
    return orderRepository.countCanceledOrdersByMonth(month, year);
  }

  public Integer getCanceledOrderCountByYear(int year) {
    return orderRepository.countCanceledOrdersByYear(year);
  }

  public Integer getTotalProductsSold() {
    return orderRepository.countTotalProductsSold();
  }
}
