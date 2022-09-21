import { router } from "../app.js";
import Home from "../components/Home.js";
import Modal from "../components/Modal.js";
import Profile from "../components/Profile.js";
import Trash from "../components/Trash.js";
import DOMHandler from "../dom-handler.js";
import { logout } from "../services/session-services.js";
import STORE from "../store.js";
import { routerComponents } from "../utils.js";
import LoginPage from "./login-page.js";

function render () {
  const { currentTab } = STORE;
  return `
  <div class = "flex">
    <aside class = "aside">
      <img src = "assets/icons/logo-organizable.svg" class = "logo mb-4">
      <div class = "links flex flex-column gap-4">
        <div class = "flex gap-2 link ${currentTab === "home" ? "active" : ""}" data-page = "home">
          <img src = "assets/icons/icon-board.svg">
          <p class = "link-title">My Boards</p>
        </div>
        <div class = "flex gap-2 link ${currentTab === "trash" ? "active" : ""}" data-page = "trash">
          <img src = "assets/icons/icon-trash.svg">
          <p class = "link-title">Closed Boards</p>
        </div>
        <div class = "flex gap-2 link ${currentTab === "profile" ? "active" : ""}" data-page = "profile">
          <img src = "assets/icons/icon-profile.svg">
          <p class = "link-title">My Profile</p>
        </div>
      </div>

      <div>
        <div class = "flex gap-2 link logout js-logout">
          <img src = "assets/icons/icon-logout.svg">
          <p class = "link-title">Log out</p>
        </div>
      </div>
    </aside>
    <div class = "section container-page-boards">
      ${ currentTab === "home" ? Home() : ""}
      ${ currentTab === "trash" ? Trash() : ""}
      ${ currentTab === "profile" ? Profile() : ""}
    </div>
  <div>
  ${Modal()}
  `
}

function listenLinks() {
  const links = document.querySelectorAll(".link");
  links.forEach( link => {
    link.addEventListener("click", (event) => {
      const titleLink = event.target.closest(".link").dataset.page;
      const component = routerComponents[titleLink];
      // Guardamos el componente que estamos renderizando en el STORE
      
      STORE.setCurrentTab(titleLink);
      DOMHandler.reload();
    })
  })
}

function listenBtnLogout () {
  const btnLogout = document.querySelector(".js-logout");
  btnLogout.addEventListener("click", async () => {
    try {
      await logout();
      STORE.setCurrentPage("login");
      DOMHandler.load(LoginPage(), document.querySelector("#root"));
    } catch (error) {
      console.log(error)
    }
  })
}

function HomePage() {
  return {
    toString(){
      return render();
    },
    addListeners() {
      listenLinks();
      if (STORE.currentTab === "home") Home().addListeners();
      if (STORE.currentTab === "trash") Trash().addListeners();
      if (STORE.currentTab === "profile") Profile().addListeners();
      listenBtnLogout();
    },
    state :{
    }
  }
}

export default HomePage;