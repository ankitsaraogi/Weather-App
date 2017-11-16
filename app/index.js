import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "../src/core/store/store.js";
import Route from './route';
import 'semantic-ui-css/semantic.min.css';
import './middleware';

function AppMainDom() {
    return (
      <Provider store={Store}>
        <div>
          <Route />
        </div>
      </Provider>
    );
} 
   
ReactDOM.render(
  <AppMainDom />,
  document.querySelector("#weatherApp")
);
