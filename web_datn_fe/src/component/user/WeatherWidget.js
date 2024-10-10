import React, { useEffect, useState } from "react";
import "../../assets/css/weather.css";
const weatherDescriptions = {
  "clear sky": "trời quang đãng",
  "few clouds": "ít mây",
  "scattered clouds": "mây rải rác",
  "broken clouds": "mây bị che khuất",
  "shower rain": "mưa rào",
  rain: "mưa",
  thunderstorm: "dông bão",
  snow: "tuyết",
  mist: "sương mù",
  // Thêm các mô tả thời tiết khác nếu cần
};

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy tọa độ của người dùng
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (err) => {
            console.error("Lỗi khi lấy vị trí địa lý:", err);
            setError("Không thể lấy vị trí của bạn.");
          }
        );
      } else {
        setError("Trình duyệt của bạn không hỗ trợ vị trí địa lý.");
      }
    };

    // Gọi API thời tiết sau khi có tọa độ
    const fetchWeather = async () => {
      if (latitude && longitude) {
        const API_KEY = "ef6baeb5f5d6a85f7f97becd8a832939";
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          console.error("Lỗi khi lấy dữ liệu thời tiết:", err);
          setError("Lỗi khi lấy dữ liệu thời tiết.");
        }
      }
    };

    getUserLocation();
    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  if (error) return <p>{error}</p>;
  if (!weatherData) return <p>Đang tải dữ liệu thời tiết...</p>;

  // Dịch mô tả thời tiết sang tiếng Việt
  const weatherDescription =
    weatherDescriptions[weatherData.weather[0].description] ||
    weatherData.weather[0].description;

  return (
    <div className="weather-widget">
      <h5>Dự báo thời tiết</h5>
      <p>Vị trí: {weatherData.name}</p>
      <p>Nhiệt độ: {weatherData.main.temp}°C</p>
      <p>Thời tiết: {weatherDescription}</p>
    </div>
  );
};

export default WeatherWidget;
