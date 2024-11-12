import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
export default function User() {
  const [IsLogin, setIsLogin] = useState("False");
  const handlecheck = () => {
    fetch("http://localhost:5001/auth/check/", {
      method: "GET",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json["user_id"] !== "") {
          setIsLogin("True");
        }
      });
  };
  useEffect(() => {
    handlecheck();
  });
  return (
    <div>
      {IsLogin === "False" ? (
        <>
          <NavLink to={"/signup"}>サインアップ</NavLink>
          <NavLink to={"/login"}>ログイン</NavLink>
        </>
      ) : (
        <NavLink to={"/logout"}>ログアウト</NavLink>
      )}
    </div>
  );
}
