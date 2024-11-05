package com.edu.datn.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.dto.SkinTypeDTO;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.jpa.ProductDetailsJPA;
import com.edu.datn.jpa.SkinTypeJPA;

@Service
public class SkinTypeService {

    @Autowired
    private SkinTypeJPA skintypeRepository;
    @Autowired
    private ProductDetailsJPA productDetailsRepository; // hoặc lớp tương tự
    // phi lấy loại da theo productId

    // Lấy loại da từ productId
    public List<SkinTypeDTO> getSkintypeByProductId(Integer productId) {
        List<ProductDetailsEntity> productDetails = productDetailsRepository.findByProductId(productId);
        return productDetails.stream()
                .map(productDetail -> productDetail.getSkintype())
                .distinct()
                .map(this::convertToSkintypeDTO)
                .collect(Collectors.toList());
    }

    // Phương thức chuyển đổi từ SkintypeEntity sang SkintypeDTO
    private SkinTypeDTO convertToSkintypeDTO(SkintypeEntity skintype) {
        SkinTypeDTO dto = new SkinTypeDTO();
        dto.setSkintypeId(skintype.getSkintypeId());
        dto.setName(skintype.getName());
        return dto;
    }

    public List<SkintypeEntity> getAllSkintypes() {
        return skintypeRepository.findAll();
    }

    public Optional<SkintypeEntity> getSkintypeById(Integer id) {
        return skintypeRepository.findById(id);
    }

    public SkintypeEntity addSkintype(SkinTypeDTO dto) {
        SkintypeEntity skintype = new SkintypeEntity();
        skintype.setName(dto.getName());
        return skintypeRepository.save(skintype);
    }

    public SkintypeEntity updateSkintype(Integer id, SkinTypeDTO dto) {
        Optional<SkintypeEntity> optionalSkintype = skintypeRepository.findById(id);
        if (optionalSkintype.isPresent()) {
            SkintypeEntity skintype = optionalSkintype.get();
            skintype.setName(dto.getName());
            return skintypeRepository.save(skintype);
        }
        return null; // Handle this case appropriately in the controller
    }

    public void deleteSkintype(Integer id) {
        skintypeRepository.deleteById(id);
    }
}
