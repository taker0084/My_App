import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
export default function User() {
  const [Name, setName] = useState("");
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
        if (json["username"] !== "") {
          setName(json["username"]);
        }
      });
  };
  useEffect(() => {
    handlecheck();
  });
  return (
    <div>
      {Name === "" ? (
        <>
          <NavLink to={"/signup"}>サインアップ</NavLink>
          <NavLink to={"/login"}>ログイン</NavLink>
        </>
      ) : (
        <>
          <label>{Name}</label>
          <NavLink to={"/logout"}>ログアウト</NavLink>
        </>
      )}
    </div>
  );
}
