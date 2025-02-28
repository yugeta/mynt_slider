import { Asset }               from "../lib/asset.js"
import { Clear as PagerClear } from "../pager/clear.js"
import { Move }                from "../pager/move.js"

export class Event{
  constructor(pager_root){
    if(!pager_root){return}
    this.pager_root = pager_root
    pager_root.addEventListener("click" , this.click.bind(this))
    // this.item_root.addEventListener("scroll", this.scrolling.bind(this))
  }

  click(e){
    const elm = e.target.closest(`${Asset.pager_root_selector} > li[data-index]`)
    if(!elm){return}

    const next_index = Number(elm.getAttribute("data-index"))
    const direction = this.get_direction(next_index)
    new PagerClear(this.pager_root)
    elm.classList.add("active")

    let target_item = this.get_item(direction, next_index)
    if(!target_item){return}

    this.move = new Move(this.item_root, target_item)
  }

  get slider_root(){
    return this.pager_root.closest(Asset.slider_root_selector)
  }

  get item_root(){
    return this.slider_root.querySelector(Asset.item_root_selector)
  }

  get items(){
    return Array.from(this.item_root.querySelectorAll(":scope > *"))
  }

  get current_item(){
    return this.item_root.querySelector(":scope > .active")
  }

  get current_active(){
    return this.pager_root.querySelector(`:scope > *.active`)
  }

  get current_index(){
    if(!this.current_active){return}
    return Number(this.current_active.getAttribute("data-index"))
  }

  get_item(direction, next_index){
    switch(direction){
      case "prev":
        return this.get_prev_item(next_index)

      case "next":
        return this.get_next_item(next_index)
    }    
  }

  get_direction(next_index){
    let current_index = this.current_index
    if(next_index === current_index){return null}
    return next_index < current_index ? "prev" : "next"
  }

  get_prev_item(index){
    let elm = this.current_item.previousElementSibling
    while(elm && elm.getAttribute("data-index") !== String(index)){
      elm = elm.previousElementSibling
    }
    return elm
  }

  get_next_item(index){
    let elm = this.current_item.nextElementSibling
    while(elm && elm.getAttribute("data-index") !== String(index)){
      elm = elm.nextElementSibling
    }
    return elm
  }

  scrolling(){
    if(!this.move){return}
    this.move.scrolling()
  }
}