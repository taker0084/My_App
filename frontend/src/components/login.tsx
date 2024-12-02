import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:5001/session", {
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
          setErrorMessage(json["message"]); // エラーメッセージを設定
        } else {
          setErrorMessage(""); // エラーメッセージをリセット
          navigate("/User");
        }
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={4}
    >
      <Typography variant="h5" component="h1" gutterBottom color="primary">
        ログイン
      </Typography>

      {errorMessage && ( // エラーメッセージがある場合のみ表示
        <Alert
          severity="error"
          sx={{ mb: 2, width: "100%", maxWidth: "400px" }}
        >
          {errorMessage}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        maxWidth="400px"
      >
        <TextField
          label="Username"
          variant="outlined"
          name="username"
          value={Username}
          required
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          value={Password}
          required
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          ログイン
        </Button>
      </Box>
    </Box>
  );
}
