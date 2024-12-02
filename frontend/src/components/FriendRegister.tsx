import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

type Props = {
  id: string;
  onSubmitsuccess: () => void;
};

export default function FriendRegistration(props: Props) {
  const userId = props.id;
  const navigate = useNavigate();
  const [friendName, setFriendName] = useState("");
  const [friendBirthday, setFriendBirthday] = useState("");
  const [age, setAge] = useState("");
  const [hobby, setHobby] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    fetch("http://localhost:5001/friends", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        friendName: friendName,
        friendBirthday: friendBirthday,
        Age: age,
        hobby: hobby,
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["message"] !== "Register success") {
          setErrorMessage(json["message"]);
        } else {
          setErrorMessage("");
          navigate("/User");
        }
        props.onSubmitsuccess();
        setLoading(false);
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: `url('/images/birthday-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      p={2}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: 4,
          mt: 15,
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            友達情報の入力
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
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
          >
            <TextField
              label="名前"
              variant="outlined"
              name="friendName"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              required
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              label="誕生日"
              variant="outlined"
              name="friendBirthday"
              type="date"
              value={friendBirthday}
              onChange={(e) => setFriendBirthday(e.target.value)}
              required
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: 1 }}
              inputProps={{ type: "date" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="年齢"
              variant="outlined"
              name="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
              label="趣味"
              variant="outlined"
              name="Hobby"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              // required
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 1,
                padding: "10px",
                fontSize: "1rem",
                textTransform: "none",
                backgroundColor: "#3f51b5",
                "&:hover": {
                  backgroundColor: "#303f9f",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "登録"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
