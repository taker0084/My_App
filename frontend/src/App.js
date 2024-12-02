import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import User from "./components/User";
import React from "react";
import Logout from "./components/logout";
import Root from "./components/root";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
