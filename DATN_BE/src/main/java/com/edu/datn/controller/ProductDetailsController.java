package com.edu.datn.controller;

import com.edu.datn.dto.ProductDetailsDTO;
import com.edu.datn.service.ProductDetailsService;
import static com.edu.datn.utils.ImageUtils.*;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ProductDetailsController {

    @Autowired
    private ProductDetailsService productDetailsService;

    // // API lấy tất cả chi tiết sản phẩm
    // @GetMapping("/productdetails")
    // public ResponseEntity<List<ProductDetailsDTO>> getAllProductDetails() {
    //     return ResponseEntity.ok(productDetailsService.getAllProductDetails());
    // }

    // // API lấy chi tiết sản phẩm theo productDetailId
    // @GetMapping("/productdetailsById")
    // public ResponseEntity<ProductDetailsDTO> getProductDetailsById(@RequestParam Integer id) {
    //     return ResponseEntity.ok(productDetailsService.getProductDetailsById(id));
    // }

    // // API khác cũng lấy danh sách chi tiết sản phẩm theo productId bằng RequestParam
    // @GetMapping("/product/details")
    // public ResponseEntity<List<ProductDetailsDTO>> getProductDetails(@RequestParam Integer productId) {
    //     List<ProductDetailsDTO> productDetails = productDetailsService.getProductDetailsByProductId(productId);
    //     return ResponseEntity.ok(productDetails);
    // }

    // @PostMapping
    // public ResponseEntity<ProductDetailsDTO> createProductDetails(
    //         @RequestParam(required = true) Double price,
    //         @RequestParam("quantity") Integer quantity,
    //         @RequestParam(value = "img", required = false) MultipartFile imgFile,
    //         @RequestParam("productId") Integer productId,
    //         @RequestParam("colorId") Integer colorId,
    //         @RequestParam("skintypeId") Integer skintypeId,
    //         @RequestParam("capacityId") Integer capacityId,
    //         @RequestParam("ingredientId") Integer ingredientId,
    //         @RequestParam("benefitId") Integer benefitId) throws IOException {

    //     ProductDetailsDTO productDetailsDTO = new ProductDetailsDTO();

    //     productDetailsDTO.setPrice(price);
    //     productDetailsDTO.setQuantity(quantity);
    //     productDetailsDTO.setProductId(productId);
    //     productDetailsDTO.setColorId(colorId);
    //     productDetailsDTO.setSkintypeId(skintypeId);
    //     productDetailsDTO.setCapacityId(capacityId);
    //     productDetailsDTO.setIngredientId(ingredientId);
    //     productDetailsDTO.setBenefitId(benefitId);

    //     if (imgFile != null && !imgFile.isEmpty()) {
    //         String imageName = imgFile.getOriginalFilename();
    //         saveImage(imgFile);
    //         productDetailsDTO.setImg(imageName);
    //     } else {
    //         productDetailsDTO.setImg(null);
    //     }

    //     ProductDetailsDTO savedProductDetails = productDetailsService.createProductDetails(productDetailsDTO, imgFile);

    //     return ResponseEntity.status(HttpStatus.CREATED).body(savedProductDetails);
    // }

    // @PutMapping("/{id}")
    // public ResponseEntity<ProductDetailsDTO> updateProductDetails(
    //         @PathVariable Integer id,
    //         @RequestParam("price") Double price,
    //         @RequestParam("quantity") Integer quantity,
    //         @RequestParam(value = "img", required = false) MultipartFile imgFile,
    //         @RequestParam("productId") Integer productId,
    //         @RequestParam("colorId") Integer colorId,
    //         @RequestParam("skintypeId") Integer skintypeId,
    //         @RequestParam("capacityId") Integer capacityId,
    //         @RequestParam("ingredientId") Integer ingredientId,
    //         @RequestParam("benefitId") Integer benefitId) throws IOException {

    //     ProductDetailsDTO existingProductDetails = productDetailsService.getProductDetailsById(id);
    //     if (existingProductDetails == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     ProductDetailsDTO productDetailsDTO = new ProductDetailsDTO();
    //     productDetailsDTO.setPrice(price);
    //     productDetailsDTO.setQuantity(quantity);
    //     productDetailsDTO.setProductId(productId);
    //     productDetailsDTO.setColorId(colorId);
    //     productDetailsDTO.setSkintypeId(skintypeId);
    //     productDetailsDTO.setCapacityId(capacityId);
    //     productDetailsDTO.setIngredientId(ingredientId);
    //     productDetailsDTO.setBenefitId(benefitId);

    //     if (imgFile != null && !imgFile.isEmpty()) {
    //         String imageName = imgFile.getOriginalFilename();
    //         saveImage(imgFile);
    //         productDetailsDTO.setImg(imageName);
    //     } else {
    //         productDetailsDTO.setImg(existingProductDetails.getImg());
    //     }

    //     try {
    //         ProductDetailsDTO updatedProductDetails = productDetailsService.updateProductDetails(id, productDetailsDTO, imgFile);
    //         return ResponseEntity.ok(updatedProductDetails);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    //     }
    // }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteProductDetails(@PathVariable Integer id) {
    //     productDetailsService.deleteProductDetails(id);
    //     return ResponseEntity.noContent().build();
    // }

   
}
