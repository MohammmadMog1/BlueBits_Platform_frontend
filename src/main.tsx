import "./styles/index.css";
// يجب أن يسبق أي مكوّن يستدعي useTranslation – الاستيراد وحده يُهيّئ i18next
import "./shared/i18n";
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
