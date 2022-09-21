import { apiFetch } from "./api-fetch.js";

export async function createCard(newCard = {name: ""}, idList) {
  const response = await apiFetch(`lists/${idList}/cards`, {body: newCard});

  return response;
}

export async function updateList(data, idBoard, idList) {
  const response = await apiFetch(`boards/${idBoard}/lists/${idList}`, {body: data, method: "PATCH"});

  return response;
}

export async function deleteCard(idList, idCard) {
  const response = await apiFetch(`lists/${idList}/cards/${idCard}`, { method: "DELETE"});

  return response;
}

export async function updateOrderCards(idList, ids) {
  console.log(ids)
  const response = await apiFetch(`lists/${idList}/cards/sort`, {body: ids});

  return response;
}
