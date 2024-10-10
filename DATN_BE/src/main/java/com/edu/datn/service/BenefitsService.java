package com.edu.datn.service;

import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.jpa.BenefitsJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BenefitsService {

    @Autowired
    private BenefitsJPA benefitsRepository;

    public List<BenefitsEntity> getAllBenefits() {
        return benefitsRepository.findAll();
    }

    public Optional<BenefitsEntity> getBenefitById(Integer id) {
        return benefitsRepository.findById(id);
    }

    public BenefitsEntity addBenefit(BenefitsEntity benefit) {
        return benefitsRepository.save(benefit);
    }

    public BenefitsEntity updateBenefit(Integer id, BenefitsEntity benefit) {
        Optional<BenefitsEntity> optionalBenefit = benefitsRepository.findById(id);
        if (optionalBenefit.isPresent()) {
            BenefitsEntity existingBenefit = optionalBenefit.get();
            existingBenefit.setName(benefit.getName());
            return benefitsRepository.save(existingBenefit);
        }
        return null;  // Handle this case in the controller
    }

    public void deleteBenefit(Integer id) {
        benefitsRepository.deleteById(id);
    }
}
