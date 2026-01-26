import { Refine } from "@refinedev/core";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, App as AntdApp, theme as antdTheme } from "antd";
import { store } from './store/store'
import "@refinedev/antd/dist/reset.css";
import App from './App.jsx'
import { authProvider } from "./providers/auth/authProvider";
import { i18nProvider } from "./translations/i18nProvider";
import routerProvider from "@refinedev/react-router";
import { makeDataProvider } from "./providers/dataProvider";
import { api } from "./api/axiosApi";
import { API_URL } from "./config/env";

const { darkAlgorithm, compactAlgorithm } = antdTheme;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider theme={{
          algorithm: [darkAlgorithm, compactAlgorithm],
          cssVar: { key: 'app' }
        }}>
          <AntdApp>
            <Refine
              options={{ disableTelemetry: true }}
              routerProvider={routerProvider}
              dataProvider={makeDataProvider(api, API_URL)}
              authProvider={authProvider}
              resources={[]}
              i18nProvider={i18nProvider}
            >
              <App />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
