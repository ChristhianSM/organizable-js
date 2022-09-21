import { idUser, tokenKey } from "../config.js";
import DOMHandler from "../dom-handler.js";
import { notification, optionsToast } from "../notifications.js";
import LoginPage from "../pages/login-page.js";
import { deleteAccount, updateAccount } from "../services/users-services.js";
import STORE from "../store.js";
import { input } from "./inputs.js";

function render () {
  const { user } = STORE;
  const { registerError } = this.state;
  return `
  <h2 class = "heading--sm regular mb-8 animate__animated animate__fadeIn"> My Profile </h2>
  <div class = "section-sm container-sm animate__animated animate__fadeInUp">
    <form class="flex flex-column gap-4 mb-4 js-update-form">
      ${input({
        label: "username",
        id: "username",
        placeholder: "Christhian25",
        required: true,
        icon: "assets/icons/icon-user.svg",
        value: user.username
      })}
      ${input({
        label: "email",
        id: "email",
        placeholder: "christhian2524@gmail.com",
        type: "email",
        required: true,
        icon: "assets/icons/icon-email.svg",
        value: user.email
      })}
      ${input({
        label: "firstname",
        id: "firstname",
        placeholder: "Christhian",
        type: "text",
        required: true,
        icon: "assets/icons/icon-firstname.svg",
        value: user.firstName
      })}
      ${input({
        label: "lastname",
        id: "lastname",
        placeholder: "Silupù Moscol",
        type: "text",
        required: true,
        icon: "assets/icons/icon-firstname.svg",
        value: user.lastName
      })}
      ${ registerError ? 
        `<p class = "text-center error-300"> ${ registerError} </p>`
        : ""
      }
      <button class="button button--primary">Update Profile</button>
    </form>
    <a href="#" class="button button--secondary js-delete-account">Delete my account</a>
  </div>
  `
}

function listenFormUpdateAccount(){
  const formUpdateAccount = document.querySelector(".js-update-form");
  formUpdateAccount.addEventListener("submit", async (event) => {
    event.preventDefault();
    const {username, email, firstname, lastname} = event.target;
    const data = {
      username: username.value,
      email: email.value,
      first_name: firstname.value,
      last_name: lastname.value,
    }
    
    try {
      const user = await updateAccount(data, STORE.user.id);
      STORE.setUser(user);

      formUpdateAccount[4].classList.add("button--disabled")
      optionsToast({progressBar: true});
      notification("success","User Updated Success");
      setTimeout(() => {
        formUpdateAccount[4].classList.remove("button--disabled");
        DOMHandler.reload();
      }, 1800);
    } catch (error) {
      const errors = JSON.parse(error.message);
      notification(errors.errors[0], "error");
      DOMHandler.reload();
    }
  })
}

function listenDeleteAccount() {
  const btnDeleteAccount = document.querySelector(".js-delete-account");
  btnDeleteAccount.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await deleteAccount(STORE.user.id);
      sessionStorage.removeItem(tokenKey);
      sessionStorage.removeItem(idUser);
      STORE.resetStore();
      STORE.setCurrentPage("login");
      DOMHandler.load(LoginPage(), document.querySelector("#root"));
    } catch (error) {
      console.log(error)
    }
  })
}

function Profile() {
  return {
    toString(){
      return render.call(this)
    },
    addListeners() {
      listenFormUpdateAccount();
      listenDeleteAccount();
    },
    state :{
      registerError: ''
    }
  }
}

export default Profile;