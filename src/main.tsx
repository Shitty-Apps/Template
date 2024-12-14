import React from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/config';
import App from './App';
import createStore from './heplers/create-store';
import envConfig from './config/configuration';
import { StoreProvider } from './heplers/store-context';

const container = document.getElementById('root');
const root = createRoot(container!);
const { rootStore, env } = createStore({ envConfig });
root.render(
  <React.StrictMode>
    <StoreProvider value={rootStore}>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
