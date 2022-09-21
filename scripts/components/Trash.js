import DOMHandler from "../dom-handler.js";
import { alert } from "../notifications.js";
import { deleteBoardTrash, updateBoard } from "../services/boards-services.js";
import STORE from "../store.js";

function renderBoard(board) {
  const {id, name, color, starred} = board;
  const [backgroundColor] = color.split(" ");
  return `
  <div class = "card-board" style="background-color: ${backgroundColor}" data-id = ${id}>
    <p> ${name} </p>
    <div class = "links flex justify-end">
      <div class = "cursor-pointer icon js-restart">
        <img src = "assets/icons/icon-restart.png" width = 20/>
      </div>
      <div class = "cursor-pointer icon js-trash">
        <img src = "assets/icons/trash.png" width = 20/>
      </div>
    </div>
  </div>
  `
}

function render () {
  const { trashBoards } = STORE;
  return `
    <h2 class = "heading--sm regular mb-8"> Closed Boards </h2>
    ${trashBoards.length > 0
      ? `
      <div class = "container-boards">
        ${ trashBoards.map( renderBoard ).join("")}
      </div>
      `
      : `
      <div class="flex items-center gap-2 flex-column animate__animated animate__fadeIn">
        <img class = "imagen-empty" src = "assets/images/empty.png" width = 100>
        <p>No notes to keep</p>
      </div>
      `
    }
   
  `
}

function listenBtnTrash() {
  const btnsTrash = document.querySelectorAll(".js-trash");
  btnsTrash.forEach(btnTrash => {
    btnTrash.addEventListener("click", async (event) => {
      //Obtenemos el id del board
      const idBoard = Number(event.target.closest(".card-board").dataset.id);
      try {
        // Preguntamos si desea eliminar el board
        const alerta = await alert("Do you want to delete this board permanent?");
        if ( !alerta) return

        // Buscamos el board que eliminaremos 
        await deleteBoardTrash(idBoard);
        STORE.deleteBoard(idBoard);
        // STORE.setBoardsNoClosed(STORE.boards);
        // // STORE.setFavoritesBoards(STORE.boards);
        STORE.setTrashBoards(STORE.boards);
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function listenRestartBoard() {
  const btnsRestart = document.querySelectorAll(".js-restart");
  btnsRestart.forEach( btnRestart => {
    btnRestart.addEventListener("click", async () => {
      const idBoard = Number(event.target.closest(".card-board").dataset.id);

      try {
        const response = await updateBoard({closed: false}, idBoard);
        STORE.updateBoard(response);
        STORE.setTrashBoards(STORE.boards);
        STORE.setBoardsNoClosed(STORE.boards);
        STORE.setFavoritesBoards(STORE.boards);
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function Trash() {
  return {
    toString(){
      return render()
    },
    addListeners() {
      listenBtnTrash();
      listenRestartBoard();
    },
    state :{
    }
  }
}

export default Trash;