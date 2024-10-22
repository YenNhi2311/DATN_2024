package com.edu.datn.controller;

import static com.edu.datn.utils.ImageUtils.*;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.service.ProductDetailsService;

@RestController
@RequestMapping("/api/productdetails")
public class ProductDetailsController {

    @Autowired
    private ProductDetailsService productDetailsService;

    @GetMapping
    public ResponseEntity<List<ProductDetailsDTO>> getAllProductDetails() {
        return ResponseEntity.ok(productDetailsService.getAllProductDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> getProductDetailsById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(productDetailsService.getProductDetailsById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDetailsDTO> createProductDetails(
            @RequestParam(required = true) Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "img", required = false) MultipartFile imgFile,
            @RequestParam("productId") Integer productId,
            @RequestParam("colorId") Integer colorId,
            @RequestParam("skintypeId") Integer skintypeId,
            @RequestParam("capacityId") Integer capacityId,
            @RequestParam("ingredientId") Integer ingredientId,
            @RequestParam("benefitId") Integer benefitId) throws IOException {

        // Tạo một đối tượng ProductDetailsDTO
        ProductDetailsDTO productDetailsDTO = new ProductDetailsDTO();

        // Thiết lập các thuộc tính cho ProductDetailsDTO
        productDetailsDTO.setPrice(price);
        productDetailsDTO.setQuantity(quantity);
        productDetailsDTO.setProductId(productId);
        productDetailsDTO.setColorId(colorId);
        productDetailsDTO.setSkintypeId(skintypeId);
        productDetailsDTO.setCapacityId(capacityId);
        productDetailsDTO.setIngredientId(ingredientId);
        productDetailsDTO.setBenefitId(benefitId);

        if (imgFile != null && !imgFile.isEmpty()) {
            String imageName = imgFile.getOriginalFilename();
            saveImage(imgFile);

            productDetailsDTO.setImg(imageName);
        } else {
            productDetailsDTO.setImg(null);
        }

        ProductDetailsDTO savedProductDetails = productDetailsService.createProductDetails(productDetailsDTO, imgFile);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetails);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailsDTO> updateProductDetails(
            @PathVariable Integer id,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam(value = "img", required = false) MultipartFile imgFile,
            @RequestParam("productId") Integer productId,
            @RequestParam("colorId") Integer colorId,
            @RequestParam("skintypeId") Integer skintypeId,
            @RequestParam("capacityId") Integer capacityId,
            @RequestParam("ingredientId") Integer ingredientId,
            @RequestParam("benefitId") Integer benefitId) throws IOException {

        // Create a ProductDetailsDTO object to hold the updated values
        ProductDetailsDTO productDetailsDTO = new ProductDetailsDTO();

        // Set the fields of ProductDetailsDTO with the values from the request
        // parameters
        productDetailsDTO.setPrice(price);
        productDetailsDTO.setQuantity(quantity);
        productDetailsDTO.setProductId(productId);
        productDetailsDTO.setColorId(colorId);
        productDetailsDTO.setSkintypeId(skintypeId);
        productDetailsDTO.setCapacityId(capacityId);
        productDetailsDTO.setIngredientId(ingredientId);
        productDetailsDTO.setBenefitId(benefitId);

        // Handle the image file if it is provided
        if (imgFile != null && !imgFile.isEmpty()) {
            String imageName = imgFile.getOriginalFilename();
            saveImage(imgFile);
            productDetailsDTO.setImg(imageName);
        }

        try {
            // Update the product details using the service
            ProductDetailsDTO updatedProductDetails = productDetailsService.updateProductDetails(id, productDetailsDTO,
                    imgFile);
            return ResponseEntity.ok(updatedProductDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductDetails(@PathVariable Integer id) {
        productDetailsService.deleteProductDetails(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/details")
    public List<ProductDetailsDTO> getProductDetails(
            @PathVariable Integer productId) {
        return productDetailsService.getProductDetailsByProductId(productId);
    }
}
