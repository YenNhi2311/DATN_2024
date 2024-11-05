package com.edu.datn.mappers;

import com.edu.datn.dto.RevenueDTO;
import com.edu.datn.entities.OrderEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
  @Autowired
  private ModelMapper modelMapper;

  public RevenueDTO orderToRevenueDTO(OrderEntity orderEntity) {
    return modelMapper.map(orderEntity, RevenueDTO.class);
  }

  public OrderEntity revenueDTOToOrder(RevenueDTO revenueDTO) {
    return modelMapper.map(revenueDTO, OrderEntity.class);
  }
}
