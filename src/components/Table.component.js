import { createTable, renderUsers, renderUserInfo } from "./table.template";
import {isShowInfo,isSortTable,sortArray,isSorted,removeAttribute,isNext,isPrev,isFilter} from './table.function'

export class TableComponent {

  constructor(root){
    this.rootNode = root;
    this.className = 'user-table';
    this.users = [];
    this.currentUsers = [];
    this.currentUsersFilter = [];
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
    this.tableFilter = {
      type: this.rootNode.querySelector('.table-search__type'),
      str: this.rootNode.querySelector('.shown__input')
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
        this.tableControl.next.disabled = true;
        this.tableControl.prev.disabled = false;
        removeAttribute(this.rootNode, this.currentFieldSort)
        this.nextPage();
        return
      }
      else if (isPrev(event)){
        this.tableControl.prev.disabled = true;
        removeAttribute(this.rootNode, this.currentFieldSort)
        this.prevPage();        
        return
      }
      else if (isFilter(event)){
        if (this.tableFilter.str.value.length < 1){
          this.currentUsers = this.currentUsersFilter;
          const template = renderUsers(this.currentUsers);
          this.onChange(this.tableBody, template);
          removeAttribute(this.rootNode, this.currentFieldSort);
          return
        }
        this.filterTable(this.tableFilter)
        return
      }
      return
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
    if (!this.currentUsers.length) {
      this.currentUsers = this.currentUsersFilter
    }
    let index = this.users.findIndex( el => this.currentUsers[this.currentUsers.length -1 ].id === el.id);
    const isNextPage = this.users[index + this.limit] == undefined ? false : true;
    if (isNextPage) {
      const nextPageUsers = this.users.slice(index + 1, this.limit + index + 1);
      const nextPage = renderUsers(nextPageUsers);
      this.onChange(this.tableBody, nextPage)
      this.currentUsers = nextPageUsers;
      this.tableControl.next.disabled = false;
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
        this.tableControl.next.disabled = false;
      })
  }

  prevPage(){
    if (this.users.length >= this.limit*2 ) {
      let index = this.users.findIndex(el => this.currentUsers[0].id === el.id)
      if (index === 0 ){
        this.tableControl.prev.disabled = true;
        return
      }
      const prevUsers = this.users.slice(index - this.limit, index);
      this.currentUsers = prevUsers;
      const prevPage = renderUsers(prevUsers);
      this.onChange(this.tableBody, prevPage);
      this.tableControl.prev.disabled = false;
    }
  }

  filterTable(filter){
    if (!this.currentUsersFilter.length){
      this.currentUsersFilter = this.currentUsers;
    }
    const filterArray = this.currentUsersFilter.filter( el => {
      const field = el[filter.type.value].toString().toLowerCase();
      if( field.indexOf(filter.str.value.toLowerCase()) !== -1){
        return el
      }
    })
    const template = renderUsers(filterArray);
    this.onChange(this.tableBody, template);
    if (!this.currentUsersFilter.length){
      this.currentUsersFilter = this.currentUsers;
    }
    this.currentUsers = filterArray;
  }


  onChange(target, template){
    target.innerHTML = '';
    target.innerHTML = template;
  }

}