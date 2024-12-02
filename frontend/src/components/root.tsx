import { NavLink, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function Root() {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const handlecheck = () => {
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
        }
      });
  };
  useEffect(() => {
    handlecheck();
  });
  return (
    <>
      {Name ? (
        navigate("/User")
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="#f5f5f5"
          p={4}
        >
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            ようこそ MetaBirthへ
          </Typography>

          <Box textAlign="center" maxWidth="600px">
            <Typography
              variant="h6"
              component="p"
              fontWeight="bold"
              gutterBottom
            >
              MetaBirthとは？
            </Typography>

            <Typography
              variant="body1"
              component="p"
              color="textSecondary"
              paragraph
            >
              MetaBirthは、友達の誕生日を管理・プレゼントを提案するサービスです。
            </Typography>

            <Typography
              variant="body1"
              component="p"
              fontWeight="bold"
              color="textSecondary"
              gutterBottom
            >
              MetaBirthを使うには、ログインが必要です。
            </Typography>

            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              <Button
                component={NavLink}
                to="/signup"
                variant="contained"
                color="primary"
                style={{ textDecoration: "none" }}
              >
                サインアップ
              </Button>
              <Button
                component={NavLink}
                to="/login"
                variant="outlined"
                color="primary"
                style={{ textDecoration: "none" }}
              >
                ログイン
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
