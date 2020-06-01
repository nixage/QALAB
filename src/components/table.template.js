export function createTable(className, users = []) {
  return `
    <table class="${className}">
      <thead class="user-table__head">
        <tr >
          <th data-type-sort="id">ID</th>
          <th data-type-sort="firstName">FirstName</th>
          <th data-type-sort="lastName">LastName</th>
          <th data-type-sort="email">Email</th>
          <th data-type-sort="phone">Phone</th>
        </tr>
      </thead>
      <tbody class="user-table__body">
        ${renderUsers(users)}
      </tbody>
    </table>

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
      <tr class="user-table__row">
        <td class="user-table__cell" data-show-info="true" data-user-id="${element.id}" data-user-first-name="${element.firstName}">${element.id}</td>
        <td class="user-table__cell">${element.firstName}</td>
        <td class="user-table__cell">${element.lastName}</td>
        <td class="user-table__cell">${element.email}</td>
        <td class="user-table__cell">${element.phone}</td>
      </tr>
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