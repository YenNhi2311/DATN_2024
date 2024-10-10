import React, { useState } from "react";
import ImageSearchBar from "../../component/ImageSearchBar";
import PhotoGrid from "../../component/user/PhotoGrid";
import "../../assets/css/photospage.css"; // Đảm bảo bạn có file CSS
import Img1 from "../../assets/img/avatar1.jpg";
import Img2 from "../../assets/img/logoYNB.webp";
import Img3 from "../../assets/img/logoYNB1.webp";

const initialPhotos = [
  { src: Img1 },
  { src: Img2 },
  { src: Img3 },
  { src: Img1 },
  { src: Img2 },
  { src: Img3 },
  { src: Img1 },
  { src: Img2 },
  { src: Img3 },
];

const PhotosPage = () => {
  const [photos, setPhotos] = useState(initialPhotos);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // const handleImageSearch = (uploadedImage) => {
  //   // Thực hiện tìm kiếm hình ảnh giống nhất
  //   // Đoạn mã này chỉ là minh họa, bạn cần tích hợp với thuật toán tìm kiếm hoặc API của riêng mình.
  //   const matchedPhotos = photos.filter((photo) => {
  //     // Thực hiện logic so sánh ảnh ở đây
  //     return photo.src.includes(uploadedImage);
  //   });

  //   setSearchResults(matchedPhotos);
  // };

  // const handleCancelSearch = () => {
  //   setSearchResults([]);
  // };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="photos-page">
      <div className="photos-header">
        <h2>
          Photos <span className="badge">{photos.length}</span>
        </h2>
      </div>
      <PhotoGrid
        photos={searchResults.length > 0 ? searchResults : photos}
        onImageClick={handleImageClick}
      />

      {selectedImage && (
        <div className="image-modal" onClick={handleCloseImage}>
          <img src={selectedImage.src} alt="Selected" className="modal-image" />
        </div>
      )}
    </div>
  );
};

export default PhotosPage;
