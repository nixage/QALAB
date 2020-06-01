export function isShowInfo(event) {
  return event.target.dataset.showInfo;
}

export function isSortTable(event) {
  return event.target.dataset.typeSort;
}

export function isNext(event) {
  return event.target.dataset.typeNext;
}

export function isPrev(event) {
  return event.target.dataset.typePrev;
}

export function sortArray(users, field){
  return users.sort( (next, current) => next[field] < current[field] ? -1: 1)
}

export function isSorted(event){
  if(event.target.dataset.sort === 'sort'){
    event.target.setAttribute('data-sort', 'sort-reverse');
    return true
  }else {
    event.target.setAttribute('data-sort', 'sort');
    return true
  }
}

export function removeAttribute(root, fieldSort){
  const el = root.querySelector(`[data-type-sort="${fieldSort}"]`);
  if (el){
    el.removeAttribute('data-sort')
  }
}