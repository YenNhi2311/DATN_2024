import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is installed
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Importing components
import Admin1Layout from "./Admin1Layout";
import ChiTietSP from "./component/page/chitietSP";
import ChiTietSPKM from "./component/page/chitietSPKM";
import About from "./component/user/About";
import Friends from "./component/user/Friends";
import PhotosPage from "./component/user/PhotosPage";
import Timeline from "./component/user/Timeline";
import MainLayout from "./MainLayout";

import ChangePassword from "./page/account/ChangePassword.js";
import ForgotPasswordPage from "./page/account/ForgotPasswordPage.js";
import LoginRegister from "./page/account/LoginRegister";
import OTPVerification from "./page/account/OTPVerification.js";
import ResetPassword from "./page/account/ResetPasswordPage.js";
import ProFile from "./page/account/UpdateProfileForm.js";

import Dashboard2 from "./page/admin1/pare";
import DanhGia from "./page/DanhGia";
import GioHang from "./page/GioHang";
import KhuyenMaiList from "./page/khuyenmailist";
import LienHe from "./page/lienHe";
import Shop from "./page/Shop";
import ShopLoai from "./page/ShopLoai";
import ShopTH from "./page/ShopTH";
import ChatMessage from "./page/social/ChatMessage";
import HomeSocial from "./page/social/HomeSocial";
import NotificationSocial from "./page/social/NotificationSocial";
import PersonalPage from "./page/social/PersonalPage";
import ThanhToan from "./page/ThanhToan";
import TrangChu from "./page/TrangChu";
import Social from "./SocialLayout";

//  {/* sản phẩm */}
import FormProduct from "../src/page/admin1/product/form.js";
import BigFormProduct from "../src/page/admin1/product/productform.js";
import TableProduct from "../src/page/admin1/product/table.js";

//  {/* Thương hiệu*/}
import FormBrand from "../src/page/admin1/brand/form.js";
import TableBrand from "../src/page/admin1/brand/list.js";

// {/* sản phẩm chi tiết*/}
import FormProductDetail from "../src/page/admin1/productdetail/form.js";
import TableProductDetail from "../src/page/admin1/productdetail/list.js";

//  {/* loại */}
import FormCategory from "../src/page/admin1/category/form.js";
import TableCategory from "../src/page/admin1/category/table.js";

//  {/* màu */}
import FormColor from "../src/page/admin1/color/form.js";
import TableColor from "../src/page/admin1/color/table.js";

//  {/* loại da */}
import FormSkinType from "../src/page/admin1/skintype/form.js";
import TableSkinType from "../src/page/admin1/skintype/table.js";

//  {/* dung tích*/}
import FormCapacity from "../src/page/admin1/capacity/form.js";
import TableSCapacity from "../src/page/admin1/capacity/table.js";


//  {/* thành phần*/}
import FormIngredient from "../src/page/admin1/ingredient/form.js";
import TableIngredient from "../src/page/admin1/ingredient/table.js";


//  {/* Công dụng*/}
import FormBenefit from "./page/admin1/benefit/form.js";
import TableBenefit from "./page/admin1/benefit/table.js";
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<LoginRegister />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/social/*" element={<Social />}>
          <Route path="" element={<HomeSocial />} />
          <Route path="personal" element={<PersonalPage />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="friends" element={<Friends />} />
          <Route path="about" element={<About />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="message" element={<ChatMessage />} />
          <Route path="notification" element={<NotificationSocial />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<TrangChu />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/category/:categoryId" element={<ShopLoai />} />
          <Route path="/shop/brand/:brandId" element={<ShopTH />} />
          <Route path="/product" element={<ChiTietSP />} />
          <Route path="/productpromotion" element={<ChiTietSPKM />} />
          <Route path="/lienhe" element={<LienHe />} />
          <Route path="/cart" element={<GioHang />} />
          <Route path="/thanhtoan" element={<ThanhToan />} />
          <Route path="/danhgia" element={<DanhGia />} />
          <Route path="productpromotionlist" element={<KhuyenMaiList />} />
          {/* Thông Tin Người dùng */}
          <Route path="/profile" element={<ProFile/>} />
          <Route path="/change-password" element={<ChangePassword/>} />
        </Route>

        <Route path="/admin/*" element={<Admin1Layout />}>
          <Route path="" element={<Dashboard2 />} />

          <Route path="formproduct" element={<FormProduct />} />
          <Route path="formproduct/:id" element={<FormProduct />} />
          <Route path="bigformproduct/:id" element={<BigFormProduct/>}/>
          <Route path="product" element={<TableProduct />} />

          {/* QL Thương hiệu */}
          <Route path="formbrand" element={<FormBrand />} />
          <Route path="formbrand/:id" element={<FormBrand />} />
          <Route path="brand" element={<TableBrand />} />

          {/* QL Sản phẩm chi tiết */}
          <Route path="formproductdetail" element={<FormProductDetail />} />
          <Route path="formproductdetail/:id" element={<FormProductDetail />} />
          <Route path="productdetail" element={<TableProductDetail />} />

          {/* QL loại */}
          <Route path="formcategory" element={<FormCategory />} />
          <Route path="formcategory/:id" element={<FormCategory />} />
          <Route path="category" element={<TableCategory />} />

          {/* QL màu */}
          <Route path="formcolor" element={<FormColor />} />
          <Route path="formcolor/:id" element={<FormColor />} />
          <Route path="color" element={<TableColor />} />

          {/* QL loại da */}
          <Route path="form-skin-type" element={<FormSkinType />} />
          <Route path="form-skin-type/:id" element={<FormSkinType />} />
          <Route path="skintype" element={<TableSkinType />} />

          {/* QL dung tích */}
          <Route path="formcapacity" element={<FormCapacity />} />
          <Route path="formcapacity/:id" element={<FormCapacity />} />
          <Route path="capacity" element={<TableSCapacity />} />


          {/* QL thành phần */}
          <Route path="formingredient" element={<FormIngredient />} />
          <Route path="formingredient/:id" element={<FormIngredient />} />
          <Route path="ingredient" element={<TableIngredient />} />

          {/* QL công dụng */}
          <Route path="formbenefit" element={<FormBenefit />} />
          <Route path="formbenefit/:id" element={<FormBenefit />} />
          <Route path="benefit" element={<TableBenefit />} />
        </Route>
        {/* Routes quản trị */}
       {/* QL Sản phẩm */}
       
      </Routes>
    </Router>
  );
};

export default App;
