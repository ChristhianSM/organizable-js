import { idUser, tokenKey } from "../config.js";
import { apiFetch } from "./api-fetch.js";

export async function login(credentials = {email, password}) {
  const { token, ...user } = await apiFetch("login", {body: credentials});
  sessionStorage.setItem(tokenKey, token);

  return user
}

export async function logout() {
  try {
    // await apiFetch("logout", {method: "POST"});
    sessionStorage.removeItem(tokenKey);
    sessionStorage.removeItem(idUser);
  } catch (error) {
    console.log(error);
  }
}
