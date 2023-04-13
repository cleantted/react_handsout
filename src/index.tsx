import React from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import "./styles.css";

import App from "./App";

// const root = createRoot(document.getElementById("root") as HTMLElement);
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);