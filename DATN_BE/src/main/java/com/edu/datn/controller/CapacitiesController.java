package com.edu.datn.controller;

import com.edu.datn.dto.CapacitiesDTO;
import com.edu.datn.service.CapacitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/capacities")
public class CapacitiesController {

    @Autowired
    private CapacitiesService capacitiesService;

    // GET all capacities
    @GetMapping
    public ResponseEntity<List<CapacitiesDTO>> getAllCapacities() {
        List<CapacitiesDTO> capacities = capacitiesService.getAllCapacities();
        return ResponseEntity.ok(capacities);
    }

    // GET capacity by ID
    @GetMapping("/{id}")
    public ResponseEntity<CapacitiesDTO> getCapacityById(@PathVariable Integer id) {
        CapacitiesDTO capacity = capacitiesService.getCapacityById(id);
        return capacity != null ? ResponseEntity.ok(capacity) : ResponseEntity.notFound().build();
    }

    // POST new capacity
    @PostMapping
    public ResponseEntity<CapacitiesDTO> createCapacity(@RequestBody CapacitiesDTO capacitiesDto) {
        CapacitiesDTO createdCapacity = capacitiesService.createCapacity(capacitiesDto);
        return new ResponseEntity<>(createdCapacity, HttpStatus.CREATED);
    }

    // PUT (update) capacity by ID
    @PutMapping("/{id}")
    public ResponseEntity<CapacitiesDTO> updateCapacity(
            @PathVariable Integer id,
            @RequestBody CapacitiesDTO capacitiesDto) {
                CapacitiesDTO updatedCapacity = capacitiesService.updateCapacity(id, capacitiesDto);
        return updatedCapacity != null ? ResponseEntity.ok(updatedCapacity) : ResponseEntity.notFound().build();
    }

    // DELETE capacity by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCapacity(@PathVariable Integer id) {
        boolean isDeleted = capacitiesService.deleteCapacity(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
