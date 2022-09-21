import Card from "../components/Card.js";
import { idCurrentBoard } from "../config.js";
import DOMHandler from "../dom-handler.js";
import { alert, notification } from "../notifications.js";
import { createList, deleteList, updateList, updateOrderLists } from "../services/lists-services.js";
import STORE from "../store.js";
import HomePage from "./home-page.js";

function renderList(list, state) {
  const { listId, name, cards } = list;
  return `
    <div class = "card-list" data-id = ${listId}>
      <div class = "imagen-drag">
        <img src = "assets/images/drag.png" class = "imagen-drag"/>
      </div>
      <div class = "header-list mb-2">
        <input value = "${name}" class = "js-name-list" ${state.edit && state.idList === listId ? 'autofocus' : "disabled"} required />
        <div class = "links flex justify-end">
          <div class = "cursor-pointer icon ${state.edit && state.idList === listId ? 'js-aceptar' : 'js-edit'} ">
            ${ state.edit && state.idList === listId
              ? `<img src = "assets/icons/icon-aceptar.svg" width = 20/>`
              : `<img src = "assets/icons/icon-edit.png" width = 20/>`
            }
          </div>
          <div class = "cursor-pointer icon ${state.edit && state.idList === listId ? 'js-close' : 'js-trash'}">
            ${ state.edit && state.idList === listId
              ? `<img src = "assets/icons/icon-cerrar.svg" width = 20/>`
              : `<img src = "assets/icons/trash.png" width = 20/>`
            }
          </div>
        </div>
      </div>
      ${Card(cards, listId)}
    </div>
  `
}

function renderForm(value) {
  return `
    <form class = "form-create js-form-create">
      <input type = "text" name = "title" placeholder = "${value}" class = "input-title" required/>
      <input title="boton enviar" alt="boton enviar" src="assets/icons/icon-create.svg" type="image" />
    </form>
  `
}

function render () {
  const { lists, name } = STORE.board;
  console.log(lists)
  const state = this.state
  return `
    <div class = "page-board">
      <div class = "header-board flex justify-center">
        <img src = "assets/icons/logo-organizable.svg" class = "logo-header" />
      </div>
      <div class = "section-sm">
        <h3 class = "heading mb-4"> ${name} </h3>
        <div class = "flex gap-4 wrap">
          ${ lists.length > 0 
            ? `<div class = "container-list">
                ${ lists.map( list => renderList(list, state)).join("")}
              </div>`
            : ''
          }
          
          ${renderForm("New list")}
        </div>
      </div>
    </div>
  `
}

function listenLogoHeader() {
  const btnLogo = document.querySelector(".logo-header");
  btnLogo.addEventListener("click", () => {
    STORE.setCurrentPage("home");
    sessionStorage.removeItem(idCurrentBoard);
    DOMHandler.load(HomePage(), document.querySelector("#root"));
  })
}

function listenFormCreateList() {
  const form = document.querySelector(".js-form-create");
  form.addEventListener("submit", async(event) => {
    event.preventDefault();
    const { title } = event.target;
    const idBoard = STORE.board.id;
    try {
      const {id, ...response} = await createList({name: title.value}, idBoard);
      const newList = {
        listId: id, 
        ...response
      }
      STORE.setList(newList);
      form.reset();
      notification("success", "List Created Correctly");
      DOMHandler.reload();
    } catch (error) {
      console.log(error)
    }
  })
}

function listenBtnEditList() {
  const btnsEdit = document.querySelectorAll(".js-edit");
  btnsEdit.forEach( btnEdit => {
    btnEdit.addEventListener("click", (event) => {
      const idList = Number(event.target.closest(".card-list").dataset.id);
      console.log(idList)
      this.state.idList = idList;
      this.state.edit = true;
      DOMHandler.reload();
    })
  })
}

function listenBtnAcceptEdit() {
  const btnsAcceptEdit = document.querySelectorAll(".js-aceptar");
  btnsAcceptEdit.forEach( btnAcceptEdit => {
    btnAcceptEdit.addEventListener("click", async (event) => {
      const inputList = (event.target.closest(".card-list").children[1].firstElementChild);
      const idBoard = STORE.board.id;
      const idList = Number(event.target.closest(".card-list").dataset.id);

      try {
        const {id, ...response} = await updateList({name: inputList.value}, idBoard, idList);
        const newData = {
          listId: id,
          ...response
        }
        STORE.updateList(newData);
        inputList.disabled = true;
        this.state.idList = '';
        this.state.edit = false;
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function listenBtnClosedEdit() {
  const btnsClosedEdit = document.querySelectorAll(".js-close");
  btnsClosedEdit.forEach( btnCloseEdit => {
    btnCloseEdit.addEventListener("click", (event) => {
      this.state.idList = '';
      this.state.edit = false;
      DOMHandler.reload();
    })
  })
}

function listenTrashList() {
  const btnsTrash = document.querySelectorAll(".js-trash"); 
  btnsTrash.forEach( btnTrash => {
    btnTrash.addEventListener("click", async (event) => {
      const idBoard = STORE.board.id;
      const idList = Number(event.target.closest(".card-list").dataset.id);
      try {
        // Preguntamos si desea eliminar el board
        const alerta = await alert("Do you want to delete this list permanent?");
        if ( !alerta) return

        await deleteList(idBoard, idList)
        STORE.deleteList(idList);
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function addSortableLists() {
  const listContainer = document.querySelectorAll(".container-list");
  listContainer.forEach( cardList => {
    const board = STORE.board.id;

    new Sortable(cardList, {
      animation: 150,
      handle: ".imagen-drag",
      store: {
        set: async function (sortable) {
          const order = sortable.toArray().map(Number);
          try {
            let orderListCards = await updateOrderLists(board, {ids: order});
            orderListCards = orderListCards.map(list => {
              list.listId = list.id
              delete list.id
              delete list.boardId
              return list
            })
            STORE.board.lists.forEach( currentLit => {
              orderListCards.forEach( list => {
                if (list.listId === currentLit.listId) {
                  list.cards = currentLit.cards;
                  return
                }
              })
            })
            STORE.board.lists = orderListCards; 
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  })
}

function BoardPage() {
  return {
    toString(){
      return render.call(this);
    },
    addListeners() {
      listenLogoHeader();
      listenFormCreateList();
      listenBtnEditList.call(this);
      listenBtnAcceptEdit.call(this);
      listenBtnClosedEdit.call(this);
      listenTrashList();
      Card().addListeners();
      addSortableLists();
    },
    state :{
      idList: '',
      edit: false
    }
  }
}

export default BoardPage;