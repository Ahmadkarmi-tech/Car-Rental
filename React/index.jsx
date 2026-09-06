import ReactDOM from "react-dom/client";

import App from "./APP.jsx";
import "../style.css";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App></App>);