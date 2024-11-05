import React from 'react';
import "../../assets/css/danhgia.css";
import vinhAvatar from '../../assets/img/vinh.jpg'; // Importing the image correctly
const DanhGia = () => {
  return (
    <div className="container py-5">
      <div className="testimonial-header text-left">
        <h1 className="text-dark">Đánh giá sản phẩm</h1>
      </div>
      <div className="rating-container">
        <div className="rating-summary">
          <div>4.5 trên 5</div>
          <div className="stars">★★★★★</div>
        </div>
        <div className="tabs">
          <div className="tab active-tab">Tất Cả</div>
          <div className="tab">5 Sao (2,6k)</div>
          <div className="tab">4 Sao (364)</div>
          <div className="tab">3 Sao (190)</div>
          <div className="tab">2 Sao (93)</div>
          <div className="tab">1 Sao (126)</div>
        </div>
        <div className="review">
          <img src={vinhAvatar} alt="User Avatar" />
          <div className="review-details">
            <div className="reviewer">vinh</div>
            <div className="date">2024-08-02 23:23 | Phân loại hàng: Đen, L&lt;M55-M65&gt;</div>
            <div className="review-text">
              Shop tư vấn sp nhiệt tình, hàng đóng gói cẩn thận, hàng giao siêu nhanh mới đặt hồi 7-7 mà nay giao roii, áo cầm
              khá nặng tay tui m62 mặc size M qua mông nhé, áo thơm lắm luôn á mới mở ra là thơm phức roii nói chung là sp
              tốt mn nên mua thử nha tring tủ đồ ít nhất phải có sp của shop nó chất lượng thật sự kh uổng tiền đâu.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DanhGia;
