package com.edu.datn.jpa;

import com.edu.datn.entities.AddressEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressJPA extends JpaRepository<AddressEntity, Integer> {}
