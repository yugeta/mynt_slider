/**
 * active
 */

import { ActiveCenter } from "../slider/active_center.js"

export class ItemAdjust{
  constructor(item_root){
    if(!item_root){return}
    this.item_root = item_root
    
    const prev_count_num = this.width2item_count - this.prev_count
    const next_count_num = this.width2item_count - this.next_count

    // Asset.scrolling_flg = true
    item_root.setAttribute("data-scrolling" , "true")

    if(prev_count_num > 0){
      this.prev_add(prev_count_num)
    }
    if(next_count_num > 0){
      this.next_add(next_count_num)
    }
    if(prev_count_num < 0){
      this.prev_del(prev_count_num)
    }
    if(next_count_num < 0){
      this.next_del(next_count_num)
    }

    new ActiveCenter(item_root) // activeのズレを修正
    if(item_root.hasAttribute("data-scrolling")){
      item_root.removeAttribute("data-scrolling")
    }
  }

  get items(){
    return this.item_root.children
  }

  get active_item(){
    return this.item_root.querySelector(":scope > *.active")
  }

  get item_root_center(){
    return this.item_root.scrollWidth / 2
  }

  get active_center(){
    return this.active_item.offsetLeft + this.active_item.offsetWidth / 2
  }

  get direction(){
    return this.active_item.offsetLeft < this.item_root_center ? "prev" : "next"
  }

  get prev_count(){
    const element = this.active_item
    return Array.from(element.parentElement.children).indexOf(element)
  }

  get next_count(){
    return this.items.length - 1 - this.prev_count
  }

  get width2item_count(){
    const prev_count = Math.ceil((this.active_item.offsetLeft - this.item_root.scrollLeft) / this.active_item.offsetWidth) + 1
    const original_item_count = this.original_items.length
    return prev_count > original_item_count ? prev_count : original_item_count
  }

  // 初期index一覧の取得
  get original_items(){
    const elms    = Array.from(this.item_root.querySelectorAll(`:scope > *`))
    const indexes = elms.map(e => Number(e.getAttribute("data-index")))
    const unique  = new Set(indexes)
    return Array.from(unique).sort()
  }

  // prevとnextの両サイドそれぞれ（共通）のアイテム数
  get active_prev_count(){
    const original_item_count = this.original_items.length
    const item_size     = this.item_root.firstElementChild.offsetWidth
    const shortage_size = (this.item_root.scrollWidth - item_size) / 2
    const copy_count    = Math.ceil(shortage_size / item_size) + 1
    return copy_count > original_item_count ? copy_count : original_item_count
  }
  
  prev_add(prev_count){
    for(let i=0; i<prev_count; i++){
      const first_item   = this.item_root.firstElementChild
      const first_index  = Number(first_item.getAttribute("data-index"))
      const prev_index   = first_index - 1 >= 0 ? first_index - 1 : this.original_items.length + (first_index - 1)
      const prev_item    = this.item_root.querySelector(`[data-index="${prev_index}"]`).cloneNode(true)
      prev_item.classList.remove("active")
      this.item_root.insertBefore(prev_item, first_item)
    }
  }

  prev_del(prev_count){
    for(let i=0; i<Math.abs(prev_count); i++){
      const first_item   = this.item_root.firstElementChild
      this.item_root.removeChild(first_item)
    }
  }

  next_add(next_count){
    for(let i=0; i<next_count; i++){
      const last_item   = this.item_root.lastElementChild
      const last_index  = Number(last_item.getAttribute("data-index"))
      const next_index   = last_index + 1 <= this.original_items.length - 1 ? last_index + 1 : (last_index + 1) - this.original_items.length
      const next_item    = this.item_root.querySelector(`[data-index="${next_index}"]`).cloneNode(true)
      next_item.classList.remove("active")
      this.item_root.appendChild(next_item)
    }
  }

  next_del(next_count){
    for(let i=0; i<Math.abs(next_count); i++){
      const last_item   = this.item_root.lastElementChild
      this.item_root.removeChild(last_item)
    }
  }


}