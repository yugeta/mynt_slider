import { Asset }            from "../lib/asset.js"
import { Event }            from "../pager/event.js"
import { SetActive }        from "../pager/set_active.js"

export class Construct{
  constructor(slider, item_root){
    if(!slider || !item_root){return}
    this.pager_root = this.get_pager_root(slider)
    this.original_items = this.get_original_items(item_root)
    this.init()
    new Event(this.pager_root)
    new SetActive(slider)
  }

  get_pager_root(slider){
    return slider.querySelector(Asset.pager_root_selector)
  }

  get_original_items(item_root){
    const elms = item_root.querySelectorAll(":scope > *")
    const indexes = Array.from(elms).map(e => Number(e.getAttribute("data-index")))
    return Array.from(new Set(indexes)).sort()
  }

  init(){
    if(!this.original_items){return}
    this.pager_root.innerHTML = ""
    for(const index of this.original_items){
      const li = document.createElement("li")
      li.setAttribute("data-index", index)
      this.pager_root.appendChild(li)
    }
  }
}