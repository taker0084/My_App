import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";

type props = {
  setId: (id: number) => void;
};
export default function Header(props: props) {
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
          props.setId(json.user_id);
          setName(json["username"]);
        } else {
          setName("");
          navigate("/");
        }
      });
  }, [navigate, props]);
  useEffect(() => {
    handleCheck();
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#f9fed7",
        boxShadow: 0,
        // padding: { xs: 1, sm: 2 },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 左側にタイトル */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#003366",
            fontSize: { xs: "1rem", sm: "2rem" },
          }}
        >
          MetaBirth
        </Typography>

        {/* 未ログイン時のボタン */}
        {!Name && (
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              component={NavLink}
              to="/signup"
              sx={{
                color: "blue",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: "bold",
                marginLeft: { sm: 1 },
                "&:hover": {
                  backgroundColor: "#dde5ff", // ホバー時に少し青みがかる
                },
              }}
            >
              サインアップ
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              component={NavLink}
              to="/login"
              sx={{
                color: "blue",
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: "bold",
                ml: { xs: 1, sm: 2 },
                "&:hover": {
                  backgroundColor: "#dde5ff", // ホバー時に少し青みがかる
                },
              }}
            >
              ログイン
            </Button>
          </Box>
        )}

        {/* ログイン時の内容 */}
        {Name && (
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            sx={{
              flexWrap: "wrap",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              color="textPrimary"
              sx={{
                color: "#6b6b6b",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textAlign: "left",
                flexGrow: 1,
                ml: 2, // 名前を少し右に寄せる（左マージン）
              }}
            >
              ログイン中：{Name}さん
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              component={NavLink}
              to="/logout"
              sx={{
                backgroundColor: "white", // ボタンの背景を白に
                borderColor: "red", // ボタンの枠線を赤に
                color: "red", // 文字を青に
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "&:hover": {
                  backgroundColor: "#fed4d0", // ホバー時に少し青みがかる
                },
              }}
            >
              ログアウト
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
