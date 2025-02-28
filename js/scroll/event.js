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
    // this.item_root.setAttribute("data-hand-scrolling", true)
    if(this.scroll_end_timer){
      clearTimeout(this.scroll_end_timer)
      // if(Asset.auto_scroll.auto_scroll_timer){clearTimeout(Asset.auto_scroll.auto_scroll_timer)}
    }

    // if(Asset.scrolling_flg === true){
    if(this.item_root.hasAttribute("data-scrolling")){
      return
    }
    if(this.scrollLeft === e.target.scrollLeft){return}
    const set_active = new SetActive(this.item_root)
    
    this.scroll_end_timer = setTimeout((()=> {
      // this.item_root.removeAttribute("data-hand-scrolling")
      new ItemAdjust(this.item_root)
    }), this.scroll_wait_time)
    // Asset.auto_scroll.auto_scroll_timer = setTimeout(Asset.auto_scroll.move_auto_scroll.bind(Asset.auto_scroll), Asset.auto_scroll.auto_scroll_time)
  }
}