package com.edu.datn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.datn.entities.AddressEntity;
import com.edu.datn.jpa.AddressJPA;

import jakarta.transaction.Transactional;

@Service
public class AddressService {

    @Autowired
    private AddressJPA addressRepository;

    // Phương thức để lấy danh sách địa chỉ
    public List<AddressEntity> getAllAddresses() {
        return addressRepository.findAll();
    }

    // Phương thức để thêm một địa chỉ mới
    public AddressEntity addAddress(AddressEntity address) {
        return addressRepository.save(address);
    }

    // Phương thức để xóa một địa chỉ
    public void deleteAddress(Integer addressId) {
        addressRepository.deleteById(addressId);
    }

    public AddressEntity saveAddress(AddressEntity address) {
        return addressRepository.save(address);
    }

    @Transactional
    public void updateAddressStatus(Integer selectedAddressId) {
        // Đặt tất cả địa chỉ thành không mặc định
        List<AddressEntity> addresses = addressRepository.findAll();
        for (AddressEntity address : addresses) {
            address.setStatus(false);
            addressRepository.save(address);
        }

        // Đặt địa chỉ đã chọn thành mặc định
        AddressEntity selectedAddress = addressRepository.findById(selectedAddressId)
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));
        selectedAddress.setStatus(true);
        addressRepository.save(selectedAddress);
    }
}
