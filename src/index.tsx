import * as React from "react";
import { render } from "react-dom";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";

import "./styles.css";

const facebookAppId = "334372117215622";
const onlineServer =
  "https://poc-facebook-central-login-git-master.rcacheira.now.sh";
// const onlineServer = "http://localhost:3001/authenticate";

interface CentralLoginInfo {
  error?: number;
  userInfo?: {
    email: string;
    name: string;
    picture: { height: number; width: number; url: string };
  };
}

interface AppState {
  facebookAccessToken?: string;
  centralLoginInfo?: CentralLoginInfo;
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  responseFacebook = (response: ReactFacebookLoginInfo) => {
    this.setState({ facebookAccessToken: response.accessToken });
    this.validateLoginOnline(response.accessToken);
  };

  validateLoginOnline = async (facebookAccessToken: string) => {
    const response = await fetch(onlineServer, {
      method: "GET",
      headers: {
        "X-FacebookAccessToken": facebookAccessToken
      }
    });
    if (response.status !== 200) {
      this.setState({ centralLoginInfo: { error: response.status } });
      return;
    }
    const resp = await response.json();
    this.setState({ centralLoginInfo: { userInfo: resp } });
  };

  renderFacebookLoginButton = () => (
    <div>
      <FacebookLogin
        appId={facebookAppId}
        autoLoad={true}
        callback={this.responseFacebook}
      />
    </div>
  );

  renderLocalFacebookLoginInfo = () => (
    <div>
      <h3>We got a user token from a local facebook login</h3>
    </div>
  );

  renderCentralLoginInfo = (centralLoginInfo: CentralLoginInfo) => {
    if (centralLoginInfo.error) {
      return (
        <div>
          <p>{`Error: ${centralLoginInfo.error}`}</p>
        </div>
      );
    }
    if (centralLoginInfo.userInfo) {
      return (
        <div>
          <h2>Facebook User Info from our POC server</h2>
          <div>
            <img src={centralLoginInfo.userInfo.picture.url} />
            <p>{centralLoginInfo.userInfo.name}</p>
            <p>{centralLoginInfo.userInfo.email}</p>
          </div>
        </div>
      );
    }
    return <div>Unknown error occurred</div>;
  };

  render() {
    const { facebookAccessToken, centralLoginInfo } = this.state;

    return (
      <div className="App">
        <h1>POC - Facebook Login with central validation</h1>

        {facebookAccessToken
          ? this.renderLocalFacebookLoginInfo()
          : this.renderFacebookLoginButton()}

        {centralLoginInfo && this.renderCentralLoginInfo(centralLoginInfo)}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
