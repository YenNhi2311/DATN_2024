import "bootstrap/dist/css/bootstrap.min.css"; // Đảm bảo bạn đã cài đặt Bootstrap
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Admin1Layout from "./Admin1Layout";
import ChiTietSP from "./component/page/chitietSP";
import About from "./component/user/About";
import Friends from "./component/user/Friends";
import PhotosPage from "./component/user/PhotosPage";
import Timeline from "./component/user/Timeline";
import MainLayout from "./MainLayout";
import LoginRegister from "./page/account/LoginRegister";
import Dashboard2 from "./page/admin1/pare";
import DanhGia from "./page/DanhGia";
import GioHang from "./page/GioHang";
import KhuyenMaiList from "./page/khuyenmailist";
import LienHe from "./page/lienHe";
import Shop from "./page/Shop";
import ChatMessage from "./page/social/ChatMessage";
import HomeSocial from "./page/social/HomeSocial";
import NotificationSocial from "./page/social/NotificationSocial";
import PersonalPage from "./page/social/PersonalPage";
import ThanhToan from "./page/ThanhToan";
import TrangChu from "./page/TrangChu";
import Social from "./SocialLayout";

//  {/* user */}
// import TableUser from "./";
// import FormUser from "./";

//  {/* sản phẩm */}
import FormProduct from "../src/page/admin1/product/form.js";
import TableProduct from "../src/page/admin1/product/table.js";

//  {/* sản phẩm chi tiết */}
// import FormProductDetail from "./";
// import TableProductDetail from "./";

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

//  {/* hÓA đơn*/}
// import TableOder from "../src/page/admin1/";
// import TableOderDetail from "../src/page/admin1/";

//  {/* khuyến mãi*/}
// import TablePromotoin from "../src/page/admin1/";
// import FormPromotoin from "../src/page/admin1/";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />

        <Route path="/social/*" element={<Social />}>
          <Route path="" element={<HomeSocial />}>
            <Route path="personal" element={<PersonalPage />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="friends" element={<Friends />} />
            <Route path="about" element={<About />} />
            <Route path="photos" element={<PhotosPage />} />
            <Route path="message" element={<ChatMessage />} />
            <Route path="notification" element={<NotificationSocial />} />
          </Route>
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TrangChu />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/product/1" element={<ChiTietSP />} />
          <Route path="/LienHe" element={<LienHe />} />
          <Route path="/GioHang" element={<GioHang />} />
          <Route path="/ThanhToan" element={<ThanhToan />} />
          <Route path="/DanhGia" element={<DanhGia />} />
          <Route path="/promotions" element={<KhuyenMaiList />} />
        </Route>

        {/* Routes quản trị */}
        <Route path="/admin/*" element={<Admin1Layout />}>
          {/* Dashboard */}
          <Route path="" element={<Dashboard2 />} />

          {/* QL NGười dùng
          <Route path="tableuser" element={<TableUser />} />
          <Route path="formuser" element={<FormUser />} />
          <Route path="formuser/:id" element={<FormUser />} /> */}

          {/* QL Sản phẩm */}
          <Route path="formproduct" element={<FormProduct />} />
          <Route path="formproduct/:id" element={<FormProduct />} />
          <Route path="tableproduct" element={<TableProduct />} />

          {/* QL Sản phẩm chi tiết
          <Route path="form-product-detail" element={<FormProductDetail />} />
          <Route path="form-product-detail/:id" element={<FormProductDetail />} />
          <Route path="table-product-detail" element={<TableProductDetail />} /> */}

          {/* QL loại */}
          <Route path="formcategory" element={<FormCategory />} />
          <Route path="formcategory/:id" element={<FormCategory />} />
          <Route path="tablecategory" element={<TableCategory />} />

          {/* QL màu */}
          <Route path="formcolor" element={<FormColor />} />
          <Route path="formcolor/:id" element={<FormColor />} />
          <Route path="tablecolor" element={<TableColor />} />

          {/* QL loại da */}
          <Route path="form-skin-type" element={<FormSkinType />} />
          <Route path="form-skin-type/:id" element={<FormSkinType />} />
          <Route path="table-skin-type" element={<TableSkinType />} />

          {/* QL dung tích */}
          <Route path="formcapacity" element={<FormCapacity />} />
          <Route path="formcapacity/:id" element={<FormCapacity />} />
          <Route path="tablecapacity" element={<TableSCapacity />} />


          {/* QL thành phần */}
          <Route path="formingredient" element={<FormIngredient />} />
          <Route path="formingredient/:id" element={<FormIngredient />} />
          <Route path="tableingredient" element={<TableIngredient />} />

          {/* QL công dụng */}
          <Route path="formbenefit" element={<FormBenefit />} />
          <Route path="formbenefit/:id" element={<FormBenefit />} />
          <Route path="tablebenefit" element={<TableBenefit />} />

          {/* QL hóa đơn */}
          {/* <Route path="tableoder" element={<TableOder />} />
          <Route path="table-oder-detail" element={<TableOderDetail />} /> */}

          {/* QL khuyến mãi*/}
          {/* <Route path="formpromotion" element={<FormPromotoin />} />
          <Route path="formpromotion/:id" element={<FormPromotoin />} />
          <Route path="tablepromotion" element={<TablePromotoin />} /> */}

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
