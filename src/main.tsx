import React from 'react';
import App from './App';
import createStore from './helpers/create-store';
import envConfig from './config/configuration';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './helpers/store-context';

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
