import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:5001/auth/login/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username: Username,
        password: Password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["message"] !== "Login success") {
          alert(json["message"]);
        } else {
          navigate("/User");
        }
      });
  };
  return (
    <div>
      <form onSubmit={handlesubmit}>
        <label>Username</label>
        <input
          value={Username}
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <input
          value={Password}
          name="password"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>login</button>
      </form>
    </div>
  );
}
