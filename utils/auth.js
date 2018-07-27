import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
import Router from "next/router";

export const setToken = token => {
  if (!process.browser) {
    return;
  }
  Cookie.set("user", jwtDecode(token));
  Cookie.set("jwt", token);
};

export const unsetToken = () => {
  if (!process.browser) {
    return;
  }
  Cookie.remove("jwt");
  Cookie.remove("user");
  Cookie.remove("secret");

  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
};

export const getUserFromServerCookie = req => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(";")
    .find(c => c.trim().startsWith("jwt="));
  if (!jwtCookie) {
    return undefined;
  }
  const jwt = jwtCookie.split("=")[1];
  return jwtDecode(jwt);
};

export const getUserFromLocalCookie = () => {
  return Cookie.getJSON("user");
};

export const setSecret = secret => Cookie.set("secret", secret);

export const checkSecret = secret => Cookie.get("secret") === secret;

export const authenticated = (token, redirect = "/") => {
  setToken(token);
  Router.push(redirect);
};
