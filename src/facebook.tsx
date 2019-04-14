import * as React from "react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import { CentralUserInfo, facebookLoginValidation } from "./server";

const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID || "";

console.log("appid", facebookAppId);

interface CentralUserInfoState {
  error?: Error;
  userInfo?: CentralUserInfo;
}

interface FacebookState {
  accessToken?: string;
  centralUserInfo?: CentralUserInfoState;
}

export class Facebook extends React.Component<{}, FacebookState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  responseFromFacebook = (response: ReactFacebookLoginInfo) => {
    this.setState({ accessToken: response.accessToken });
    this.validateFacebookLoginWithPOCServer(response.accessToken);
  };

  validateFacebookLoginWithPOCServer = async (facebookAccessToken: string) => {
    try {
      const userInfo = await facebookLoginValidation(facebookAccessToken);
      this.setState({ centralUserInfo: { userInfo } });
    } catch (error) {
      this.setState({
        centralUserInfo: { error }
      });
    }
  };

  renderFacebookLoginButton = () => (
    <div>
      <FacebookLogin
        appId={facebookAppId}
        autoLoad={true}
        callback={this.responseFromFacebook}
      />
    </div>
  );

  renderLocalFacebookLoginInfo = () => (
    <div>
      <p>We got a user token from a local facebook login</p>
    </div>
  );

  renderCentralLoginInfo = (facebookCentralUserInfo: CentralUserInfoState) => {
    if (facebookCentralUserInfo.error) {
      return (
        <div>
          <p>{`Error: ${facebookCentralUserInfo.error}`}</p>
        </div>
      );
    }
    if (facebookCentralUserInfo.userInfo) {
      return (
        <div>
          <h3>Facebook User Info from our POC server</h3>
          <div>
            <img src={facebookCentralUserInfo.userInfo.picture.url} />
            <p>{facebookCentralUserInfo.userInfo.name}</p>
            <p>{facebookCentralUserInfo.userInfo.email}</p>
          </div>
        </div>
      );
    }
    return <div>Unknown error occurred</div>;
  };

  render() {
    const {
      accessToken: facebookAccessToken,
      centralUserInfo: facebookCentralUserInfo
    } = this.state;

    return (
      <div>
        <h3>Facebook Login with central validation</h3>

        {facebookAccessToken
          ? this.renderLocalFacebookLoginInfo()
          : this.renderFacebookLoginButton()}

        {facebookCentralUserInfo &&
          this.renderCentralLoginInfo(facebookCentralUserInfo)}
      </div>
    );
  }
}
