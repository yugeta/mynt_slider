import { Asset } from "../lib/asset.js"
import { Move }  from "../pager/move.js"

export class Event{
  constructor(slider_root){
    if(!slider_root){return}
    this.slider_root = slider_root

    if(this.next_button){
      this.next_button.addEventListener("click" , this.click_next.bind(this))
    }
    if(this.prev_button){
      this.prev_button.addEventListener("click" , this.click_prev.bind(this))
    }
  }

  get item_root(){
    return this.slider_root.querySelector(Asset.item_root_selector)
  }

  get next_button(){
    return this.slider_root.querySelector(`.next`)
  }

  get prev_button(){
    return this.slider_root.querySelector(`.prev`)
  }

  get_next_sibring(){
    const active_item = this.item_root.querySelector(`:scope > .active`)
    if(!active_item){return}
    return active_item.nextElementSibling
  }

  get_prev_sibring(){
    const active_item = this.item_root.querySelector(`:scope > .active`)
    if(!active_item){return}
    return active_item.previousElementSibling
  }

  click_next(e){
    const next_item = this.get_next_sibring()
    if(!next_item){return}
    new Move(this.item_root, next_item)
  }

  click_prev(e){
    const prev_item = this.get_prev_sibring()
    if(!prev_item){return}
    new Move(this.item_root, prev_item)
  }

}