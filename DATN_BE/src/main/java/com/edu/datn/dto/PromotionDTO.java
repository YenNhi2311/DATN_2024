package com.edu.datn.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PromotionDTO {
  private Integer promotionId;
  private String name;
  private Integer percent;
  private LocalDateTime startDate;
  private LocalDateTime endDate;
}
