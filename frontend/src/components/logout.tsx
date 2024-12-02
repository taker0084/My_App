import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import React from "react";

export default function Logout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("http://localhost:5001/session", {
      method: "DELETE",
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#f0f0f0"
      p={3}
      borderRadius={2}
      boxShadow={3}
      textAlign="center"
      maxWidth={400}
      mx="auto"
    >
      <Typography variant="h6" fontWeight="bold" mb={2} color="textPrimary">
        ログアウトしますか？
      </Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="error" onClick={handleLogout}>
          ログアウト
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/User")}
        >
          戻る
        </Button>
      </Box>
    </Box>
  );
}
