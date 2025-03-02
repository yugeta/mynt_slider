export class Move{
  constructor(item_root, target_item){
    if(!item_root || !target_item){return}
    this.item_root = item_root

    const target_center = target_item.offsetLeft + target_item.offsetWidth / 2
    this.scroll_value  = target_center - item_root.offsetWidth / 2

    this.item_root.setAttribute("data-scrolling-moving" , "true")
    this.animateScroll()
  }
  scroll_wait_time = 50

  animateScroll(){
    const current_left = this.item_root.scrollLeft
    const diff = (this.scroll_value - current_left) / 7
    if(Math.abs(diff) > 10){
      this.item_root.scrollLeft = current_left + diff
      requestAnimationFrame(this.animateScroll.bind(this))
    }
    else{
      this.item_root.scrollLeft = this.scroll_value
      this.finish()
    }
  }

  finish(){
    if(this.item_root.hasAttribute("data-scrolling-moving")){
      this.item_root.removeAttribute("data-scrolling-moving")
    }
  }


  scrolling(){
    if(this.scroll_end_timer){clearTimeout(this.scroll_end_timer)}
    this.scroll_end_timer = setTimeout(this.finish.bind(this), this.scroll_wait_time)
  }
}