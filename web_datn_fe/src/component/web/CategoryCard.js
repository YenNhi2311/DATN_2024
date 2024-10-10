import React from "react";
import "../../assets/css/component/category.css"; // Ensure this CSS file matches the CSS you provided

const CategoryCard = ({ categories }) => {
  return (
    <div className="card__container">
      {categories.map((category) => (
        <div className="card__article" key={category.id}>
          <img src={category.img} alt={category.name} className="card__img" />
          <div className="card__data">
            <h2 className="card__title">{category.name}</h2>
            <a href={`/category/${category.id}`} className="card__button">
              View More
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
