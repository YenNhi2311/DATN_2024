import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";
import { useCart } from "../component/page/CartContext";
import { deleteCartItem, getCartItemsByUserId, updateCartItem } from "../services/authService"; // Giả sử bạn đã định nghĩa các hàm này trong cartService

const GioHang = () => {
  const { cartItems, setCartItems } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const userId = localStorage.getItem("userId");

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.cartItemId)
    );
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedCartItems));
    window.location.href = "/ThanhToan";
  };

  const handleRemove = async (cartItemId) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCartItem(cartItemId); // Sử dụng apiClient để xóa sản phẩm
          toast.success("Xóa sản phẩm thành công");
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.cartItemId !== cartItemId)
          );
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      }
    });
  };

  const fetchCartItems = async () => {

    if (!userId) {
      console.error("User ID is null. Cannot fetch cart items.");
      return;
    }
    try {
      const response = await getCartItemsByUserId(userId); // Sử dụng apiClient để lấy giỏ hàng
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    } else {
      console.error("User ID is null. Cannot fetch cart items.");
    }
  }, [userId]);

  const updateCart = async (cartItemId, productDetailId, productPromotionId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedItems = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    try {
      const promotionId = productPromotionId !== undefined ? productPromotionId : null;
      await updateCartItem(cartItemId, productDetailId, promotionId, newQuantity); // Sử dụng apiClient để cập nhật số lượng
      fetchCartItems();
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCartItems();
    }
  };

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    updateCart(
      item.cartItemId,
      item.productDetail.productDetailId,
      item.productPromotion?.productPromotionId,
      newQuantity
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateCart(
        item.cartItemId,
        item.productDetail.productDetailId,
        item.productPromotion?.productPromotionId,
        newQuantity
      );
    }
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(cartItemId)) {
        newSelectedItems.delete(cartItemId);
      } else {
        newSelectedItems.add(cartItemId);
      }
      return newSelectedItems;
    });
  };

  const totalPrice = cartItems.reduce((total, item) => {
    if (selectedItems.has(item.cartItemId)) {
      return (
        total +
        (item.discountedPrice || item.productDetail?.price || 0) * item.quantity
      );
    }
    return total;
  }, 0);

  return (
    <div className="container">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container-fluid page-header py-5"></div>

      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-9">
            <h4>Giỏ Hàng ({cartItems.length} sản phẩm)</h4>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Sản phẩm</th>
                  <th scope="col"></th>
                  <th scope="col">Giá tiền</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Thành tiền</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartItemId} className="cart-item-row">
                    <td className="align-middle">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.cartItemId)}
                        onChange={() => handleSelectItem(item.cartItemId)}
                      />
                    </td>
                    <td className="align-middle">
                      <img
                        src={require(`../assets/img/${item.productDetail?.img}`)}
                        className="img-fluid"
                        alt={item.productDetail?.name || "Product Image"}
                        style={{ width: "80px", height: "80px" }}
                      />
                    </td>
                    <div>  <td className="align-middle">
                      <p className="font-weight-bold">
                        {item.productDetail?.product?.name || "N/A"}
                        <span
                          className="text-danger"
                          style={{ fontWeight: "bold", marginLeft: "5px" }}
                        >
                          {item.productPromotion?.promotion?.percent
                            ? `(${item.productPromotion.promotion.percent.toFixed(0)}%)`
                            : ""}
                          
                        </span>
                       
                      </p>
                    </td>
                    <span className="text-left">{item.productDetail.capacity.value}ml</span>
                    
                    <span className="text-right">{item.productDetail.color.name}</span></div>
                    <td className="align-middle">
                      <p>
                        {item.discountedPrice && item.discountedPrice > 0
                          ? item.discountedPrice.toLocaleString()
                          : item.productDetail?.price
                          ? item.productDetail.price.toLocaleString()
                          : "0"}
                        ₫
                      </p>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          className="form-control text-center mx-2"
                          style={{ width: "60px" }}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity > 0) {
                              updateCart(
                                item.cartItemId,
                                item.productDetail.productDetailId,
                                item.productPromotion?.productPromotionId,
                                newQuantity
                              );
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleIncrement(item)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="align-middle">
                      <p>
                        {(
                          (item.discountedPrice || item.productDetail?.price) *
                          item.quantity
                        ).toLocaleString()}
                        ₫
                      </p>
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => handleRemove(item.cartItemId)}
                      >
                        ✖ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-left">
              <a href="/shop" className="btn btn-link">
                ⬅ Tiếp tục mua hàng
              </a>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="border p-4 rounded">
              <h5>Hóa đơn của bạn</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <h6>Tổng cộng:</h6>
                <h6>{totalPrice.toLocaleString()}₫</h6>
              </div>
              <a
                onClick={handleCheckout}
                className="btn btn-outline-primary w-100"
              >
                Tiến hành đặt hàng
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GioHang;
