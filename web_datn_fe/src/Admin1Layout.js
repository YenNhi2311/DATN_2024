import { Outlet } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./assets/css/admin.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/card.css";
import "./assets/css/category.css";
import "./assets/css/style.css";

import Header from "./page/admin1/part/header";
import Sidebar from "./page/admin1/part/sidebar";

const Admin1Layout = () => {
  return (
    <div className="admin-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <main id="main" className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin1Layout;
