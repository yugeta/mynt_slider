/**
 * Auto scroll
 */



export class AutoScroll{
  constructor(asset, step){
    this.asset = asset
    this.step  = step
    this.set_autoscroll()
  }
  
  auto_scroll_time  = 5000
  auto_scroll_timer = null

  set_autoscroll(){
    if(!this.asset.root.classList.contains("auto-scroll")){return}
    if(this.asset.root.hasAttribute("data-auto-scroll-time")){
      this.auto_scroll_time = Number(this.asset.root.getAttribute("data-auto-scroll-time") || this.auto_scroll_time)
      // console.log(this.auto_scroll_time)
    }
    this.update_auto_scroll()
  }

  update_auto_scroll(){
    if(this.auto_scroll_timer){
      clearTimeout(this.auto_scroll_timer)
    }
    this.auto_scroll_timer = setTimeout(this.move_auto_scroll.bind(this), this.auto_scroll_time)
  }

  move_auto_scroll(){
    if(!this.check_item_center_position()){
      this.update_auto_scroll()
      return
    }
// console.log(123)
    this.step.click_next()
    this.update_auto_scroll()
  }

  check_item_center_position(){
    const area_center   = this.asset.item_root.scrollLeft + this.asset.item_root.offsetWidth / 2
    const active_center = this.asset.active.offsetLeft + this.asset.active.offsetWidth / 2
    return Math.abs(area_center - active_center) < 5 ? true : false
  }
}