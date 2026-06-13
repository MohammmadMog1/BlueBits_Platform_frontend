import "./styles/index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./app/store/store";
import AppRouter from "./app/routes/AppRouter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AppRouter />

  </Provider>,
);
