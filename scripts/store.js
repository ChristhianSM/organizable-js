import { fromLocalStorage, saveToLocalStorage } from "./utils.js";

const STORE = {
  user: null,
  currentPage: fromLocalStorage("current-page") || "login",
  currentTab: fromLocalStorage("current-tab") || "home",
  boards: [],
  board:[],
  boardsNoClosed: [],
  favoritesBoards: [],
  trashBoards:[],
  initialValues(){
    this.setBoardsNoClosed();
    this.setFavoritesBoards();
    this.setTrashBoards();
  },
  setBoardsNoClosed() {
    this.boardsNoClosed = this.boards.filter(board => !board.closed && !board.starred);
  },
  setFavoritesBoards() {
    this.favoritesBoards = this.boards.filter(board => board.starred && !board.closed);
  },
  setTrashBoards() {
    this.trashBoards = this.boards.filter(board => board.closed)
  },
  setUser(user) {
    this.user = user
  },
  setCurrentPage(page) {
    saveToLocalStorage("current-page", page);
    this.currentPage = page;
  },
  setCurrentTab(component) {
    saveToLocalStorage("current-tab", component);
    this.currentTab = component;
  },
  setBoards(boards) {
    this.boards = boards;
  },
  addBoard(board, store){
    this[store].push(board);
  },
  updateBoard(data){
    this.boards = this.boards.map(board => {
      if (board.id === data.id) {
        return data
      }else {
        return board;
      }
    })
  },
  deleteBoard(id) {
    this.boards = this.boards.filter(board => board.id !== id);
  },
  resetStore(){
    this.boards = [];
    this.favoritesBoards = [];
    this.boardsNoClosed = [];
    this.trashBoards = [];
  },

  // STORE LIST
  setBoard(board) {
    this.board = board;
  },
  setList(list){
    list.cards = [];
    this.board.lists.push(list);
  },
  updateList(data) {
    this.board.lists = this.board.lists.map( list => {
      if (list.listId === data.listId) {
        data.cards = list.cards
        return data;
      }else{
        return list;
      }
    })
  },
  deleteList(idList) {
    this.board.lists = this.board.lists.filter( list => list.listId !== idList);
  },

  // STORE CARD
  setCard(idList, card){
    this.board.lists.forEach( list => {
      if (list.listId === idList) {
        list.cards.push(card);
      }
    })
  },
  deleteCard(idList, idCard){
    this.board.lists.forEach( list => {
      if (list.listId === idList) {
        list.cards = list.cards.filter(card => card.cardId !== idCard)
      }
    });
  }
}

export default STORE;