package com.edu.datn.service;

import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.entities.CapacitiesEntity;
import com.edu.datn.jpa.CapacitiesJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CapacitiesService {

    @Autowired
    private CapacitiesJPA capacitiesRepository;

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
