import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ShowFriends from "./ShowFriends";
export default function User() {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const handleCheck = useCallback(() => {
    fetch("http://localhost:5001/session", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["username"] !== "") {
          setName(json["username"]);
        } else navigate("/login");
      });
  }, [navigate]);
  useEffect(() => {
    handleCheck();
  }, [handleCheck]);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="#f0f0f0"
        p={2}
        borderRadius={2}
        boxShadow={2}
      >
        <Typography variant="body1" fontWeight="bold" color="textPrimary">
          ログイン中：{Name}さん
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          component={NavLink}
          to="/logout"
          sx={{ ml: 2 }}
        >
          ログアウト
        </Button>
      </Box>
      <ShowFriends />
    </>
  );
}
