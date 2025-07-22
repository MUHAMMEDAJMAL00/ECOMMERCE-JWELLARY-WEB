// main.jsx or index.js
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./pages/App";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ScrollProvider } from "./context/ScrollContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ScrollProvider>
          <App />
        </ScrollProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
