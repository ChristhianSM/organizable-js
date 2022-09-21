import { apiFetch } from "./api-fetch.js";

export async function getBoards() {
  try {
     return await apiFetch("boards");
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getBoard(idBoard) {
  const response = await apiFetch(`boards/${idBoard}`);

  return response;
}

export async function createBoard(newBoard = {name: "", color: '' }) {
  const response = await apiFetch("boards", {body: newBoard});

  return response;
}

export async function updateBoard(data, idBoard) {
  const response = await apiFetch(`boards/${idBoard}`, {body: data, method: "PATCH"});

  return response;
}

export async function deleteBoardTrash(idBoard) {
  const response = await apiFetch(`boards/${idBoard}`, { method: "DELETE"});

  return response;
}