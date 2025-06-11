import React, { useState } from "react";
import WeatherApp from "./index";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setLoginError("");
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (err) {
      setLoginError("Something went wrong");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        setIsSignup(false); // Switch to login after successful signup
        setLoginError("");
      } else {
        setLoginError(data.message || "Signup failed");
      }
    } catch (err) {
      console.log(err, "error message");
      setLoginError("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div className="App">
      {!token ? (
        <div style={{ padding: 20 }}>
          <h2>{isSignup ? "Signup" : "Login"}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {isSignup ? (
            <button onClick={handleSignup}>Signup</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
          {loginError && <p style={{ color: "red" }}>{loginError}</p>}
          <p style={{ marginTop: 10 }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              style={{ fontSize: 14 }}
            >
              {isSignup ? "Login" : "Signup"}
            </button>
          </p>
        </div>
      ) : (
        <>
          <button onClick={handleLogout} style={{ margin: 20 }}>
            Logout
          </button>
          <WeatherApp token={token} />
        </>
      )}
    </div>
  );
}

export default App;
