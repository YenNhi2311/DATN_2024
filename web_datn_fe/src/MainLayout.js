import React from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/brand.css";
import "./assets/css/card.css";
import "./assets/css/category.css";
import "./assets/css/style.css";
import { CartProvider } from './component/page/CartContext';
import Foodter from "./part/user/Foodter";
import Header from "./part/user/Header";
const MainLayout = () => {
  return (
    <CartProvider>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        <footer>
          <Foodter />
        </footer>
      </div>
    </CartProvider>
  );
};

export default MainLayout;
