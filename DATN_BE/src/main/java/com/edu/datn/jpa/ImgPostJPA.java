package com.edu.datn.jpa;

import com.edu.datn.entities.ImgpostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgPostJPA extends JpaRepository<ImgpostEntity, Integer> {}
