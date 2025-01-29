export class Element{
  static root = null

  static get elm_item_root(){
    return this.root.querySelector(this.selector)
  }

  static get elm_items(){
    if(!Element.elm_item_root){return}
    return Element.elm_item_root.querySelectorAll(`.item`)
  }

  static get elm_pager(){
    return this.root.querySelector(`.pager`)
  }

  static get elm_pager_items(){
    if(!this.elm_pager){return}
    return this.elm_pager.querySelectorAll(`.item`)
  }

  static get elm_prev(){
    return this.root.querySelector(`.prev`)
  }

  static get elm_next(){
    return this.root.querySelector(`.next`)
  }

  static get elm_active(){
    return Element.elm_item_root.querySelector(`.item.active`)
  }

  static get elm_center(){
    const center = Element.elm_item_root.scrollLeft + Element.elm_item_root.offsetWidth / 2
    for(const elm of Element.elm_items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }
}