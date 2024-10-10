import React, { Component } from "react";

import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";

import LoaiSPShop from "../component/page/LoaiSPShop";

export default class Shop extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid page-header py-5">
          <h1 className="text-center text-white display-6">Shop</h1>
          <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="#">Pages</a>
            </li>
            <li className="breadcrumb-item active text-white">Shop</li>
          </ol>
        </div>

        <div className="container py-5">
          <LoaiSPShop />
        </div>
      </div>
    );
  }
}
