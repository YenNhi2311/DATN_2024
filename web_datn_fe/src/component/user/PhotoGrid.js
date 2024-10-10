import React from "react";
import "../../assets/css/photogrid.css";

const PhotoGrid = ({ photos, onImageClick }) => {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="photo-grid-item"
          onClick={() => onImageClick(photo)}
        >
          <img src={photo.src} alt={`Photo ${photo.id}`} />
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
