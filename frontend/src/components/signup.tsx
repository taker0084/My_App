import { TextField } from "@mui/material";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:5001/auth/register/", {
      //mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: Username,
        password: Password,
        ConfirmPassword: ConfirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["message"] !== "Signup success") {
          alert(json["message"]);
        } else {
          navigate("/login");
        }
      });
  };
  return (
    <div>
      <form onSubmit={handlesubmit}>
        <label>Username</label>
        <TextField
          variant="outlined"
          name="username"
          value={Username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password</label>
        <TextField
          variant="outlined"
          name="password"
          type="password"
          value={Password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <TextField
          variant="outlined"
          name="confirm password"
          type="password"
          value={ConfirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button>signup</button>
      </form>
    </div>
  );
}
