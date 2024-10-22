import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Slider from "react-slick";
import "../../assets/css/category.css"; // Tạo file CSS để tùy chỉnh giao diện
import { apiClient } from '../../services/authService'; // Import apiClient

const LoaiSP = () => {
  const navigate = useNavigate(); // Khởi tạo navigate
  const [categories, setCategories] = React.useState([]); // Khởi tạo state cho danh mục

  // Gọi API lấy danh mục khi component mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('api/home/categories'); // Sử dụng apiClient
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API

      // Kiểm tra xem dữ liệu trả về có phải là mảng không
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Dữ liệu không phải là mảng:', response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Custom Arrow cho Slider
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-prev" onClick={onClick}>
        <i className="fas fa-chevron-left"></i>
      </div>
    );
  };

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-next" onClick={onClick}>
        <i className="fas fa-chevron-right"></i>
      </div>
    );
  };

  const handleCategorySelection = (categoryId) => {
    navigate(`/shop/category/${categoryId}`); // Sử dụng đúng trường ID
  };

  // Cài đặt cho Slider
  const settings = {
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="container py-0">
      <h1 className="text-blue">Danh Mục</h1>
      <Slider {...settings}>
        {categories.map((item) => (
          <div key={item.categoryId} className="category-item" onClick={() => handleCategorySelection(item.categoryId)}>
            <img src={require(`../../assets/img/${item.img}`)} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LoaiSP;
