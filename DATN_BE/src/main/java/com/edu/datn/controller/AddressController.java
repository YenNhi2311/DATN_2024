package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.entities.AddressEntity;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.AddressService;
import com.edu.datn.service.UserService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;
    @Autowired
    private UserService userService;

    // Endpoint để lấy danh sách địa chỉ
    @GetMapping
    public List<AddressEntity> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // Endpoint để xóa một địa chỉ
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Integer id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}")
    public ResponseEntity<AddressEntity> createAddress(
            @PathVariable Integer userId,
            @RequestBody AddressEntity addressEntity) {

        // Lấy thông tin người dùng từ database
        UserEntity user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(null); // Trả về lỗi nếu người dùng không tồn tại
        }

        // Thiết lập user cho địa chỉ
        addressEntity.setUser(user);

        AddressEntity savedAddress = addressService.saveAddress(addressEntity);
        return ResponseEntity.ok(savedAddress);
    }

    @PutMapping("/default")
    public ResponseEntity<String> updateDefaultAddress(@RequestParam Integer selectedAddressId) {
        try {
            addressService.updateAddressStatus(selectedAddressId);
            return ResponseEntity.ok("Cập nhật địa chỉ mặc định thành công");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi cập nhật địa chỉ: " + e.getMessage());
        }
    }
}
