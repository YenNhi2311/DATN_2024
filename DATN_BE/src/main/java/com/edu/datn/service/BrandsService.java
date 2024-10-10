package com.edu.datn.service;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.dto.ProductDTO;
import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.dto.ProductPromotionDTO;
import com.edu.datn.entities.BrandsEntity;
import com.edu.datn.jpa.BrandJPA;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BrandsService {
  @Autowired
  private BrandJPA brandRepository;

  public List<BrandsDTO> getAllBrands() {
    return brandRepository
      .findAll()
      .stream()
      .map(this::toDTO)
      .collect(Collectors.toList());
  }

  public BrandsDTO getBrandById(Integer id) {
    return toDTO(
      brandRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Brand not found"))
    );
  }

  public BrandsDTO createBrand(BrandsDTO brandDto) throws IOException {
    BrandsEntity entity = toEntity(brandDto);
    BrandsEntity savedEntity = brandRepository.save(entity);
    return toDTO(savedEntity);
  }

  public BrandsDTO updateBrand(Integer id, BrandsDTO brandDto)
    throws IOException {
    BrandsEntity entity = brandRepository
      .findById(id)
      .orElseThrow(() -> new RuntimeException("Brand not found"));
    entity.setName(brandDto.getName());
    entity.setPlace(brandDto.getPlace());
    // Set các thuộc tính khác nếu cần
    BrandsEntity updatedEntity = brandRepository.save(entity);
    return toDTO(updatedEntity);
  }

  public void deleteBrand(Integer id) {
    brandRepository.deleteById(id);
  }

  private BrandsDTO toDTO(BrandsEntity entity) {
    return new BrandsDTO(
      entity.getBrandId(),
      entity.getName(),
      entity.getPlace(),
      entity.getImg()
    );
  }

  private BrandsEntity toEntity(BrandsDTO brandDto) {
    BrandsEntity entity = new BrandsEntity();
    entity.setBrandId(brandDto.getBrandId());
    entity.setName(brandDto.getName());
    entity.setPlace(brandDto.getPlace());
    entity.setImg(brandDto.getImg());
    // Set các thuộc tính khác nếu cần
    return entity;
  }
}
