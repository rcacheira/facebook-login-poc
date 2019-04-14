export const serverHostname = process.env.REACT_APP_SERVER_HOSTNAME;

export interface CentralUserInfo {
  email: string;
  name: string;
  picture: { height: number; width: number; url: string };
}

export const facebookLoginValidation = async (
  accessToken: string
): Promise<CentralUserInfo> => {
  const url = `${serverHostname}/authenticateFacebook`;
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-FacebookAccessToken": accessToken
    }
  });
  if (response.status !== 200) {
    throw new Error(`fetch failed with http status code: ${response.status}`);
  }
  return response.json();
};

export const googleLoginValidation = async (
  accessToken: string
): Promise<CentralUserInfo> => {
  const response = await fetch(`${serverHostname}/authenticateGoogle`, {
    method: "GET",
    headers: {
      "X-GoogleAccessToken": accessToken
    }
  });
  if (response.status !== 200) {
    throw new Error(`fetch failed with http status code: ${response.status}`);
  }
  return await response.json();
};
