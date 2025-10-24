import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import "./styles/tailwind.css";
import { Provider } from 'react-redux'
import { store } from '@/redux/store';
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/config/react-query-client'
import { ToastProvider } from "@/components/common/ToastProvider";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastProvider />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
