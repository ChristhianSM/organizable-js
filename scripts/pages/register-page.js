import { input } from "../components/inputs.js";
import DOMHandler from "../dom-handler.js";
import { notification, optionsToast } from "../notifications.js";
import { signUp } from "../services/users-services.js";
import STORE from "../store.js";
import HomePage from "./home-page.js";
import LoginPage from "./login-page.js";

function render() {
  const { registerError } = this.state;
  return `
  <main class="section">
    <section class="container">
      <header class = "flex justify-center mb-8">
        <img src = "assets/icons/logo-organizable.svg"/>
      </header>
      <h3 class = "heading base regular text-center mb-4"> Create Account </h3>
      <form class="flex flex-column gap-4 mb-4 js-login-form">
        ${input({
          label: "username",
          id: "username",
          placeholder: "Christhian25",
          required: true,
          icon: "assets/icons/icon-user.svg"
        })}
        ${input({
          label: "email",
          id: "email",
          placeholder: "christhian2524@gmail.com",
          type: "email",
          required: true,
          icon: "assets/icons/icon-email.svg"
        })}
        ${input({
          label: "firstname",
          id: "firstname",
          placeholder: "Christhian",
          type: "text",
          required: true,
          icon: "assets/icons/icon-firstname.svg"
        })}
        ${input({
          label: "lastname",
          id: "lastname",
          placeholder: "Silupù Moscol",
          type: "text",
          required: true,
          icon: "assets/icons/icon-firstname.svg"
        })}
        ${input({
          label: "password",
          id: "password",
          placeholder: "******",
          type: "password",
          required: true,
          icon: "assets/icons/icon-password.svg"
        })}

        ${ registerError ? 
          `<p class = "text-center error-300"> ${ registerError} </p>`
          : ""
        }
        <button class="button button--secondary">Create Account</button>
      </form>
    <a href="#" class="block text-center js-login-link">Login</a>
    </section>
  </main>
  `
}

function listenSubmitForm() {
  const form = document.querySelector(".js-login-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const {username, email, firstname, lastname, password} = event.target;
    const credentials = {
      username: username.value,
      email: email.value,
      first_name: firstname.value,
      last_name: lastname.value,
      password: password.value,
    }
    
    try {
      const user = await signUp(credentials);
      STORE.setUser(user);
      STORE.setCurrentPage("home");
      form[5].classList.add("button--disabled")
      optionsToast({progressBar: true});
      notification("success", "User Registered correctly");

      setTimeout(() => {
        DOMHandler.load(HomePage(), document.querySelector("#root"));
      }, 1500);
    } catch (error) {
      console.log(error)
      const errors = JSON.parse(error.message);
      notification(errors.errors[0], "error");
      DOMHandler.reload();
    }
  })
}

function listenBtnLoginUser () {
  const btnSignUp = document.querySelector(".js-login-link");
  btnSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    STORE.setCurrentPage("login");
    DOMHandler.load(LoginPage(), document.querySelector("#root"));
  })
}

function RegisterPage () {
  return {
    toString(){
      return render.call(this);
    },
    addListeners() {
      listenSubmitForm();
      listenBtnLoginUser();
    },
    state: {
      registerError: null
    }
  }
}

export default RegisterPage;