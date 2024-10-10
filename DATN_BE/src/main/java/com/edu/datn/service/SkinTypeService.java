package com.edu.datn.service;

import com.edu.datn.dto.SkinTypeDTO;
import com.edu.datn.entities.SkintypeEntity;
import com.edu.datn.jpa.SkinTypeJPA;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkinTypeService {

    @Autowired
    private SkinTypeJPA skintypeRepository;

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
        return null;  // Handle this case appropriately in the controller
    }

    public void deleteSkintype(Integer id) {
        skintypeRepository.deleteById(id);
    }
}
