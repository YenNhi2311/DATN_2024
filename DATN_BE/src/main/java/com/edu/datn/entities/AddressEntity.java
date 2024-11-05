package com.edu.datn.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Integer addressId;

    @Column(name = "specific_address", nullable = false, length = 100)
    private String specificAddress;

    @Column(name = "ward", nullable = false, length = 100) //id phường
    private Long wardCommune;

    @Column(name = "ward_name", nullable = false, length = 100)
    private String wardName;

    @Column(name = "district", nullable = false, length = 100) //id quận
    private Long district;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;

    @Column(name = "province", nullable = false, length = 100) //id tỉnh
    private Long province;

    @Column(name = "province_name", nullable = false, length = 100)
    private String provinceName;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", nullable = false, length = 10)
    private String phone;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

}
