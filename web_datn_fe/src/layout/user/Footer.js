import React from "react";
import "../../assets/css/footer.css";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaPaperPlane,
  FaLocationArrow,
  FaPhone,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="hr-color"></div>
      <div className="footer-intro">
        <h5>Về cửa hàng chúng tôi</h5>
        <p>
          Website của chúng tôi chuyên cung cấp các sản phẩm chăm sóc da và
          trang điểm từ những thương hiệu nổi tiếng trên thế giới. Với tiêu chí
          mang đến vẻ đẹp tự nhiên và an toàn, tất cả sản phẩm đều được chọn lọc
          kỹ càng, đảm bảo chất lượng và phù hợp với mọi loại da. Đội ngũ tư vấn
          viên nhiệt tình, giàu kinh nghiệm luôn sẵn sàng giúp bạn tìm ra sản
          phẩm phù hợp nhất cho nhu cầu của mình. Hãy đến với chúng tôi để trải
          nghiệm sự chăm sóc toàn diện và nâng tầm vẻ đẹp của bạn mỗi ngày!
        </p>
      </div>
      <footer>
        <div className="row">
          <div className="col" id="company">
            <h3>Chính sách</h3>
            <div className="links">
              <a href="#">Illustration</a>
              <a href="#">Creatives</a>
              <a href="#">Poster Design</a>
              <a href="#">Card Design</a>
            </div>
          </div>

          <div className="col" id="services">
            <h3>Services</h3>
            <div className="links">
              <a href="#">Illustration</a>
              <a href="#">Creatives</a>
              <a href="#">Poster Design</a>
              <a href="#">Card Design</a>
            </div>
          </div>

          <div className="col" id="useful-links">
            <h3>Links</h3>
            <div className="links">
              <a href="#">About</a>
              <a href="#">Services</a>
              <a href="#">Our Policy</a>
              <a href="#">Help</a>
            </div>
          </div>

          <div className="col" id="contact">
            <h3>Contact</h3>
            <div className="contact-details">
              <FaLocationArrow />
              <p>
                FF-42, Procube Avenue, <br /> NY, USA
              </p>
            </div>
            <div className="contact-details">
              <FaPhone />
              <p>+1-8755856858</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
