import { Slider } from "./slider.js"
import { Pager }  from "./pager.js"

export class Step{
  constructor(asset){
    this.asset = asset

    if(this.asset.prev && !this.asset.prev.hasAttribute("data-event-set")){
      this.asset.prev.addEventListener("click" , this.click_prev.bind(this))
      this.asset.prev.setAttribute("data-event-set" , true)
    }
    if(this.asset.next && !this.asset.next.hasAttribute("data-event-set")){
      this.asset.next.addEventListener("click" , this.click_next.bind(this))
      this.asset.next.setAttribute("data-event-set" , true)
    }
  }

  flg_time = 300

  click_prev(){
    this.asset.item_root.step_flg = true
    const old_active  = this.asset.active
    const prev_active = this.asset.active.previousElementSibling
    const active_left = this.asset.active.offsetLeft
    const prev_left   = prev_active.offsetLeft
    this.set_active_center(prev_active)

    // node copy
    new Slider(this.asset)
    new Pager(this.asset, prev_active.getAttribute("data-index"))

    // スクロール誤差調整
    this.asset.item_root.scrollLeft = old_active.offsetLeft + (this.asset.item_root.offsetWidth / 2 - old_active.offsetWidth / 2)

    this.asset.item_root.scrollTo({
      left     : this.asset.item_root.scrollLeft + (prev_left - active_left),
      behavior : "smooth",
    })

    // requestAnimationFrame(this.scroll_finish.bind(this))
    setTimeout(this.scroll_finish.bind(this), this.flg_time)
  }


  click_next(){
    this.asset.item_root.step_flg = true
    const old_active  = this.asset.active
    const next_active = this.asset.active.nextElementSibling
    const active_left = this.asset.active.offsetLeft
    const next_left   = next_active.offsetLeft

    this.set_active_center(next_active)
// console.log(this.asset.active, next_active)
    // node copy
    new Slider(this.asset)
    new Pager(this.asset, next_active.getAttribute("data-index"))

    // スクロール誤差調整
    this.asset.item_root.scrollLeft = old_active.offsetLeft + (this.asset.item_root.offsetWidth / 2 - old_active.offsetWidth / 2)
    // this.asset.item_root.scrollLeft = (next_active.offsetLeft + next_active.offsetWidth / 2) - (this.asset.item_root.scrollLeft + this.asset.item_root.offsetWidth / 2)

    this.asset.item_root.scrollTo({
      left     : this.asset.item_root.scrollLeft + (next_left - active_left),
      behavior : "smooth",
    })

    // requestAnimationFrame(this.scroll_finish.bind(this))
    setTimeout(this.scroll_finish.bind(this), this.flg_time)
  }


  set_active_center(new_active){
    const old_active = this.asset.active
    old_active.classList.remove("active")
    // const new_active = this.get_center_item() || new_elm
    new_active.classList.add("active")
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

  scroll_finish(){
    this.asset.item_root.step_flg = false
  }


}