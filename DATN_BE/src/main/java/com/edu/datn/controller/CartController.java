package com.edu.datn.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.CartDTO;
import com.edu.datn.dto.CartItemDTO;
import com.edu.datn.entities.CartEntity;
import com.edu.datn.entities.CartItemEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.ProductPromotionEntity;
import com.edu.datn.entities.PromotionEntity;
import com.edu.datn.service.CartItemService;
import com.edu.datn.service.CartService;
import com.edu.datn.service.ProductDetailsService;
import com.edu.datn.service.ProductPromotionService;
import com.edu.datn.service.ProductService;
import com.edu.datn.service.UserService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  @Autowired
  private CartService cartService;

  @Autowired
  private CartItemService cartItemService;

  @Autowired
  private UserService userService;

  @Autowired
  private ProductDetailsService productDetailsService;

  @Autowired
  private ProductPromotionService productPromotionService;

  @Autowired
  private ProductService productService;

  @PostMapping
  public ResponseEntity<CartEntity> createCart(@RequestParam Integer userId) {
    if (userId == null) {
      return ResponseEntity.badRequest().build(); // Trả về 400 nếu userId không hợp lệ
    }

    CartEntity createdCart = cartService.createCart(userId);
    if (createdCart == null) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Trả về 500 nếu không tạo được giỏ
                                                                              // hàng
    }

    return new ResponseEntity<>(createdCart, HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<CartDTO>> getCartByUserId(@RequestParam Integer userId) {
    List<CartEntity> carts = cartService.getCartByUserId(userId);
    List<CartDTO> cartDTOs = carts.stream()
        .map(cart -> new CartDTO(cart.getCartId()))
        .collect(Collectors.toList());

    return new ResponseEntity<>(cartDTOs, HttpStatus.OK);
  }

  @GetMapping("/items")
  public ResponseEntity<List<CartItemDTO>> getCartItemsByUserId(@RequestParam("userId") int userId) {
    try {
      List<CartEntity> carts = cartService.getCartByUserId(userId);
      if (carts.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
      }

      List<CartItemEntity> cartItems = cartItemService.findAllItemsByCartId(carts.get(0).getCartId());
      List<CartItemDTO> cartItemDTOs = new ArrayList<>();

      for (CartItemEntity cartItem : cartItems) {
        ProductDetailsEntity productDetail = cartItem.getProductDetail();
        if (productDetail != null) {
          CartItemDTO cartItemDTO = new CartItemDTO();
          cartItemDTO.setCartItemId(cartItem.getCartItemId());
          cartItemDTO.setQuantity(cartItem.getQuantity());

          double originalPrice = productDetail.getPrice();
          cartItemDTO.setOriginalPrice(originalPrice);

          // Lấy danh sách khuyến mãi cho sản phẩm
          List<PromotionEntity> promotions = productService
              .getPromotionsForProduct(productDetail.getProductDetailId());

          // Tính toán giá đã giảm
          double discountedPrice = calculateDiscountedPrice(originalPrice, promotions);
          cartItemDTO.setDiscountedPrice(discountedPrice);

          // Cập nhật thông tin khuyến mãi vào CartItemDTO
          cartItemDTO.setPromotions(promotions);
          cartItemDTO.setProductDetail(productDetail);

          cartItemDTOs.add(cartItemDTO);
        }
      }

      return ResponseEntity.ok(cartItemDTOs);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
    }
  }

  // Phương thức tính toán giá đã giảm
  private double calculateDiscountedPrice(double originalPrice, List<PromotionEntity> promotions) {
    double discountedPrice = originalPrice;

    for (PromotionEntity promotion : promotions) {
      if (promotion.getEndDate().isAfter(LocalDateTime.now())) {
        double discount = (originalPrice * promotion.getPercent()) / 100;
        discountedPrice = originalPrice - discount;
        break;
      }
    }

    return discountedPrice;
  }

  @PostMapping("/cartItem")
  public ResponseEntity<CartItemEntity> addCartItem(
      @RequestParam int cartId,
      @RequestParam int productDetailId,
      @RequestParam int quantity) {
    try {
      CartEntity cart = cartService.findCartById(cartId);
      if (cart == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

      ProductDetailsEntity productDetail = productDetailsService.findById(productDetailId);
      if (productDetail == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

      CartItemEntity existingCartItem = cartItemService
          .findByCartIdAndProductDetailId(cartId, productDetailId);

      if (existingCartItem != null) {
        existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);

        CartItemEntity updatedCartItem = cartItemService.saveCartItem(existingCartItem);
        return ResponseEntity.ok(updatedCartItem);
      }

      CartItemEntity newCartItem = new CartItemEntity();
      newCartItem.setQuantity(quantity);
      newCartItem.setProductDetail(productDetail);
      newCartItem.setCart(cart);

      CartItemEntity savedCartItem = cartItemService.saveCartItem(newCartItem);
      return ResponseEntity.status(HttpStatus.CREATED).body(savedCartItem);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PostMapping("/cartItem/update")
  public ResponseEntity<CartItemEntity> updateCartItem(
      @RequestParam int cartItemId,
      @RequestParam int productDetailId,
      @RequestParam int productPromotionId,
      @RequestParam int quantity) {
    try {
      CartItemEntity cartItem = cartItemService.findCartItemById(cartItemId);
      if (cartItem == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

      ProductDetailsEntity productDetail = productDetailsService.findById(productDetailId);
      if (productDetail == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }

      ProductPromotionEntity productPromotion = null;
      if (productPromotionId != 0) {
        productPromotion = productPromotionService.getProductPromotionById(productPromotionId);
        if (productPromotion == null) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
      }

      cartItem.setQuantity(quantity);
      cartItem.setProductDetail(productDetail);

      CartItemEntity updatedCartItem = cartItemService.saveCartItem(cartItem);
      return ResponseEntity.ok(updatedCartItem);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @DeleteMapping("/cartItem")
  public ResponseEntity<Void> removeCartItem(@RequestParam int cartItemId) {
    try {
      CartItemEntity cartItem = cartItemService.findCartItemById(cartItemId);
      if (cartItem == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
      cartItemService.deleteCartItem(cartItemId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}