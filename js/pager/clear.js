
export class Clear{
  constructor(pager_root){
    if(!pager_root){return}
    const elms = pager_root.querySelectorAll(".active")
    if(!elms){return}
    for(const elm of elms){
      elm.classList.remove("active")
    }
  }
}