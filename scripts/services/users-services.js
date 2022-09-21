import { tokenKey } from "../config.js";
import { apiFetch } from "./api-fetch.js";

export async function createUser(newUser = { email, password, firstname, lastname, phone }) {
  const { token, ...user } = await apiFetch("signup", {body: newUser});
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function signUp(credentials = { username, email, firstName, lastName, password }) {
  const { token, ...user } = await apiFetch("users", { body: credentials });
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function getUser(idUser) {
  const { token, ...user } = await apiFetch(`users/${idUser}`);
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function updateAccount(credentials = { username, email, first_name, last_name }, idUser) {
  const { token, ...user } = await apiFetch(`users/${idUser}`, { body: credentials, method: "PATCH" });
  sessionStorage.setItem(tokenKey, token);

  // Aqui devolvemos user sin el token
  return user;
}

export async function deleteAccount(idUser) {
  await apiFetch(`users/${idUser}`, { method: "DELETE" });
}