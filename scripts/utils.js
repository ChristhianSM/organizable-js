import Home from "./components/Home.js";
import Profile from "./components/Profile.js";
import Trash from "./components/Trash.js";
import { appKey } from "./config.js";

export function fromLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(appKey)) || {};
  return data[key];
}

export function saveToLocalStorage(key, value) {
  let data = JSON.parse(localStorage.getItem(appKey)) || {};
  data = { ...data, [key]: value };
  localStorage.setItem(appKey, JSON.stringify(data));
}

export const routerComponents = {
  home: Home,
  trash: Trash,
  profile: Profile
}  