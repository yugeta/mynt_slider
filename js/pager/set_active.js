import { Asset }            from "../lib/asset.js"
import { Clear }            from "../pager/clear.js"

export class SetActive{
  constructor(slider){
    if(!slider){return}
    this.item_root   = this.get_item_root(slider)
    this.pager_root  = this.get_pager_root(slider)
    this.item_active = this.get_item_active()
    if(!this.item_active){return}
    new Clear(this.pager_root)
    this.active()
  }

  get_item_root(slider){
    return slider.querySelector(Asset.item_root_selector)
  }

  get_pager_root(slider){
    return slider.querySelector(Asset.pager_root_selector)
  }

  get_item_active(){
    return this.item_root.querySelector(":scope > .active")
  }

  active(){
    const current_index = this.item_active.getAttribute("data-index")
    const active_pager  = this.pager_root.querySelector(`:scope > [data-index="${current_index}"]`)
    if(!active_pager){return}
    active_pager.classList.add("active")
  }

}