// // src/main.tsx
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./styles/tailwind.css";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./routes";
// import { Provider } from 'react-redux'
// import { store } from '@/redux/store';


// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </StrictMode >
// );
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux'
import { store } from '@/redux/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
