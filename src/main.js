import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdaptivityProvider, ConfigProvider, AppRoot } from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import App from './App';

// Инициализация
bridge.send('VKWebAppInit', {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider bridge={bridge}>
    <AdaptivityProvider>
      <AppRoot mode="full">
        <App />
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>
);