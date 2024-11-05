package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.BenefitsDTO;
import com.edu.datn.entities.BenefitsEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.jpa.BenefitsJPA;
import com.edu.datn.jpa.ProductDetailsJPA;

@Service
public class BenefitsService {

    @Autowired
    private BenefitsJPA benefitsRepository;
    @Autowired
    private ProductDetailsJPA productDetailsRepository;

    // phi Lấy nhiều lợi ích từ productId
    public List<BenefitsDTO> getBenefitsByProductId(Integer productId) {
        List<ProductDetailsEntity> productDetails = productDetailsRepository.findByProductId(productId);
        return productDetails.stream()
                .map(ProductDetailsEntity::getBenefit) // Lấy lợi ích từ product detail
                .distinct() // Loại bỏ các lợi ích trùng lặp
                .map(this::convertToBenefitsDTO) // Chuyển đổi thành BenefitsDTO
                .collect(Collectors.toList());
    }

    private BenefitsDTO convertToBenefitsDTO(BenefitsEntity benefit) {
        BenefitsDTO dto = new BenefitsDTO();
        dto.setBenefitId(benefit.getBenefitId());
        dto.setName(benefit.getName());
        return dto;
    }

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
        return null; // Handle this case in the controller
    }

    public void deleteBenefit(Integer id) {
        benefitsRepository.deleteById(id);
    }
}
