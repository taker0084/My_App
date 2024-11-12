import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import React from "react";

export default function Logout() {
  const navigate = useNavigate();
  const handlelogout = () => {
    fetch("http://localhost:5001/auth/logout/", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["message"] !== "Logout success") {
          alert(json["message"]);
        } else {
          navigate("/");
        }
      });
  };
  return (
    <div>
      <label>ログアウトしますか？</label>
      <Button onClick={handlelogout}>ログアウト</Button>
      <Button onClick={() => navigate("/User")}>戻る</Button>
    </div>
  );
}
