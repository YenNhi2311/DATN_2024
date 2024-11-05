package com.edu.datn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.AddressDTO;
import com.edu.datn.dto.DeleteAddressRequest;
import com.edu.datn.dto.DistrictDTO;
import com.edu.datn.dto.ProvinceDTO;
import com.edu.datn.dto.WardDTO;
import com.edu.datn.entities.UserEntity;
import com.edu.datn.service.AddressService;
import com.edu.datn.service.GHNService;
import com.edu.datn.service.UserService;

@RestController
@RequestMapping("/api/ghn/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserService userService;

    @Autowired
    private GHNService ghnService;

    // Get districts by province ID
    @GetMapping("/districts")
    public ResponseEntity<List<DistrictDTO>> getDistricts(@RequestParam Long provinceId) {
        try {
            List<DistrictDTO> districts = ghnService.getDistricts(provinceId);
            return ResponseEntity.ok(districts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get wards by district ID
    @GetMapping("/wards")
    public ResponseEntity<List<WardDTO>> getWards(@RequestParam Long districtId) {
        try {
            List<WardDTO> wards = ghnService.getWards(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get all provinces
    @GetMapping("/provinces")
    public ResponseEntity<List<ProvinceDTO>> getProvinces() {
        try {
            List<ProvinceDTO> provinces = ghnService.getProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get all addresses of a user
    @GetMapping
    public ResponseEntity<List<AddressDTO>> getAllAddresses(@RequestHeader("user_id") Integer userId) {
        List<AddressDTO> addresses = addressService.getAddressesByUserId(userId);
        return ResponseEntity.ok(addresses);
    }

    // Delete address by ID
    @DeleteMapping
    public ResponseEntity<Void> deleteAddress(@RequestBody DeleteAddressRequest request) {
        addressService.deleteAddress(request.getId());
        return ResponseEntity.noContent().build();
    }

    // Create a new address
    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(
            @RequestHeader("user_id") Integer userId,
            @RequestBody AddressDTO addressDTO) {

        UserEntity user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().build(); // Change to build() for no body
        }

        addressDTO.setUserId(userId);
        AddressDTO savedAddress = addressService.addAddress(addressDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAddress); // Set status to 201 Created
    }

    // Update default address
    @PutMapping("/{id}")  
    public ResponseEntity<AddressDTO> updateAddress(@PathVariable Integer id, @RequestBody AddressDTO addressDTO) {  
        try {  
            AddressDTO updatedAddress = addressService.updateAddress(id, addressDTO);  
            return ResponseEntity.ok(updatedAddress);  
        } catch (Exception e) {  
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)  
                    .body(null);  
        }  
    }  

}
