export class Asset{
  constructor(elm){
    this.root = elm
  }

  selector = ".slider"

  get item_root(){
    return this.root.querySelector(this.selector)
  }

  get items(){
    if(!this.item_root){return}
    return this.item_root.querySelectorAll(`:scope > *`)
  }

  get pager(){
    return this.root.querySelector(`.pager`)
  }

  get pager_items(){
    if(!this.pager){return}
    return this.pager.querySelectorAll(`:scope > *`)
  }

  get prev(){
    return this.root.querySelector(`.prev`)
  }

  get next(){
    return this.root.querySelector(`.next`)
  }

  get active(){
    return this.item_root.querySelector(`:scope > *.active`)
  }

  get center(){
    const center = this.item_root.scrollLeft + this.item_root.offsetWidth / 2
    for(const elm of this.items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }


  get center_pos(){
    return this.item_root.offsetWidth / 2
  }

  get active_index(){
    return this.active ? this.active.getAttribute("data-index") : null
  }

  set_center(){
    
  }
}