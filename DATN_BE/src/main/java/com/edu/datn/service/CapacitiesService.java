package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.entities.CapacitiesEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.jpa.CapacitiesJPA;
import com.edu.datn.jpa.ProductDetailsJPA;

@Service
public class CapacitiesService {

    @Autowired
    private CapacitiesJPA capacitiesRepository;
    @Autowired
    private ProductDetailsJPA productDetailsRepository;

    // phi gọi nhìu dung tích từ productId
    public List<CapacitiesDTO> getCapacitiesByProductId(Integer productId) {
        List<ProductDetailsEntity> productDetails = productDetailsRepository.findByProductId(productId);
        return productDetails.stream()
                .map(productDetail -> productDetail.getCapacity())
                .distinct() // Để loại bỏ dung tích trùng lặp
                .map(this::convertToCapacityDTO)
                .collect(Collectors.toList());
    }

    private CapacitiesDTO convertToCapacityDTO(CapacitiesEntity capacity) {
        CapacitiesDTO dto = new CapacitiesDTO();
        dto.setCapacityId(capacity.getCapacityId());
        dto.setValue(capacity.getValue());
        return dto;
    }

    // Convert entity to DTO
    private CapacitiesDTO convertToDto(CapacitiesEntity capacity) {
        return new CapacitiesDTO(capacity.getCapacityId(), capacity.getValue());
    }

    // Convert DTO to entity
    public CapacitiesEntity convertDTOtoEntity(CapacitiesDTO capacitiesDTO) {
        CapacitiesEntity entity = new CapacitiesEntity();
        entity.setCapacityId(capacitiesDTO.getCapacityId());
        entity.setValue(capacitiesDTO.getValue());
        return entity;
    }

    // Get all capacities
    public List<CapacitiesDTO> getAllCapacities() {
        List<CapacitiesEntity> capacities = capacitiesRepository.findAll();
        return capacities.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get capacity by ID
    public CapacitiesDTO getCapacityById(Integer id) {
        Optional<CapacitiesEntity> capacity = capacitiesRepository.findById(id);
        return capacity.map(this::convertToDto).orElse(null);
    }

    // Create a new capacity
    public CapacitiesDTO createCapacity(CapacitiesDTO capacitiesDto) {
        CapacitiesEntity capacity = convertDTOtoEntity(capacitiesDto);
        CapacitiesEntity savedCapacity = capacitiesRepository.save(capacity);
        return convertToDto(savedCapacity);
    }

    // Update an existing capacity
    public CapacitiesDTO updateCapacity(Integer id, CapacitiesDTO capacitiesDto) {
        Optional<CapacitiesEntity> optionalCapacity = capacitiesRepository.findById(id);

        if (optionalCapacity.isPresent()) {
            CapacitiesEntity capacity = optionalCapacity.get();
            capacity.setValue(capacitiesDto.getValue());
            CapacitiesEntity updatedCapacity = capacitiesRepository.save(capacity);
            return convertToDto(updatedCapacity);
        }

        return null;
    }

    // Delete a capacity by ID
    public boolean deleteCapacity(Integer id) {
        if (capacitiesRepository.existsById(id)) {
            capacitiesRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
