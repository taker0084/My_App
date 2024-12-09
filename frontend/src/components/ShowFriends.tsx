import {
  Box,
  Button,
  List,
  ListItemText,
  Paper,
  Typography,
  ListItemButton,
} from "@mui/material";
import FriendInfo from "./FriendInfo";
import { useEffect, useState } from "react";
import FriendRegistration from "./FriendRegister";
import Header from "./Header";

export default function ShowFriends() {
  const [id, setId] = useState("");
  const [friend_id, setFriend_id] = useState("");
  const [data, setData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(true);
  // リストのリフレッシュ
  const handleRefresh = () => {
    setRefreshKey(!refreshKey);
    setFriend_id("");
  };

  // 友達リストを取得
  const handleGetAll = () => {
    fetch("http://localhost:5001/friends", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json["status"] === "Success") {
          setData(json.friends);
          // setId(json.user_id);
        }
      });
  };
  const isUpcomingBirthday = (birthday: string) => {
    const today = new Date();
    const birthdayDate = new Date(birthday);

    // 今年の誕生日に設定
    birthdayDate.setFullYear(today.getFullYear());

    // すでに過ぎている場合は来年の誕生日をチェック
    if (birthdayDate < today) {
      birthdayDate.setFullYear(today.getFullYear() + 1);
    }

    // 日数の差を計算
    const diffTime = birthdayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 7 && diffDays >= 0;
  };

  useEffect(() => {
    // handleCheck();
    handleGetAll();
  }, [refreshKey]);

  return (
    <>
      <Header setId={() => setId} />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* サイドバー部分 */}
        <Box
          sx={{
            width: "30%",
            bgcolor: "#f4f6f8",
            borderRight: "1px solid #ddd",
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{
              textTransform: "none",
              fontSize: "16px",
              borderRadius: "8px",
              marginBottom: 2,
              width: "100%",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
            onClick={() => setFriend_id("")}
          >
            友達登録
          </Button>

          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            登録済み一覧
          </Typography>

          <Paper
            sx={{ maxHeight: 400, overflowY: "auto", borderRadius: "8px" }}
          >
            {data.length === 0 ? (
              <Typography variant="body1">No friends found.</Typography>
            ) : (
              <List>
                {data.map((friend) => (
                  <ListItemButton
                    key={friend["friend_id"]}
                    onClick={() => setFriend_id(friend["friend_id"])}
                    sx={{
                      marginBottom: 1,
                      borderRadius: "8px",
                      backgroundColor: isUpcomingBirthday(friend["birthday"])
                        ? "#fad3d3"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: isUpcomingBirthday(friend["birthday"])
                          ? "#ffccd2"
                          : "#ddd",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography>{friend["name"]}</Typography>
                          {isUpcomingBirthday(friend["birthday"]) && (
                            <Typography
                              component="span"
                              sx={{
                                color: "#ff0000",
                                marginLeft: 1,
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              (一週間以内)
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Paper>
        </Box>

        {/* プロフィール情報部分 */}
        <Box sx={{ flexGrow: 1 }}>
          {data.length === 0 || friend_id === "" ? (
            <FriendRegistration id={id} onSubmitsuccess={handleRefresh} />
          ) : (
            <FriendInfo id={friend_id} onSuccess={handleRefresh} />
          )}
        </Box>
      </Box>
    </>
  );
}
