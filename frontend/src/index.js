import React from "react";
import { createRoot } from "react-dom/client";
import { io } from "socket.io-client";
import "./global.scss";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

export const socket = io("ws://localhost:8001");
