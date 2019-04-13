import * as React from "react";
import { render } from "react-dom";
import FacebookLogin from "react-facebook-login";

import "./styles.css";

const componentClicked = () => {
  console.log("component was clicked");
};

const responseFacebook = response => {
  console.log("response from facebook", response);
};

function App() {
  return (
    <div className="App">
      <h1>Facebook Login CodeSandbox</h1>
      <FacebookLogin
        appId="334372117215622"
        autoLoad={true}
        fields="name,email,picture"
        onClick={componentClicked}
        callback={responseFacebook}
      />
      ,
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
