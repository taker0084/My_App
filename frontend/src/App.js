import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import React from "react";
import Logout from "./components/logout";
import Root from "./components/root";
import ShowFriends from "./components/ShowFriends";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/user" element={<ShowFriends />} />
      </Routes>
    </div>
  );
}

export default App;
