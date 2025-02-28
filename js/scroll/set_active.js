import { Asset } from "../lib/asset.js"
import { SetActive as PagerSetActive } from "../pager/set_active.js"

export class SetActive{
  constructor(item_root){
    if(!item_root){return}
    this.item_root = item_root
    const current_active = this.item_root.querySelector(".active")
    if(!current_active){return}
    const center_item    = this.get_center_item()
    if(center_item && center_item !== current_active){
      if(current_active.classList.contains("active")){current_active.classList.remove("active")}
      center_item.classList.add("active")
      // this.move_direction = current_active.offsetLeft < center_item.offsetLeft ? "next" : "prev"
      new PagerSetActive(this.slider_elm)
    }
  }

  move_direction = null

  get slider_elm(){
    return this.item_root.closest(Asset.slider_root_selector)
  }

  get items(){
    return this.item_root.querySelectorAll(`:scope > *`)
  }

  get active_item(){
    return this.item_root.querySelector(".active")
  }

  get active_center(){
    return this.item_root.scrollLeft + this.item_root.offsetWidth / 2
  }

  get_center_item(){
    const center_pos = this.active_center
    for(const item of this.items){
      if(item.offsetLeft < center_pos && center_pos < item.offsetLeft + item.offsetWidth){
        return item
      }
    }
  }

  remove_active_all(){
    const actives = this.item_root.querySelectorAll(":scope > *.active")
    for(const active of actives){
      active.classList.remove("active")
    }
  }
}