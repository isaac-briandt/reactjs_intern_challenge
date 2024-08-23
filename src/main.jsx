import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import mirageServer from "./mirage/index.js";
import store from "./app/store";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';


mirageServer();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
);
