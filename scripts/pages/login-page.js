import { input } from "../components/inputs.js";
import { idUser } from "../config.js";
import DOMHandler from "../dom-handler.js";
import { notification, optionsToast } from "../notifications.js";
import { getBoards } from "../services/boards-services.js";
import { login } from "../services/session-services.js";
import STORE from "../store.js";
import HomePage from "./home-page.js";
import RegisterPage from "./register-page.js";

function render() {
  const { loginError } = this.state;
  return `
  <main class="section">
    <section class="container">
      <header class = "flex justify-center mb-8">
        <img src = "assets/icons/logo-organizable.svg"/>
      </header>
      <h3 class = "heading base regular text-center mb-4"> Login </h3>
      <form class="flex flex-column gap-4 mb-4 js-login-form">
        ${input({
          label: "username",
          id: "username",
          placeholder: "Christhian25",
          required: true,
          icon: "assets/icons/icon-user.svg"
        })}
        ${input({
          label: "password",
          id: "password",
          placeholder: "******",
          type: "password",
          required: true,
          icon: "assets/icons/icon-password.svg"
        })}

        ${ loginError ? 
          `<p class = "text-center error-300"> ${ loginError} </p>`
          : ""
        }
        <button class="button button--secondary">Login</button>
      </form>
    <a href="#" class="block text-center js-signup-link">Create account</a>
    </section>
  </main>
  `
}

function listenSubmitForm() {
  const form = document.querySelector(".js-login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const {username, password} = event.target;
    const credentials = {
      username: username.value,
      password: password.value,
    }
    try {
      const user = await login(credentials);
      sessionStorage.setItem(idUser, user.id);
      STORE.setUser(user);
      const boards = await getBoards();
      STORE.setBoards(boards);
      STORE.initialValues();
      STORE.setCurrentPage("home");
      STORE.setCurrentTab("home");
      
      form[2].classList.add("button--disabled")
      optionsToast({progressBar: true});
      notification("success", "User logged correctly");

      setTimeout(() => {
        DOMHandler.load(HomePage(), document.querySelector("#root"));
      }, 1500);
    } catch (error) {
      const errors = JSON.parse(error.message);
      notification("error", errors.errors.message);
      DOMHandler.reload();
    }
  })
}

function listenBtnCreateUser () {
  const btnSignUp = document.querySelector(".js-signup-link");
  btnSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    STORE.setCurrentPage("signup")
    DOMHandler.load(RegisterPage(), document.querySelector("#root"));
  })
}

function LoginPage() {
  return {
    toString(){
      return render.call(this);
    },
    addListeners() {
      listenSubmitForm.call(this);
      listenBtnCreateUser();
    },
    state: {
      loginError: null,
      loading: false,
    }
  }
}

export default LoginPage;