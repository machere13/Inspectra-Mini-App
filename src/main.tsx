import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import '@vkontakte/vkui/dist/vkui.css';
import { App, AuthProvider } from '@app/index';
import { store } from '@app/store';

const root = document.getElementById('root');
if (!root) throw new Error('#root element is missing');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <AdaptivityProvider>
          <AppRoot>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
);
