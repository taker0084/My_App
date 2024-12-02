import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Typography,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { Edit, Delete, HelpOutline } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import React from "react";

type Props = {
  id: string;
  onSuccess: () => void;
};

// const DialogWindow = React.memo(({ open, onClose, onConfirm }) => {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>確認</DialogTitle>
//       <DialogContent>
//         <DialogContentText>削除しますか？</DialogContentText>
//       </DialogContent>
//       <CardActions>
//         <Button onClick={onClose}>キャンセル</Button>
//         <Button onClick={onConfirm} color="error">
//           削除
//         </Button>
//       </CardActions>
//     </Dialog>
//   );
// }))
export default function FriendInfo(props: Props) {
  const [friendName, setFriendName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [age, setAge] = useState("");
  const [gift, setGift] = useState("");
  const [hobby, setHobby] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleGetInfo = useCallback(() => {
    fetch(`http://localhost:5001/friends/${props.id}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setFriendName(json.friend.name);
        setBirthday(format(new Date(json.friend.birthday), "yyyy-MM-dd"));
        setAge(json.friend.age);
        setHobby(json.friend.hobby);
        setGift(json.friend.gift);
      });
  }, [props.id]);

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(`http://localhost:5001/friends/${props.id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friendName: friendName,
        birthday: birthday,
        age: age,
        hobby: hobby,
        gift: gift,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message !== "Update success") {
          setErrorMessage(json.message); // Set error message
        } else {
          setFriendName("");
          setBirthday("");
          setAge("");
          setHobby("");
          setGift("");
          setErrorMessage(""); // Reset error message
        }
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:5001/friends/${props.id}`, {
      method: "DELETE",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message !== "Delete success") {
          setErrorMessage(json.message); // Set error message
        } else {
          setFriendName("");
          setBirthday("");
          setAge("");
          setHobby("");
          setGift("");
          setErrorMessage(""); // Reset error message
        }
        props.onSuccess();
      });
  };

  const handleSuggest = () => {
    fetch(`http://localhost:5001/friends/${props.id}/gift`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setHobby(json.hobby);
        setGift(json.gift);
      });
  };

  useEffect(() => {
    handleGetInfo();
  }, [handleGetInfo]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f0f4f8"
      p={4}
    >
      <Card sx={{ maxWidth: 600, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" gutterBottom>
            友達情報
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleChange}
          >
            <TextField
              label="Friend Name"
              variant="outlined"
              value={friendName}
              required
              onChange={(e) => setFriendName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Birthday"
              variant="outlined"
              type="date"
              value={birthday}
              required
              onChange={(e) => setBirthday(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Age"
              variant="outlined"
              type="number"
              value={age}
              required
              onChange={(e) => setAge(e.target.value)}
              fullWidth
            />
            <TextField
              label="Hobby"
              variant="outlined"
              value={hobby}
              // required
              onChange={(e) => setHobby(e.target.value)}
              fullWidth
            />
            <TextField
              label="Gift"
              variant="outlined"
              value={gift}
              onChange={(e) => setGift(e.target.value)}
              fullWidth
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Edit />}
              >
                Save Changes
              </Button>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  startIcon={<HelpOutline />}
                  onClick={handleSuggest}
                >
                  AI Suggest
                </Button>
                <Tooltip title="詳細を表示" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setOpenDialog(true)}
                    sx={{ ml: 1 }}
                  >
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>
            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              aria-labelledby="ai-suggest-dialog-title"
            >
              <DialogTitle id="ai-suggest-dialog-title">
                AIサジェスト機能について
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Typography paragraph>
                    AIサジェスト機能は、友達の趣味や年齢に基づいて最適なプレゼントを提案します。
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    機能の特徴：
                  </Typography>
                  <ul>
                    <li>趣味が未設定の場合、AIが年齢に応じた趣味を提案</li>
                    <li>
                      趣味と年齢を考慮した、パーソナライズされたギフト提案
                    </li>
                    <li>毎回異なる提案を生成</li>
                  </ul>
                  <Typography variant="subtitle2" color="text.secondary">
                    ※提案内容はAIによる参考情報です
                  </Typography>
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Tooltip title="Delete Friend" arrow>
            <IconButton
              color="error"
              onClick={handleDelete}
              aria-label="delete"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
}
