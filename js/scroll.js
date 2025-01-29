import { Pager }  from "./pager.js"
import { Slider } from "./slider.js"

export class Scroll{
  constructor(asset){
    this.asset = asset

    if(this.asset.item_root && !this.asset.item_root.hasAttribute("data-event-set")){
      this.asset.item_root.addEventListener("scroll", this.scroll.bind(this))
      this.asset.item_root.setAttribute("data-event-set" , true)
    }
  }

  scroll(){
    this.center_item_pager()
    if(this.asset.item_root.scroll_flg || this.asset.item_root.step_flg){return}
    if(this.scroll_end_timer){clearTimeout(this.scroll_end_timer)}
    this.scroll_end_timer = setTimeout(this.scroll_end.bind(this), 100)
  }

  scroll_end(){
    if(this.asset.item_root.scroll_flg || this.asset.item_root.step_flg){return}
    this.asset.item_root.scroll_flg = true

    // next
    if(this.asset.active.offsetLeft < this.asset.item_root.scrollLeft){
      this.move_next()
    }
    // prev
    else if(this.asset.active.offsetLeft +  this.asset.active.offsetWidth > this.asset.item_root.scrollLeft + this.asset.item_root.offsetWidth){
      this.move_prev()
    }
    else{
      requestAnimationFrame(this.scroll_finish.bind(this))
    }
  }

  // move to next item
  move_next(e){
    // active move
    this.set_active_center()

    // node-copy
    new Slider(this.asset)

    // スクロールのズレを修正
    this.set_position()

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  // move to previous item
  move_prev(){
    // active move
    this.set_active_center()

    // node copy
    new Slider(this.asset)

    // スクロールのズレを修正
    this.set_position()

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  scroll_finish(){
    this.asset.item_root.scroll_flg = false
  }


  get_center_item(){
    const center = this.asset.item_root.scrollLeft + this.asset.item_root.offsetWidth / 2
    for(const elm of this.asset.items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }

  set_active_center(new_elm){
    const old_active = this.asset.active
    old_active.classList.remove("active")
    const new_active = this.get_center_item() || new_elm
    new_active.classList.add("active")
    new Pager(this.asset, new_active.getAttribute("data-index"))
  }


  set_position(){
    if(!this.asset.active){return}
    const active_left = this.asset.active.offsetLeft
    const left = active_left - (this.asset.center_pos - (this.asset.active.offsetWidth / 2))
    requestAnimationFrame(() => {
      this.asset.item_root.scrollLeft = left
    });
  }

  // スクロール時に、中心にあるslider内のitemをpagerに反映
  center_item_pager(){
    const elm = this.get_center_item()
    if(!elm){return}
    new Pager(this.asset, elm.getAttribute("data-index"))
  }

  get_center_item(){
    const center = this.asset.item_root.scrollLeft + this.asset.item_root.offsetWidth / 2
    for(const elm of this.asset.items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }
}