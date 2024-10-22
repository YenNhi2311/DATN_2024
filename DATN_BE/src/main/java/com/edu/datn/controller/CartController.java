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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.datn.dto.CartDTO;
import com.edu.datn.dto.CartItemDTO;
import com.edu.datn.dto.UserDTO;
import com.edu.datn.entities.CartEntity;
import com.edu.datn.entities.CartItemEntity;
import com.edu.datn.entities.ProductDetailsEntity;
import com.edu.datn.entities.ProductPromotionEntity;
import com.edu.datn.service.CartItemService;
import com.edu.datn.service.CartService;
import com.edu.datn.service.ProductDetailsService;
import com.edu.datn.service.ProductPromotionService;
import com.edu.datn.service.UserService; // Đảm bảo bạn đã nhập khẩu cái này

@RestController
@RequestMapping("/api/cart") // Điểm cuối API cho giỏ hàng
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartItemService cartItemService;

    @Autowired
    private UserService userService; // Dịch vụ để lấy thông tin người dùng

    @Autowired
    private ProductDetailsService productDetailsService;

    @Autowired
    private ProductPromotionService productPromotionService;
    // Lấy giỏ hàng của người dùng dựa trên userId

    @PostMapping
    public ResponseEntity<CartEntity> createCart(@RequestBody UserDTO userIdDTO) {
        Integer userId = userIdDTO.getUserId(); // Lấy giá trị userId từ DTO
        CartEntity createdCart = cartService.createCart(userId);
        return new ResponseEntity<>(createdCart, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartDTO>> getCartByUserId(@PathVariable Integer userId) {
        List<CartEntity> carts = cartService.getCartByUserId(userId);

        // Chuyển đổi CartEntity sang CartDTO
        List<CartDTO> cartDTOs = carts.stream()
                .map(cart -> new CartDTO(cart.getCartId())) // Chỉ lấy cartId từ CartEntity
                .collect(Collectors.toList());

        // Return DTO list with OK status
        return new ResponseEntity<>(cartDTOs, HttpStatus.OK);
    }

    @GetMapping("/items/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartItemsByUserId(@PathVariable int userId) {
        try {
            // Lấy giỏ hàng của người dùng
            List<CartEntity> carts = cartService.getCartByUserId(userId);

            // Kiểm tra nếu giỏ hàng trống
            if (carts.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }

            // Lấy tất cả các mục trong giỏ hàng
            List<CartItemEntity> cartItems = cartItemService.findAllItemsByCartId(carts.get(0).getCartId());
            List<CartItemDTO> cartItemDTOs = new ArrayList<>();

            // Lấy ngày giờ hiện tại
            LocalDateTime currentDate = LocalDateTime.now();

            // Duyệt qua từng mục trong giỏ hàng
            for (CartItemEntity cartItem : cartItems) {
                // Lấy thông tin sản phẩm chi tiết
                ProductDetailsEntity productDetail = cartItem.getProductDetail();
                if (productDetail != null) {
                    // Lấy thông tin khuyến mãi
                    ProductPromotionEntity productPromotion = cartItem.getProductPromotion();

                    if (productPromotion != null && productPromotion.getPromotion() != null) {
                        LocalDateTime endDate = productPromotion.getPromotion().getEndDate(); // Lấy endDate tại đây

                        // Nếu khuyến mãi đã hết hạn, xóa mục khỏi giỏ hàng
                        if (endDate.isBefore(currentDate)) {
                            cartItemService.deleteCartItem(cartItem.getCartItemId());
                            continue; // Chuyển sang mục tiếp theo mà không thêm vào DTO
                        }

                        // Tạo đối tượng DTO cho mục còn lại trong giỏ hàng
                        CartItemDTO cartItemDTO = new CartItemDTO();
                        cartItemDTO.setCartItemId(cartItem.getCartItemId());
                        cartItemDTO.setQuantity(cartItem.getQuantity());

                        double originalPrice = productDetail.getPrice(); // Giá niêm yết
                        cartItemDTO.setOriginalPrice(originalPrice);

                        double discountedPrice = originalPrice; // Mặc định là giá gốc

                        // Chỉ áp dụng khuyến mãi nếu ngày hết hạn lớn hơn ngày giờ hiện tại
                        double discountPercent = productPromotion.getPromotion().getPercent();
                        double discount = (originalPrice * discountPercent) / 100;
                        discountedPrice = originalPrice - discount; // Tính giá đã khuyến mãi
                        // Cập nhật thông tin khuyến mãi
                        cartItemDTO.setProductPromotion(productPromotion);
                        cartItemDTO.setStartDate(productPromotion.getPromotion().getStartDate());
                        cartItemDTO.setEndDate(endDate);

                        cartItemDTO.setDiscountedPrice(discountedPrice); // Thiết lập giá đã khuyến mãi
                        cartItemDTO.setProductDetail(productDetail); // Thiết lập thông tin sản phẩm

                        cartItemDTOs.add(cartItemDTO); // Thêm vào danh sách DTO
                    } else {
                        // Nếu không có khuyến mãi, vẫn tạo DTO nhưng không có giảm giá
                        CartItemDTO cartItemDTO = new CartItemDTO();
                        cartItemDTO.setCartItemId(cartItem.getCartItemId());
                        cartItemDTO.setQuantity(cartItem.getQuantity());
                        double originalPrice = productDetail.getPrice(); // Giá niêm yết
                        cartItemDTO.setOriginalPrice(originalPrice);
                        cartItemDTO.setDiscountedPrice(originalPrice); // Không có khuyến mãi
                        cartItemDTO.setProductDetail(productDetail); // Thiết lập thông tin sản phẩm

                        cartItemDTOs.add(cartItemDTO);
                    }
                }
            }

            return ResponseEntity.ok(cartItemDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/cartItem/{cartId}/{productDetailId}/{productPromotionId}/{quantity}")
    public ResponseEntity<CartItemEntity> addCartItem(
            @PathVariable int cartId,
            @PathVariable int productDetailId,
            @PathVariable int productPromotionId, // Lấy productPromotionId từ URL
            @PathVariable int quantity) {
        try {
            // Lấy giỏ hàng dựa trên cartId
            CartEntity cart = cartService.findCartById(cartId);
            if (cart == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về 404 nếu không tìm thấy giỏ hàng
            }

            // Lấy thông tin sản phẩm dựa trên productDetailId
            ProductDetailsEntity productDetail = productDetailsService.findById(productDetailId);
            if (productDetail == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về 404 nếu không tìm thấy sản phẩm
            }

            ProductPromotionEntity productPromotion = null;

            // Kiểm tra productPromotionId và gán productPromotion là null nếu không tìm
            // thấy
            if (productPromotionId != 0) {
                productPromotion = productPromotionService.getProductPromotionById(productPromotionId);
                if (productPromotion == null) {
                    // Nếu không tìm thấy productPromotion trong DB, gán productPromotion là null
                    productPromotion = null;
                }
            }

            CartItemEntity existingCartItem = cartItemService
                    .findByCartIdAndProductDetailIdAndProductPromotionId(cartId, productDetailId, productPromotionId);

            if (existingCartItem != null) {
                // Nếu sản phẩm đã có, cập nhật số lượng
                existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
                existingCartItem.setProductPromotion(productPromotion); // Cập nhật thông tin khuyến mãi
                CartItemEntity updatedCartItem = cartItemService.saveCartItem(existingCartItem);
                return ResponseEntity.ok(updatedCartItem); // Trả về 200 OK với cart item đã cập nhật
            }

            // Nếu sản phẩm chưa có trong giỏ hàng, tạo mới CartItem
            CartItemEntity newCartItem = new CartItemEntity();
            newCartItem.setQuantity(quantity);
            newCartItem.setProductDetail(productDetail);
            newCartItem.setCart(cart); // Gán cart cho cart item
            newCartItem.setProductPromotion(productPromotion); // Gán thông tin khuyến mãi (có thể là null)

            // Lưu lại cart item mới
            CartItemEntity savedCartItem = cartItemService.saveCartItem(newCartItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCartItem); // Trả về 201 với cart item đã tạo
        } catch (Exception e) {
            e.printStackTrace(); // In ra stack trace của exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Trả về 500 nếu có lỗi xảy ra
        }
    }

    @PostMapping("/cartItem/update/{cartItemId}/{productDetailId}/{productPromotionId}/{quantity}")
    public ResponseEntity<CartItemEntity> updateCartItem(
            @PathVariable int cartItemId,
            @PathVariable int productDetailId,
            @PathVariable int productPromotionId, // Thêm tham số cho khuyến mãi
            @PathVariable int quantity) {
        try {
            // Lấy thông tin cart item dựa trên cartItemId
            CartItemEntity cartItem = cartItemService.findCartItemById(cartItemId);
            if (cartItem == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về 404 nếu không tìm thấy item
            }

            // Lấy thông tin sản phẩm dựa trên productDetailId
            ProductDetailsEntity productDetail = productDetailsService.findById(productDetailId);
            if (productDetail == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về 404 nếu không tìm thấy sản phẩm
            }

            // Lấy thông tin khuyến mãi dựa trên productPromotionId (nếu có)
            ProductPromotionEntity productPromotion = null;
            if (productPromotionId != 0) {
                productPromotion = productPromotionService.getProductPromotionById(productPromotionId);
                if (productPromotion == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Trả về 404 nếu không tìm thấy khuyến
                                                                                // mãi
                }
            }

            // Cập nhật số lượng, chi tiết sản phẩm và khuyến mãi
            cartItem.setQuantity(quantity);
            cartItem.setProductDetail(productDetail);
            cartItem.setProductPromotion(productPromotion); // Cập nhật khuyến mãi, có thể là null nếu không có

            // Lưu lại cart item đã cập nhật
            CartItemEntity updatedCartItem = cartItemService.saveCartItem(cartItem);

            return ResponseEntity.ok(updatedCartItem); // Trả về 200 OK với cart item đã cập nhật
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // Trả về 500 nếu có lỗi
        }
    }

    // Remove a product from the cart
    @DeleteMapping("/cartItem/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable int cartItemId) {
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
