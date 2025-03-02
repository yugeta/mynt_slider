import { Asset }               from "../lib/asset.js"

export class Construct{
  constructor(slider_root){
    if(!slider_root){return}
    this.slider_root = slider_root
    if(!this.next_button || !this.item_root){return}
    this.init()
  }

  auto_scroll_time  = 5000

  get item_root(){
    return this.slider_root.querySelector(Asset.item_root_selector)
  }

  get active_item(){
    return this.item_root.querySelector(":scope > .active")
  }

  get next_button(){
    return this.slider_root.querySelector(`.next`)
  }

  init(){
    if(!this.slider_root.hasAttribute("data-auto-scroll-time")){return}
    this.auto_scroll_time = Number(this.slider_root.getAttribute("data-auto-scroll-time") || this.auto_scroll_time)
    this.item_root.addEventListener("scroll" , this.scrolling.bind(this), { passive: true })
    this.update_auto_scroll()
  }

  update_auto_scroll(){
    this.auto_scroll_timer = setTimeout(this.move_auto_scroll.bind(this), this.auto_scroll_time)
  }

  move_auto_scroll(){
    if(!this.item_root.hasAttribute("data-scrolling")){
      this.next_button.click()
    }
    this.update_auto_scroll()
  }

  scrolling(e){
    clearTimeout(this.auto_scroll_timer)
    this.update_auto_scroll()
  }
}