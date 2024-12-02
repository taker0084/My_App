import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar control

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      setError("パスワードが一致しません");
      setOpenSnackbar(true);
      return;
    }

    fetch("http://localhost:5001/users", {
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
          setError(json["message"]);
          setOpenSnackbar(true);
        } else {
          navigate("/login");
        }
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
        サインアップ
      </Typography>

      {/* Display error message if any */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          name="confirm password"
          type="password"
          value={ConfirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          サインアップ
        </Button>
      </Box>

      {/* Snackbar for temporary error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error || "エラーが発生しました"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
