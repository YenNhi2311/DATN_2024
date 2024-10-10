package com.edu.datn.jpa;

import com.edu.datn.entities.BenefitsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BenefitsJPA extends JpaRepository<BenefitsEntity, Integer> {

}
