import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import User from "./components/User";
import React from "react";
import Logout from "./components/logout";

function App() {
  return (
    <div>
      <h1>Hello</h1>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
