import React, { useState } from "react";
import "../assets/css/component/imagesearchbar.css";

const ImageSearchBar = ({ onImageSearch, onCancelSearch }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onImageSearch(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setImage(null);
    onCancelSearch(); // Gọi hàm để hủy tìm kiếm
  };

  return (
    <div className="image-search-bar">
      <label htmlFor="image-upload" className="image-upload-label">
        <i className="fa fa-upload"></i> Upload Image to Search
      </label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleImageUpload}
        className="image-upload-input"
      />
      {image && (
        <div className="uploaded-image-preview">
          <img src={image} alt="Uploaded Preview" />
          <button className="cancel-search-btn" onClick={handleCancel}>
            Cancel Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSearchBar;
