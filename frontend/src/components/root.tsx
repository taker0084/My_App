import { NavLink, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Header from "./Header";

export default function Root() {
  const navigate = useNavigate();
  const [Name, setName] = useState("");
  const [Id, setId] = useState(null);
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
        }
      });
  }, []);
  useEffect(() => {
    handleCheck();
  }, [handleCheck]);
  return (
    <>
      <Header setId={() => setId} />
      {Name ? (
        navigate("/User")
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          position="relative" // 親要素の位置を指定
          p={4}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url('/images/background.jpg')`, // 背景画像のパス
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.5, // 透過度を指定（0:完全透明〜1:不透明）
              zIndex: -1, // 背景を前面の要素の後ろに配置
            }}
          ></Box>
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
