// package com.edu.datn.dto;

// import com.fasterxml.jackson.annotation.JsonFormat;
// import java.time.LocalDateTime;
// import java.util.Set;
// import lombok.AllArgsConstructor;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.Setter;

// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// public class OrderDTO {
//   private Integer orderId;

//   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//   private LocalDateTime orderDate;

//   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
//   private LocalDateTime payDate;

//   private Byte status;
//   private Double shippingFee;
//   private String specificAddress;
//   private String wardCommune;
//   private String district;
//   private String province;
//   private Double total;
//   private Integer userId;
//   private Set<OrderDetailsDTO> orderDetails;
// }
