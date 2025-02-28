import { Asset }            from "../lib/asset.js"
import { Uuid }             from "../lib/uuid.js"
import { ItemCopy }         from "../slider/item_copy.js"
import { ActiveCenter } from "../slider/active_center.js"

export class Construct{
  constructor(slider, item_root){
    if(!item_root){return}
    const items = item_root.querySelectorAll(":scope > *")
    if(!items || !items.length){return}

    this.set_uuid(slider)
    this.set_index(items)
    this.set_active(items)
    new ItemCopy(item_root)
    new ActiveCenter(item_root)
  }

  set_uuid(slider){
    const uuid = "`slider-" + new Uuid().id
    Asset.uuid_lists.push(uuid)
    slider.setAttribute("data-uuid", `${uuid}`)
  }

  set_active(items){
    items[0].classList.add("active")
  }

  set_index(items){
    for(let i=0; i<items.length; i++){
      items[i].setAttribute("data-index", i)
    }
    items[0].classList.add("active")
  }
}