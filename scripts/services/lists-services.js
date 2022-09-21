import { apiFetch } from "./api-fetch.js";

export async function createList(newList = {name: ""}, idBoard) {
  const response = await apiFetch(`boards/${idBoard}/lists`, {body: newList});

  return response;
}

export async function updateList(data, idBoard, idList) {
  const response = await apiFetch(`boards/${idBoard}/lists/${idList}`, {body: data, method: "PATCH"});

  return response;
}

export async function deleteList(idBoard, idList) {
  const response = await apiFetch(`boards/${idBoard}/lists/${idList}`, { method: "DELETE"});

  return response;
}

export async function updateOrderLists(idBoard, ids) {
  const response = await apiFetch(`boards/${idBoard}/lists/sort`, {body: ids});

  return response;
}
