import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";

const GioHang = () => {
  const [cartItems, setCartItems] = useState([]);
  const { userId } = useParams();
  const [productPromotionId, setProductPromotionId] = useState(0);
  // Chỉ định một giá trị productPromotionId cho khuyến mãi nếu có, giả sử bạn có giá trị này từ đâu đó (ví dụ như trong URL hoặc redux store)

  // Function to fetch cart items for the given userId
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/items/${userId}`
      );
      console.log("Fetched cart items:", response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]); // Clear cart items on error
    }
  };

  // Fetch cart items when component mounts or userId changes
  useEffect(() => {
    console.log(`Fetching cart items for user ID: ${userId}`);
    fetchCartItems();
  }, [userId]);

  // Function to update the cart (add or update item quantity)
  const updateCart = async (cartItemId, productDetailId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedItems = cartItems.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    console.log(
      `Updating cart: cartItemId=${cartItemId}, productDetailId=${productDetailId}, newQuantity=${newQuantity}`
    );

    try {
      const response = await axios.post(
        `http://localhost:8080/api/cart/cartItem/update/${cartItemId}/${productDetailId}/${productPromotionId}/${newQuantity}`
      );
      console.log("Cart updated", response.data);
      fetchCartItems(); // Refresh cart items after update
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCartItems(); // Re-fetch items to ensure data consistency
    }
  };

  // Increment quantity
  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1; // Increase quantity by 1
    console.log(
      `Incrementing quantity for item: ${item.productDetail.productDetailId}, new quantity: ${newQuantity}`
    );
    updateCart(
      item.cartItemId,
      item.productDetail.productDetailId,
      newQuantity
    ); // Pass both cartItemId and productDetailId
  };

  // Decrement quantity
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1; // Decrease quantity by 1
      console.log(
        `Decrementing quantity for item: ${item.productDetail.productDetailId}, new quantity: ${newQuantity}`
      );
      updateCart(
        item.cartItemId,
        item.productDetail.productDetailId,
        newQuantity
      ); // Pass both cartItemId and productDetailId
    } else {
      console.log(
        `Cannot decrement quantity for item: ${item.productDetail.productDetailId}, current quantity is ${item.quantity}`
      );
    }
  };

  // Remove item from the cart
  const handleRemove = async (cartItemId) => {
    console.log(`Removing item from cart with ID: ${cartItemId}`);
    try {
      await axios.delete(
        `http://localhost:8080/api/cart/cartItem/${cartItemId}`
      );
      console.log("Item removed from cart");
      fetchCartItems(); // Refresh cart items after removing
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Calculate total price of items in the cart
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      (item?.discountedPrice || item?.productDetail?.price || 0) *
        item.quantity,
    0
  );

  return (
    <div className="container">
      {/* Page Header */}
      <div className="container-fluid page-header py-5">
       
      </div>

      {/* Cart Content */}
      <div className="col-lg-12">
        <div className="row">
          {/* Left side: Cart items */}
          <div className="col-lg-9">
            <h4>Giỏ hàng ({cartItems.length} sản phẩm)</h4>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Sản phẩm</th>
                  <th scope="col"></th>
                  <th scope="col">Giá tiền</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.cartItemId} className="cart-item-row">
                    <td>
                      <img
                        src={require(`../assets/img/${item.productDetail?.img}`)}
                        className="img-fluid"
                        alt={item.productDetail?.name || "Product Image"}
                        style={{ width: "80px", height: "80px" }}
                      />
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                      <p className="font-weight-bold">
  {item.productDetail?.product?.name || "N/A"}
  <span className="text-danger" style={{ fontWeight: 'bold', marginLeft: '5px' }}>
    {item.productPromotion?.promotion?.percent
      ? `(${item.productPromotion.promotion.percent.toFixed(0)}%)`
      : ""}
  </span>
</p>

                      </div>

                      <div className="d-flex justify-content-start">
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => handleRemove(item.cartItemId)}
                        >
                          ✖ Xóa
                        </button>
                      </div>
                    </td>

                    <td className="d-none d-lg-table-cell">
                      <p>
                        {item.discountedPrice?.toLocaleString() ||
                          item.productDetail?.price?.toLocaleString() ||
                          "0"}
                        ₫
                      </p>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          className="form-control text-center mx-2"
                          style={{ width: "60px" }}
                          
                        />
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleIncrement(item)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <p>
                        {(
                          (item.discountedPrice || item.productDetail?.price) *
                          item.quantity
                        ).toLocaleString()}
                        ₫
                      </p>
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

          {/* Right side: Order summary */}
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
              <a href={`/ThanhToan/${userId}`} className="btn btn-outline-primary w-100">
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
