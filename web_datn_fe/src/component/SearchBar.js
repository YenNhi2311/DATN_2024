import React from "react";
import "../assets/css/component/searchbar.css"; // Đảm bảo bạn có file CSS cho các style của search bar

const SearchBar = ({ placeholder = "search...", onSearch }) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="search_wrap">
      <div className="search_box">
        <input type="text" className="input" placeholder={placeholder} />
        <div className="btn btn_common" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
