import * as React from "react";
import { render } from "react-dom";
import { Facebook } from "./facebook";

import "./styles.css";

const App = () => (
  <div className="App">
    <h1>POC - Local logins with central validation</h1>
    <Facebook />
  </div>
);

const rootElement = document.getElementById("root");
render(<App />, rootElement);
