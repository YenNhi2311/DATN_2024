import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "../../assets/css/category.css";
import { fetchCategories } from '../../services/authService';

const LoaiSP = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);

  // Gọi API lấy danh mục khi component mount
  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleCategorySelection = (categoryId) => {
    // Lưu categoryId vào localStorage
    localStorage.setItem('selectedCategoryId', categoryId);
    localStorage.removeItem("selectedBrandId");
    window.scrollTo(0, 0);
    navigate(`/shop`);
  };
  

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
            <img src={(`http://localhost:8080/assets/img/${item.img}`)} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LoaiSP;
