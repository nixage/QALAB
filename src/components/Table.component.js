import { createTable, renderUsers, renderUserInfo } from "./table.template";
import {isShowInfo,isSortTable,sortArray,isSorted,removeAttribute,isNext,isPrev} from './table.function'

export class TableComponent {

  constructor(root){
    this.rootNode = root;
    this.className = 'user-table';
    this.users = [];
    this.currentUsers = [];
    this.currentFieldSort = '';
    this.limit = 10;
  }

  init(){
    this.loadUser()
      .then(res => res.json())
      .then(res => {
        this.users = res;
        this.currentUsers = res;
        this.toHtml()
      })
  }

  loadUser(){
    return fetch(`http://www.filltext.com/?rows=${this.limit}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}`)
  }

  toHtml() {
    this.rootNode.innerHTML = createTable(this.className, this.users)
    this.tableBody = this.rootNode.querySelector('.user-table__body');
    this.tableControl = {
      prev: this.rootNode.querySelector('[data-type-prev]'),
      next: this.rootNode.querySelector('[data-type-next]')
    }
    this.initListeners()
  }

  initListeners(){
    this.rootNode.addEventListener('click', (event) => {
      if(isSortTable(event)){
        const typeSort = event.target.dataset.typeSort;
        if(typeSort !== this.currentFieldSort && this.currentFieldSort) {
          removeAttribute(this.rootNode, this.currentFieldSort)
        }
        this.currentFieldSort = typeSort;
        const fieldSort = typeSort;
        if(event.target.dataset.sort === 'sort'){
          this.sortTable(fieldSort, true)
          isSorted(event)
          return
        }
        this.sortTable(fieldSort);
        isSorted(event);
        return
      }
      else if(isShowInfo(event)){
        const userId = +event.target.closest('[data-user-id]').dataset.userId;
        const userFirstName = event.target.closest('[data-user-first-name]').dataset.userFirstName;
        this.showInfoUser(userId,userFirstName)
        return
      }
      else if (isNext(event)){
        removeAttribute(this.rootNode, this.currentFieldSort)
        this.nextPage()
        return
      }
      else if (isPrev(event)){
        removeAttribute(this.rootNode, this.currentFieldSort)
        this.prevPage()
        return
      }
      else{
        return
      }
    })
  }

  sortTable(field, sorted = false) {
    const sortArrayUser = sortArray(this.currentUsers, field);
    if(sorted) {
      const newTableUsersReverse = renderUsers(sortArrayUser.reverse());
      this.onChange(this.tableBody, newTableUsersReverse);
      return
    }
    const newTableUsers = renderUsers(sortArrayUser);
    this.onChange(this.tableBody, newTableUsers)
  }

  showInfoUser(userId, userFirstName){
    const user = this.currentUsers.find( user => user.id === userId && user.firstName === userFirstName);
    const template = renderUserInfo(user);
    const userInfoNode = this.rootNode.querySelector('.user-info');
    this.onChange(userInfoNode, template)
  }

  nextPage(){
    let index = this.users.findIndex( el => this.currentUsers[this.currentUsers.length -1 ].id === el.id);
    const isNextPage = this.users[index + this.limit] == undefined ? false : true;
    if (isNextPage) {
      const nextPageUsers = this.users.slice(index + 1, this.limit + index + 1);
      const nextPage = renderUsers(nextPageUsers);
      this.onChange(this.tableBody, nextPage)
      this.currentUsers = nextPageUsers
      return
    }
    this.loadUser()
      .then(res => res.json())
      .then(res => {
        const nextPageUsers = renderUsers(res);
        this.onChange(this.tableBody, nextPageUsers)
        this.users.push(...res);
        this.currentUsers = res;
        this.tableControl.prev.disabled = false;
      })
  }

  prevPage(){
    if (this.users.length >= this.limit*2 ) {
      let index = this.users.findIndex(el => this.currentUsers[0].id === el.id)
      if (index === 0 ){
        index = 10;
        this.tableControl.prev.disabled = true;
      }
      const prevUsers = this.users.slice(index - this.limit, index);
      this.currentUsers = prevUsers;
      const prevPage = renderUsers(prevUsers);
      this.onChange(this.tableBody, prevPage);
    } 
  }

  onChange(target, template){
    target.innerHTML = '';
    target.innerHTML = template;
  }

}