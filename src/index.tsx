import * as React from "react";
import { render } from "react-dom";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";

import "./styles.css";

const facebookAppId = "334372117215622";
const onlineServer =
  "https://poc-facebook-central-login-git-master.rcacheira.now.sh";

interface AppState {
  facebookLoginInfo?: ReactFacebookLoginInfo;
  onlineLoginInfo?: { error: number };
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  responseFacebook = (response: ReactFacebookLoginInfo) => {
    this.setState({ facebookLoginInfo: response });
  };

  validateLoginOnline = async () => {
    if (!this.state.facebookLoginInfo) {
      return;
    }

    const response = await fetch(onlineServer, {
      method: "GET",
      headers: {
        "X-FacebookAccessToken": this.state.facebookLoginInfo.accessToken
      }
    });
    if (response.status !== 200) {
      this.setState({ onlineLoginInfo: { error: response.status } });
      return;
    }
    const resp = await response.json();
    this.setState({ onlineLoginInfo: resp });
  };

  render() {
    const { facebookLoginInfo, onlineLoginInfo } = this.state;

    return (
      <div className="App">
        <h1>Facebook Login</h1>
        {!facebookLoginInfo && (
          <div>
            <FacebookLogin
              appId={facebookAppId}
              autoLoad={true}
              fields="name,email,picture"
              callback={this.responseFacebook}
            />
          </div>
        )}
        {facebookLoginInfo && (
          <>
            <h2>Facebook User Info</h2>
            <div>
              <img src={(facebookLoginInfo as any).picture.data.url} />
              <p>{facebookLoginInfo.name}</p>
              <p>{facebookLoginInfo.email}</p>
            </div>
            <div>
              <button type="button" onClick={this.validateLoginOnline}>
                Validate online
              </button>
            </div>
            {onlineLoginInfo && <div>{JSON.stringify(onlineLoginInfo)}</div>}
          </>
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
