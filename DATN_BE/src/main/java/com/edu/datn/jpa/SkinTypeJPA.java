package com.edu.datn.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edu.datn.entities.SkintypeEntity;

@Repository
public interface SkinTypeJPA extends JpaRepository<SkintypeEntity, Integer> {

}
