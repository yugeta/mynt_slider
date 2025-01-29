/**
 * MYNT Slider
 * 
 * # Summary
 * - センターポジションのみ対応（activeアイテムが画面中央のカルーセル）
 */

import { Asset }      from "./asset.js"
import { Slider }     from "./slider.js"
import { Scroll }     from "./scroll.js"
import { Pager }      from "./pager.js"
import { Step }       from "./step.js"
import { AutoScroll } from "./auto_scroll.js"

export class Setting{
  constructor(elm){
    if(!elm){return}
    this.asset  = new Asset(elm)
    this.asset.item_root.scroll_flg = null // trye : event-stop

    this.set_indexes()
    this.set_first_child_flg()
    this.set_active_init()
    this.set_pager_active()
    
    new Slider(this.asset)
    this.asset.item_root.scrollLeft = this.asset.active.offsetLeft + (this.asset.item_root.offsetWidth / 2 - this.asset.active.offsetWidth / 2)

    new Scroll(this.asset)
    new Pager(this.asset)
    const step = new Step(this.asset)
    new AutoScroll(this.asset, step)
  }

  set_indexes(){
    // slider items
    for(let i=0; i<this.asset.items.length; i++){
      if(this.asset.items[i].hasAttribute("data-index")){continue}
      this.asset.items[i].setAttribute("data-index", i)
    }

    // pager
    for(let i=0; i<this.asset.pager_items.length; i++){
      if(this.asset.pager_items[i].hasAttribute("data-index")){continue}
      this.asset.pager_items[i].setAttribute("data-index", i)
    }

    // default index lists
    this.asset.root.index_array = Array.from(this.asset.items).map(e => e.getAttribute("data-index"))
  }

  set_first_child_flg(){
    this.asset.first_flg = this.asset.item_root.firstElementChild
  }

  set_active_init(){
    if(this.asset.active){return}
    if(!this.asset.items.length){return}
    this.asset.items[0].classList.add("active")
  }

  set_pager_active(){
    const slider_active = this.asset.item_root.querySelector(`:scope > *.active`)
    if(!slider_active){return}
    const slider_active_index = slider_active.getAttribute(`data-index`)
    const pager_item = this.asset.pager.querySelector(`:scope > *[data-index="${slider_active_index}"]`)
    if(!pager_item){return}
    pager_item.classList.add("active")
  }
}