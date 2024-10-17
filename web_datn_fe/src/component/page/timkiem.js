import axios from "axios";
import React, { Component } from "react";

export default class TimKiem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      suggestions: [],
    };
  }

 // Method to fetch search suggestions
fetchSuggestions = async (query) => {
  if (query.length > 2) {
    try {
      // Mã hóa ký tự tiếng Việt trước khi gửi
      const encodedQuery = encodeURIComponent(query);

      // Gửi yêu cầu tìm kiếm đến API
      const response = await axios.get(`http://localhost:8080/api/home/products/search?q=${encodedQuery}`);

      // Cập nhật danh sách gợi ý với kết quả từ API
      this.setState({ suggestions: response.data });
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
  } else {
    // Xóa danh sách gợi ý nếu chuỗi tìm kiếm quá ngắn
    this.setState({ suggestions: [] });
  }
};


  // Handle input change and fetch suggestions
  handleInputChange = (event) => {
    const query = event.target.value;
    this.setState({ searchTerm: query });
    this.fetchSuggestions(query);
  };

  render() {
    const { searchTerm, suggestions } = this.state;

    return (
      <div className="position-relative mx-auto">
        <input
          className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={this.handleInputChange}
        />
        <button
          type="submit"
          className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
          style={{ top: "0", right: "25%" }}
        >
          Tìm kiếm
        </button>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li key={suggestion.product.productId}>
                <img src={suggestion.productDetails.imageUrl} alt={suggestion.product.name} />
                <span>{suggestion.product.name}</span>
                <span>{suggestion.productDetails.price} đ</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
