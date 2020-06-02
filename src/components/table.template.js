export function createTable(className, users = []) {
  return `
    <div class="table-search">
      <select class="table-search__type">
        <option value="id" selected>Id</option>
        <option value="firstName">firstName</option>
      </select>
      <div class="shown">
        <input class="shown__input" placeholder=" " data-filter-str="true">
        <div class="shown__label">Search</div>
      </div>

      <button class="btn" data-type-search="true"><span>Search</span></button>
    </div>

    <div class="${className}" style="max-width:100%;">
      <div class="user-table__head">
        <div class="user-table__row">
          <div class="user-table__cell" data-type-sort="id">ID</div>
          <div class="user-table__cell" data-type-sort="firstName">FirstName</div>
          <div class="user-table__cell" data-type-sort="lastName">LastName</div>
          <div class="user-table__cell" data-type-sort="email">Email</div>
          <div class="user-table__cell" data-type-sort="phone">Phone</div>
        </div>
      </div>
      <div class="user-table__body">
        ${renderUsers(users)}
      </div>
    </div>

    <div class="table-control">
      <button class="btn" disabled="true" data-type-prev="true"><span>PREV</span></button>
      <button class="btn" data-type-next="true"><span>NEXT</span></button>
    </div>

    <div class="user-info"></div>

  `
}


export function renderUsers(users){
  const template = []
  users.forEach(element => {
    template.push(`
      <div class="user-table__row">
        <div class="user-table__cell" data-show-info="true" data-user-id="${element.id}" data-user-first-name="${element.firstName}">${element.id}</div>
        <div class="user-table__cell">${element.firstName}</div>
        <div class="user-table__cell">${element.lastName}</div>
        <div class="user-table__cell">${element.email}</div>
        <div class="user-table__cell">${element.phone}</div>
      </div>
    `)
  });

  return template.join('')
}

export function renderUserInfo(user){
  return `
    <div class="user-info__body">
      <div class="user-info__name">${user.firstName} ${user.lastName}</div>
      <textarea rows="4" class="user-info__text">${user.description}</textarea>
      <div class="user-info__field">Адрес проживания: <b>${user.adress.streetAddress}</b></div>
      <div class="user-info__field">Город: <b>${user.adress.city}</b></div>
      <div class="user-info__field">Провинция/штат: <b>${user.adress.state}</b></div>
      <div class="user-info__field">Индекс: <b>${user.adress.zip}</b><div>
    <div>
  `
}