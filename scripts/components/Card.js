import DOMHandler from "../dom-handler.js";
import { createCard, deleteCard, updateOrderCards } from "../services/cards-services.js";
import STORE from "../store.js";

function renderCard(card) {
  return `
    <div class = "card" data-id = ${card.cardId}>
      <p> ${card.name} </p>
      <div class = "icon js-trash-card">
        <img src = "assets/icons/trash.png" width = 16 height = 16/>
      </div>
    </div>
  `
}

function renderFormCard (value) {
  return `
    <form class = "form-create-card js-form-create-card">
      <input type = "text" name = "title" placeholder = "${value}" class = "input-title" required/>
      <input title="boton enviar" alt="boton enviar" src="assets/icons/icon-create.svg" type="image" />
    </form>
  `
}

function render (cards) {
  return `
  <div class = "container-cards">
  ${ cards.map(renderCard).join("") }
  </div>
  ${ renderFormCard("New Card")}
  `
}

function listenFormCreateCard() {
  const forms = document.querySelectorAll(".js-form-create-card");
  forms.forEach( form => {
    form.addEventListener("submit", async(event) => {
      event.preventDefault();
      const { title } = event.target;
      const listId = Number(event.target.closest(".card-list").dataset.id);
      try {
        const {id, ...response} = await createCard({name: title.value}, listId);
        const newCard = {
          cardId : id, 
          ...response
        }
        STORE.setCard(listId, newCard);
        form.reset();
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function listenTrashCard() {
  const btnsTrash = document.querySelectorAll(".js-trash-card"); 
  btnsTrash.forEach( btnTrash => {
    btnTrash.addEventListener("click", async (event) => {
      const idList = Number(event.target.closest(".card-list").dataset.id);
      const idCard = Number(event.target.closest(".card").dataset.id);
      try {
        await deleteCard(idList, idCard);
        STORE.deleteCard(idList, idCard);
        DOMHandler.reload();
      } catch (error) {
        console.log(error)
      }
    })
  })
}

function addSortableCards() {
  const cardContainers = document.querySelectorAll(".container-cards");
  cardContainers.forEach( cardContainer => {
    const list = cardContainer.closest(".card-list");
    const listId = Number(list.dataset.id);
    // console.log(STORE);

    new Sortable(cardContainer, {
      animation: 300,
      easing: "cubic-bezier(0.37, 0, 0.63, 1)",
      store: {
        set: async function (sortable) {
          const order = sortable.toArray().map(Number);
          try {
            const response = await updateOrderCards(listId, {ids: order});
            console.log(response)
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  })
}

function Card(cards) {
  return {
    toString(){
      return render(cards);
    },
    addListeners() {
      addSortableCards();
      listenFormCreateCard();
      listenTrashCard();
    },
    state :{
    }
  }
}

export default Card;