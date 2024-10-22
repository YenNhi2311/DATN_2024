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
          <LoaiSPShop />
        </div>
      </div>
    );
  }
}
