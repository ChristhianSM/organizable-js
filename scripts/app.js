import { idCurrentBoard, idUser, tokenKey } from "./config.js";
import DOMHandler from "./dom-handler.js";
import LoginPage from "./pages/login-page.js";
import HomePage from "./pages/home-page.js";
import RegisterPage from "./pages/register-page.js";
import { getBoard, getBoards } from "./services/boards-services.js";
import STORE from "./store.js";
import { getUser } from "./services/users-services.js";
import BoardPage from "./pages/board-page.js";

const root = document.querySelector("#root");

export const router = {
  login: LoginPage,
  signup: RegisterPage,
  home: HomePage,
  board: BoardPage,
};

async function App() {
  const token = sessionStorage.getItem(tokenKey);
  const idUserSession = sessionStorage.getItem(idUser);
  const idBoard = sessionStorage.getItem(idCurrentBoard);
  let module;

  if (!token) {
    if (["login", "signup"].includes(STORE.currentPage)) {
      module = router[STORE.currentPage];
    } else {
      module = LoginPage;
    }
    return DOMHandler.load(module(), root);
  }

  try {
    const boards = await getBoards();
    STORE.setBoards(boards);
    STORE.setBoardsNoClosed(boards);
    STORE.setFavoritesBoards(boards);
    STORE.setTrashBoards(boards);

    if (idBoard) {
      const board = await getBoard(idBoard);
      STORE.setBoard(board);
    }

    const user = await getUser(idUserSession);
    STORE.setUser(user);
    module = router[STORE.currentPage];
  } catch (error) {
    console.log(error);
    sessionStorage.removeItem(tokenKey);
    module = LoginPage;
  }

  return DOMHandler.load(module(), root);
}

export default App;