package com.edu.datn.controller;

import com.edu.datn.dto.BestSellingProductDto;
import com.edu.datn.dto.RevenueByLocationDto;
import com.edu.datn.dto.RevenueDTO;
import com.edu.datn.service.RevenueService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revenues")
public class RevenueController {
  @Autowired
  private RevenueService statisticsService;

  @GetMapping("/{periodType}")
  public List<RevenueDTO> getRevenues(@PathVariable String periodType) {
    return statisticsService.getRevenues(periodType);
  }

  @GetMapping("/bestselling-products")
  public ResponseEntity<List<BestSellingProductDto>> getBestSellingProducts(
    @RequestParam int month,
    @RequestParam int year
  ) {
    List<BestSellingProductDto> bestSellingProducts = statisticsService.getBestSellingProductsByMonth(
      month,
      year
    );
    return ResponseEntity.ok(bestSellingProducts);
  }

  @GetMapping("/revenue-by-location")
  public List<RevenueByLocationDto> getRevenueByLocation(
    @RequestParam int year
  ) {
    return statisticsService.getTop5RevenueByLocation(year);
  }

  @GetMapping("/received-count-today")
  public ResponseEntity<Integer> getReceivedOrderCountToday() {
    Integer count = statisticsService.getReceivedOrderCountByDate(
      LocalDate.now()
    );
    return ResponseEntity.ok(count);
  }

  @GetMapping("/received-count-by-month")
  public ResponseEntity<Integer> getReceivedOrderCountByMonth(
    @RequestParam int month,
    @RequestParam int year
  ) {
    Integer count = statisticsService.getReceivedOrderCountByMonth(month, year);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/received-count-by-year")
  public ResponseEntity<Integer> getReceivedOrderCountByYear(
    @RequestParam int year
  ) {
    Integer count = statisticsService.getReceivedOrderCountByYear(year);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/canceled-count-today")
  public ResponseEntity<Integer> getCanceledOrderCountToday() {
    Integer count = statisticsService.getCanceledOrderCountByDate(
      LocalDate.now()
    );
    return ResponseEntity.ok(count);
  }

  @GetMapping("/canceled-count-by-month")
  public ResponseEntity<Integer> getCanceledOrderCountByMonth(
    @RequestParam int month,
    @RequestParam int year
  ) {
    Integer count = statisticsService.getCanceledOrderCountByMonth(month, year);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/canceled-count-by-year")
  public ResponseEntity<Integer> getCanceledOrderCountByYear(
    @RequestParam int year
  ) {
    Integer count = statisticsService.getCanceledOrderCountByYear(year);
    return ResponseEntity.ok(count);
  }

  @GetMapping("/total-products-sold")
  public Integer getTotalProductsSold() {
    return statisticsService.getTotalProductsSold();
  }
}
