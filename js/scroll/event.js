import { Asset }       from "../lib/asset.js"
import { SetActive }   from "../scroll/set_active.js"
import { ItemAdjust }  from "../scroll/item_adjust.js"

export class Event{
  constructor(item_root){
    if(!item_root){return}
    this.item_root = item_root
    this.scrollLeft = item_root.scrollLeft
    item_root.addEventListener("scroll", this.scrolling.bind(this))
  }

  scroll_wait_time = 50

  get active_item(){
    return this.item_root.querySelector(":scope > *.active")
  }

  get item_root_center(){
    return this.item_root.scrollWidth / 2
  }

  get active_center(){
    return this.active_item.offsetLeft + this.active_item.offsetWidth / 2
  }


  scrolling(e){
    if(Math.abs(this.scrollLeft - e.target.scrollLeft) < 2){
      return
    }

    this.item_root.setAttribute("data-scrolling", true)

    if(this.scroll_end_timer){
      clearTimeout(this.scroll_end_timer)
    }
    const set_active = new SetActive(this.item_root)

    if(this.item_root.hasAttribute("data-scrolling-moving")){
      return
    }
    
    this.scroll_end_timer = setTimeout((()=> {
      this.item_root.removeAttribute("data-scrolling")
      new ItemAdjust(this.item_root)
    }), this.scroll_wait_time)
  }
}