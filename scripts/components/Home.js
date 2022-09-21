import { idCurrentBoard } from "../config.js";
import DOMHandler from "../dom-handler.js";
import { alert, notification, optionsToast } from "../notifications.js";
import BoardPage from "../pages/board-page.js";
import LoginPage from "../pages/login-page.js";
import { createBoard, getBoard, getBoards, updateBoard } from "../services/boards-services.js";
import { createCard } from "../services/cards-services.js";
import { createList } from "../services/lists-services.js";
import STORE from "../store.js";

function renderBoard(board) {
  const {id, name, color, starred} = board;
  const [backgroundColor] = color.split(" ");
  return `
  <div class = "card-board" style="background-color: ${backgroundColor}" data-id = ${id}>
    <form class = "form-update-board flex gap-2 js-form-update-board">
      <input type = "text" value = "${name}" name = "title" class = "title-board cursor-pointer" disabled/>
      <div class = "cursor-pointer js-copy">
        <img src = "assets/icons/icon-copy.png" width = "18" height = "18"/>
      </div>
    </form>
    <div class = "links flex justify-end">
      <div class = "cursor-pointer icon js-trash">
        <img src = "assets/icons/trash.png" width = 20/>
      </div>
      <div class = "cursor-pointer icon js-favorite">
        ${ starred 
         ? `<img src = "assets/icons/star-on.png" width = 22/>`
         : `<img src = "assets/icons/star.png" width = 22/>`
        }
      </div>
    </div>
  </div>
  `
}

function render () {
  const { boardsNoClosed, favoritesBoards } = STORE;
  return `
    <h2 class = "heading--sm regular mb-8"> My Boards </h2>
    ${ favoritesBoards.length > 0 
      ? `
      <h3 class = "heading--xs regular mb-6"> Starred boards </h3>
      <div class = "container-boards-favorites mb-6">
        ${ favoritesBoards.map( renderBoard ).join("") }
      </div>
      `
      : ''
    }

    <h3 class = "heading--xs regular mb-6">Boards</h3>
    <div class = "">
      <div class = "container-boards">
        ${ boardsNoClosed.map( renderBoard ).join("")}
        <div class = "create-board">
          <p> Create Board </p>
        </div>
      </div>
    </div>
  `
}

function listenCopyBoard() {
  const btnsCopy = document.querySelectorAll(".js-copy");
  btnsCopy.forEach(btnCopy => {
    btnCopy.addEventListener("click", async (event) => {
      event.stopPropagation();
      const idBoard = Number(event.target.closest(".card-board").dataset.id);
      try {
        const duplicatedBoard = await getBoard(idBoard);

        notification("warning", "Duplicating board ........");
        // Eliminar el id del objeto duplicado 
        delete duplicatedBoard.id;
        let newBoard = await createBoard(duplicatedBoard);
        console.log(newBoard)
        // Agregamos las listas al nuevo Board
        duplicatedBoard.lists.forEach( async (list) => {
          const newList = await createList(list, newBoard.id);
 
          list.cards.forEach( async (card) => {
            await createCard(card, newList.id);
          })
        })
        
        STORE.addBoard(newBoard, "boards");
        STORE.addBoard(newBoard, "boardsNoClosed");
        setTimeout(() => {
          notification("success", "Board copied correctly");
          DOMHandler.reload();
        }, 1000);
      } catch (error) {
        console.log(error)
      }
    })
  }) 
}

function listenBtnTrash() {
  const btnsTrash = document.querySelectorAll(".js-trash");
  btnsTrash.forEach(btnTrash => {
    btnTrash.addEventListener("click", async (event) => {
      event.stopPropagation();
      // Obtenemos el card para poder eliminarlo con animacion
      const divBoard = event.target.closest(".card-board");

      //Obtenemos el id del board
      const idBoard = Number(divBoard.dataset.id);

      try {
        // Preguntamos si desea eliminar el board
        const alerta = await alert("Do you want to delete this board?");
        if ( !alerta) return
        const response = await updateBoard({closed: true}, idBoard);
        STORE.updateBoard(response);
        STORE.setBoardsNoClosed(STORE.boards);
        STORE.setFavoritesBoards(STORE.boards);
        STORE.setTrashBoards(STORE.boards);

        // Mostramos la alerta
        notification("success", "Board deleted correctly");
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
        // Mostramos la alerta
        notification("error", error.message);
      }
    })
  })
}

