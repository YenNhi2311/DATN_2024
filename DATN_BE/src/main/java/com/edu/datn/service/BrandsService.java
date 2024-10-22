package com.edu.datn.service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.BrandsDTO;
import com.edu.datn.entities.BrandsEntity;
import com.edu.datn.jpa.BrandJPA;
import com.edu.datn.utils.ImageUtils;

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
            .orElseThrow(() -> new RuntimeException("Brand not found")));
  }

  public BrandsDTO createBrand(BrandsDTO brandDto, MultipartFile img)
      throws IOException {
    if (img != null && !img.isEmpty()) {
      String imagePath = ImageUtils.saveImage(img);
      brandDto.setImg(imagePath);
    }
    BrandsEntity entity = toEntity(brandDto);
    BrandsEntity savedEntity = brandRepository.save(entity);
    return toDTO(savedEntity);
  }

  public BrandsDTO updateBrand(Integer id, BrandsDTO brandDto, MultipartFile image)
      throws IOException {
    BrandsEntity entity = brandRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Brand not found"));

    entity.setName(brandDto.getName());
    entity.setPlace(brandDto.getPlace());

    if (image != null && !image.isEmpty()) {
      // Delete the old image if it exists
      if (entity.getImg() != null) {
        ImageUtils.deleteImage(entity.getImg());
      }
      // Save the new image
      String newImagePath = ImageUtils.saveImage(image);
      entity.setImg(newImagePath);
    }

    BrandsEntity updatedEntity = brandRepository.save(entity);
    return toDTO(updatedEntity);
  }

  public void deleteBrand(Integer id) {
    BrandsEntity entity = brandRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Brand not found"));

    // Delete the image associated with the brand
    if (entity.getImg() != null) {
      try {
        ImageUtils.deleteImage(entity.getImg());
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    brandRepository.deleteById(id);
  }

  private BrandsDTO toDTO(BrandsEntity entity) {
    return new BrandsDTO(
        entity.getBrandId(),
        entity.getName(),
        entity.getPlace(),
        entity.getImg());
  }

  private BrandsEntity toEntity(BrandsDTO brandDto) {
    BrandsEntity entity = new BrandsEntity();
    entity.setBrandId(brandDto.getBrandId());
    entity.setName(brandDto.getName());
    entity.setPlace(brandDto.getPlace());
    entity.setImg(brandDto.getImg());
    return entity;
  }
}