package com.edu.datn.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edu.datn.dto.AddressDTO;
import com.edu.datn.entities.AddressEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.jpa.AddressJPA;
import jakarta.transaction.Transactional;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressJPA addressRepository;

    // Thêm địa chỉ và cập nhật trạng thái mặc định nếu cần
    public AddressDTO addAddress(AddressDTO addressDTO) {
        if (addressDTO.isStatus()) { // Nếu địa chỉ mới được đặt làm mặc định
            resetDefaultAddress(addressDTO.getUserId()); // Cập nhật các địa chỉ khác về không mặc định
        }
        AddressEntity addressEntity = convertToEntity(addressDTO);
        AddressEntity savedAddress = addressRepository.save(addressEntity);
        return convertToDTO(savedAddress);
    }

    // Xóa địa chỉ
    public void deleteAddress(Integer addressId) {
        addressRepository.deleteById(addressId);
    }

    

    // Cập nhật tất cả các địa chỉ khác về không mặc định
    @Transactional
    public void resetDefaultAddress(Integer userId) {
        List<AddressEntity> addresses = addressRepository.findByUser_UserId(userId);
        for (AddressEntity address : addresses) {
            address.setStatus(false);
        }
        addressRepository.saveAll(addresses);
    }

    // Lấy danh sách địa chỉ theo userId
    public List<AddressDTO> getAddressesByUserId(Integer userId) {
        return addressRepository.findByUser_UserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

   
    // Chuyển đổi từ AddressEntity sang AddressDTO với các trường ID và tên địa chỉ
    private AddressDTO convertToDTO(AddressEntity address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getAddressId()); // Set ID của địa chỉ
        dto.setSpecificAddress(address.getSpecificAddress());
        dto.setWard(address.getWardCommune());
        dto.setDistrict(address.getDistrict());
        dto.setProvince(address.getProvince());
        dto.setWardName(address.getWardName());
        dto.setDistrictName(address.getDistrictName());
        dto.setProvinceName(address.getProvinceName());
        dto.setName(address.getName());
        dto.setPhone(address.getPhone());
        dto.setStatus(address.getStatus());
    
        // Thiết lập userId từ entity nếu có
        if (address.getUser() != null) {
            dto.setUserId(address.getUser().getUserId());
        }
    
        return dto;
    }
    
    private AddressEntity convertToEntity(AddressDTO dto) {
        AddressEntity address = new AddressEntity();
        address.setAddressId(dto.getId()); // Set ID của địa chỉ từ DTO
        address.setSpecificAddress(dto.getSpecificAddress());
        address.setWardCommune(dto.getWard());
        address.setDistrict(dto.getDistrict());
        address.setProvince(dto.getProvince());
        address.setWardName(dto.getWardName());
        address.setDistrictName(dto.getDistrictName());
        address.setProvinceName(dto.getProvinceName());
        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setStatus(dto.isStatus());
    
        // Thiết lập user từ userId nếu có
        if (dto.getUserId() != null) {
            UserEntity user = new UserEntity();
            user.setUserId(dto.getUserId());
            address.setUser(user);
        }
    
        return address;
    }


    public AddressDTO updateAddress(Integer addressId, AddressDTO addressDTO) {  
        AddressEntity existingAddress = addressRepository.findById(addressId)  
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));  
    
        // Cập nhật thông tin địa chỉ  
        existingAddress.setSpecificAddress(addressDTO.getSpecificAddress());  
        existingAddress.setWardCommune(addressDTO.getWard());  
        existingAddress.setWardName(addressDTO.getWardName());  
        existingAddress.setDistrict(addressDTO.getDistrict());  
        existingAddress.setDistrictName(addressDTO.getDistrictName());  
        existingAddress.setProvince(addressDTO.getProvince());  
        existingAddress.setProvinceName(addressDTO.getProvinceName());  
        existingAddress.setName(addressDTO.getName());  
        existingAddress.setPhone(addressDTO.getPhone());  
        existingAddress.setStatus(addressDTO.isStatus());  
    
        AddressEntity updatedAddress = addressRepository.save(existingAddress);  
        return convertToDTO(updatedAddress);  
    }  

    // Cập nhật địa chỉ mặc định
    @Transactional
    public void updateAddressStatus(Integer selectedAddressId) {
        AddressEntity selectedAddress = addressRepository.findById(selectedAddressId)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        // Đặt tất cả các địa chỉ khác của người dùng thành không mặc định
        resetDefaultAddress(selectedAddress.getUser().getUserId());

        // Đặt địa chỉ được chọn là mặc định
        selectedAddress.setStatus(true);
        addressRepository.save(selectedAddress);
    }

   
}