function listenBtnFavorite() {
  const btnsTrash = document.querySelectorAll(".js-favorite");
  btnsTrash.forEach(btnTrash => {
    btnTrash.addEventListener("click", async (event) => {
      event.stopPropagation();
      //Obtenemos el id del board
      const idBoard = Number(event.target.closest(".card-board").dataset.id);
      try {
        // Buscamos el board que eliminaremos 
        const findBoard = STORE.boards.find(board => board.id === idBoard);
        const response = await updateBoard({starred: !findBoard.starred}, idBoard);
        STORE.updateBoard(response);
        STORE.setFavoritesBoards(STORE.boards);
        STORE.setBoardsNoClosed(STORE.boards);
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function listenClickInputTitle() {
  const inputsTitles = document.querySelectorAll(".js-form-update-board");
  inputsTitles.forEach(inputTile => {
    inputTile.addEventListener("click", (event) => {
      event.target.disabled = false;
      event.target.focus();
    })
  })
}

async function changeTitleBoard(event, title) {
  const idBoard = Number(event.target.closest(".card-board").dataset.id);
  try {
    const response = await updateBoard({name: title}, idBoard);
    STORE.updateBoard(response);
    STORE.setBoardsNoClosed(STORE.boards);
    STORE.setFavoritesBoards(STORE.boards);
    // DOMHandler.reload();
  } catch (error) {
    console.log(error)
  }
}

function listenOnBlurInputTitle() {
  const inputsTitles = document.querySelectorAll(".title-board");
  inputsTitles.forEach( inputTitle => {
    inputTitle.addEventListener("blur", (event) => {
      const title = event.target.value;
      changeTitleBoard(event, title)
    })
  })
}

function listenUpdateBoard() {
  const formUpdateBoard = document.querySelectorAll(".js-form-update-board");
  formUpdateBoard.forEach(form => {
    form.addEventListener("submit", async(event) => {
      event.preventDefault();
      const { title } = event.target;
      changeTitleBoard(event, title)
    })
  })
}

function btnCloseModal(){
  const btnCloseModal = document.querySelector(".js-close-modal");
  const modal = document.querySelector(".js-modal");
  btnCloseModal.addEventListener("click", () => {
    modal.classList.remove("modal--show");
  })
}

function listenBtnCreateBoard() {
  const btnCreateBoard = document.querySelector(".create-board");
  const modal = document.querySelector(".modal");
  btnCreateBoard.addEventListener("click", () => {
    modal.classList.add("modal--show");
  })
}

function listenChangeColorForm() {
  const colors = document.querySelectorAll(".paleta-color");
  const formCreateBoard = document.querySelector(".js-form-create-board");
  const inputCreateBoard = document.querySelector(".js-input-create-form");
  colors.forEach( color => {
    color.addEventListener("click", (event) => {
      const idColor = event.target.dataset.color;
      formCreateBoard.style.backgroundColor = idColor;
      formCreateBoard.dataset.color = idColor;
    })
  })
}

function listenSubmitCreateBoard() {
  const formCreateBoard = document.querySelector(".js-form-create-board");
  formCreateBoard.addEventListener("submit", async (event) => {
    event.preventDefault();
    const color = event.target.dataset.color;
    const { title } = event.target;
    const newBoard = {
      name: title.value,
      color
    }
    const response = await createBoard(newBoard);
    STORE.addBoard(response, "boardsNoClosed")
    STORE.addBoard(response, "boards");
    
    formCreateBoard.reset();
    // Cerramos el modal
    const modal = document.querySelector(".modal");
    modal.classList.remove("modal--show");

    // Mostramos la alerta
    notification("success", "Board created correctly");
    DOMHandler.reload();  
  })
}

function listenCardBoard() {
  const cardsBoards = document.querySelectorAll(".card-board");
  cardsBoards.forEach(cardBoard => {
    cardBoard.addEventListener("click", async (event) => {
      if (event.target.name !== "title" ) {
        const idBoard = Number(cardBoard.dataset.id);
        try {
          const response = await getBoard(idBoard);
          STORE.setBoard(response);
          STORE.setCurrentPage("board");
          sessionStorage.setItem(idCurrentBoard, idBoard);
          DOMHandler.load(BoardPage(idBoard), document.querySelector("#root"));
        } catch (error) {
          const errors = JSON.parse(error.message);
          notification("error", errors.errors.message);
          DOMHandler.load(LoginPage(), document.querySelector("#root"));
        }
      }
    })
  })
}

function Home() {
  return {
    toString(){
      return render()
    },
    addListeners() {
      listenClickInputTitle();
      listenOnBlurInputTitle();
      listenUpdateBoard();
      listenCopyBoard();
      listenBtnTrash();
      listenBtnFavorite();
      listenBtnCreateBoard();
      btnCloseModal();
      listenChangeColorForm();
      listenSubmitCreateBoard();
      listenCardBoard();
    },
    state :{
    }
  }
}

export default Home;