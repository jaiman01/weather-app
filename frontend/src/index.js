import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

function WeatherApp({ token }) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/weather`,
        {
          params: { q: city },
          headers: {
            Authorization: `Bearer ${token}`, // Assuming you have a token for authentication
          },
        }
      );
      console.log("token", token);
      setWeather(response.data);
    } catch (err) {
      setError("City not found or something went wrong.");
      console.error(
        "Error fetching weather data:",
        err.response ? err.response.data : err.message
      );
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Weather App</h2>
      <input
        type="text"
        value={city}
        placeholder="Enter city (e.g., Jaipur)"
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: 20 }}>
          <h3>
            {weather.location.name}, {weather.location.country}
          </h3>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <p>Condition: {weather.current.condition.text}</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind: {weather.current.wind_kph} kph</p>
          <img src={weather.current.condition.icon} alt="icon" />
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
