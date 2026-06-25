import "./styles/index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store/store";
import App from "./App"; // استيراد كامبوننت App الجديد

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
);
