package com.edu.datn.jpa;

import com.edu.datn.entities.CapacitiesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CapacitiesJPA extends JpaRepository<CapacitiesEntity, Integer> {

}
