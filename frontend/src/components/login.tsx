import { useState } from "react";

export default function Login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch("http://localhost:5002/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: Username,
        Password: Password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful");
          window.location.href = "/";
        } else {
          alert("Login failed");
        }
      });
  };
  return(
    
  )
}
