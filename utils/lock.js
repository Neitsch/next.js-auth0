import { setSecret } from "./auth";
import { authenticated } from "./auth";

import uuid from "uuid";

const getLock = options => {
  const config = require("../config.json");
  const Auth0Lock = require("auth0-lock").default;
  return new Auth0Lock(
    config.AUTH0_CLIENT_ID,
    config.AUTH0_CLIENT_DOMAIN,
    options
  );
};

const getBaseUrl = () => `${window.location.protocol}//${window.location.host}`;

const getOptions = container => {
  const secret = uuid.v4();
  setSecret(secret);
  return {
    container,
    closable: false,
    auth: {
      responseType: "token id_token",
      redirectUrl: `${getBaseUrl()}/auth/signed-in`,
      params: {
        scope: "openid profile email",
        state: secret
      }
    }
  };
};

export const show = container => {
  const lock = getLock(getOptions(container));
  lock.on("authenticated", function(authResult) {
    authenticated(authResult.idToken);
  });
  return lock.show();
};
export const logout = () => getLock().logout({ returnTo: getBaseUrl() });
export const finishAuthFlow = () =>
  getLock().resumeAuth(window.location.hash, function(error, authResult) {
    authenticated(authResult.idToken);
  });
export const tryReauth = () => {
  const lock = getLock();
  lock.checkSession({}, function(error, authResult) {
    if (error) {
      return;
    }
    // Why is the idToken null?
    authenticated(authResult.idToken, window.location.pathname);
  });
};
