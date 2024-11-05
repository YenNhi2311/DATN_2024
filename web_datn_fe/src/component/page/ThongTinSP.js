import React, { useEffect, useState } from 'react';
import {
    getBenefitsByProductId,
    getBrandById,
    getCapacityProduct,
    getCategoryById,
    getColorsByProductId,
    getIngredientById,
    getProductById,
    getProductDetailById,
    getSkintypeProduct
} from '../../services/authService';

const ThongTinsp = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [capacities, setCapacities] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const productId = localStorage.getItem("selectedProductId");
  
      try {
        const productData = await getProductById(productId);
        const productDetails = await getProductDetailById(productData.productId);
        const productDetailDTO = Array.isArray(productDetails) ? productDetails[0] : productDetails;
  
        if (productDetailDTO) {
          const [brandData, categoryData] = await Promise.all([
            getBrandById(productData.brandId),
            getCategoryById(productData.categoryId),
          ]);
  
          const [capacities, skintypes, benefits, colors] = await Promise.all([
            getCapacityProduct(productId),
            getSkintypeProduct(productId),
            getBenefitsByProductId(productId),
            getColorsByProductId(productId),
          ]);
  
          const skintypeData = productDetailDTO.productDetail.skintypeId
            ? skintypes.find(s => s.skintypeId === productDetailDTO.productDetail.skintypeId)
            : null;

          // Lấy ingredientData từ productDetailDTO
          const ingredientData = productDetailDTO.productDetail.ingredientId
            ? await getIngredientById(productDetailDTO.productDetail.ingredientId)
            : null;
  
          setCapacities(getUniqueItems(capacities, "capacityId", "value"));
          setSkintypes(getUniqueItems(skintypes, "skintypeId", "name"));
          setBenefits(getUniqueItems(benefits, "benefitId", "name"));
          setColors(getUniqueItems(colors, "colorId", "name"));
  
          setProduct({
            ...productData,
            productDetails,
            brand: brandData,
            category: categoryData,
            capacity: productDetailDTO.productDetail.capacityId
              ? capacities.find(c => c.capacityId === productDetailDTO.productDetail.capacityId)
              : null,
            skintype: skintypeData,
            benefit: productDetailDTO.productDetail.benefitId
              ? benefits.find(b => b.benefitId === productDetailDTO.productDetail.benefitId)
              : null,
            ingredient: ingredientData, 
          });
        } else {
          console.error("No product detail found.");
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, []);
  
  const getUniqueItems = (items, idField, valueField) => {
    return items.reduce((acc, item) => {
      if (!acc.some((i) => i.id === item[idField])) {
        acc.push({ id: item[idField], [valueField]: item[valueField] });
      }
      return acc;
    }, []);
  };
  
  const handleTabClick = (tab) => setActiveTab(tab);

  if (loading || !product) {
    return <p>Loading...</p>;
  }
  
  const generateBarcode = (productId) => {
    const idString = productId.toString();
    return idString.padStart(6, "0");
  };
  
  return (
    <div>
      <nav>
        <div className="nav nav-tabs mb-3">
          {["about", "benefits", "skinType", "ingredients"].map((tab) => (
            <button
              key={tab}
              className={`nav-link ${activeTab === tab ? "active" : ""} border-white border-bottom-0`}
              type="button"
              role="tab"
              onClick={() => handleTabClick(tab)}
            >
              {tab === "about" && "Thông Tin"}
              {tab === "benefits" && "Thông Số"}
              {tab === "skinType" && "Cách Dùng"}
              {tab === "ingredients" && "Thành Phần"}
            </button>
          ))}
        </div>
      </nav>

      <div>
        {activeTab === "about" && (
          <div>
            <h2>Thông Tin sản phẩm</h2>
            <p>{product.description || "No description available."}</p>
          </div>
        )}
        {activeTab === "benefits" && (
          <div className="container">
            <h2>Thông số sản phẩm</h2>
            <table className="table">
              <tbody>
                <tr>
                  <th>Thông tin</th>
                  <th>Giá trị</th>
                </tr>
                <tr>
                  <td className="info-cell">Barcode</td>
                  <td>{generateBarcode(product.productId)}</td>
                </tr>
                <tr>
                  <td className="info-cell">Thương Hiệu</td>
                  <td>{product.brand?.name}</td>
                </tr>
                <tr>
                  <td className="info-cell">Xuất xứ thương hiệu</td>
                  <td>{product.brand?.place}</td>
                </tr>
                <tr>
                  <td className="info-cell">Nơi sản xuất</td>
                  <td>{product.brand?.place}</td>
                </tr>
                <tr>
                  <td className="info-cell">Loại da</td>
                  <td>{product.skintype?.name || "No skin type available"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "skinType" && (
          <div>
            <h2>Hướng Dẫn Sử dụng</h2>
            <ul>
              {product.benefit?.name ? (
                <li
                  dangerouslySetInnerHTML={{
                    __html: product.benefit.name.replace(/\n/g, "<br />"),
                  }}
                />
              ) : (
                <li>No instructions listed.</li>
              )}
            </ul>
          </div>
        )}
        {activeTab === "ingredients" && (
          <div>
            <h2>Thành phần sản phẩm</h2>
            <ul>
              {product.ingredient ? (
                <li
                  dangerouslySetInnerHTML={{
                    __html: product.ingredient.name.replace(/\n/g, "<br />"),
                  }}
                />
              ) : (
                <li>No ingredient listed.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThongTinsp;
