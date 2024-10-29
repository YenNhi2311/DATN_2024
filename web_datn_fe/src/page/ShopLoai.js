import React, { Component } from "react";

import "../assets/css/bootstrap.min.css";
import "../assets/css/brand.css";
import "../assets/css/card.css";
import "../assets/css/category.css";
import "../assets/css/shop.css";
import "../assets/css/style.css";

import LoaiSPShoploai from "../component/page/LoaiSPShoploai";

export default class ShopLoai extends Component {
  render() {
    return (
      <div>
     

<div className="container-fluid page-header4 py-5">
          <LoaiSPShoploai />
        </div>
      </div>
    );
  }
}
