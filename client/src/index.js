import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import 'antd/dist/antd.css';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import { thunk as ReduxThunk } from 'redux-thunk';
import Reducer from './_reducers';

// Redux DevTools Extension 연결 (있는 경우에만)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 스토어 생성: 미들웨어 + DevTools enhancer 함께 사용
const store = createStore(
  Reducer,
  composeEnhancers(applyMiddleware(promiseMiddleware, ReduxThunk))
);

// React 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
