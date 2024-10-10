import axios from 'axios';
import React, { Component } from 'react';
import Slider from "react-slick";
import "../../assets/css/category.css"; // Tạo file CSS để tùy chỉnh giao diện

export default class LoaiSP extends Component {
  // Custom previous button
  state = {
    categories: []
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/home/categories');
      this.setState({ categories: response.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-prev" onClick={onClick}>
        <i className="fas fa-chevron-left"></i>
      </div>
    );
  }

  // Custom next button
  NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-next" onClick={onClick}>
        <i className="fas fa-chevron-right"></i>
      </div>
    );
  }

  render() {
    // Cấu hình cho slider
    const { categories } = this.state;
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 8,  // Điều chỉnh lại tùy thuộc vào kích thước item và margin
      slidesToScroll: 1,
      nextArrow: <this.NextArrow />,
      prevArrow: <this.PrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 5,  // Điều chỉnh lại nếu cần
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,  // Điều chỉnh lại nếu cần
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,  // Điều chỉnh lại nếu cần
            slidesToScroll: 1,
          }
        }
      ]
    };
    

    return (
      <div className="container py-0">
        <h1 className="text-blue">Danh mục</h1>
        <Slider {...settings}>
          {categories.map((item) => (
            <div key={item.id} className="category-item">
            <img src={require(`../../assets/img/${item.img}`)} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}