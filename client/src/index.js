import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext/AuthContextProvider';
import DataContextProvider from './context/DataContext/DataContexProvider';
import UserContextProvider from './context/UserContext/UserContextProvider';

ReactDOM.render(
  <BrowserRouter>
    <AuthContextProvider>
      <UserContextProvider>
        <DataContextProvider>
          <App />
        </DataContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
