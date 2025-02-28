/**
 * スライダー内でスクロールする時に、不足しているアイテムを追加コピーする処理
 */

// import { CopyCount } from "./copy_count.js"

export class ItemCopy{
  constructor(item_root){
    if(!item_root){return}
    const copy_count  = this.get_copy_count(item_root)
    // const copy_count  = new CopyCount(item_root).value
    const index_lists = this.get_item_index_lists(item_root)
    // console.log(copy_count,index_lists)

    this.copy_previous(item_root, copy_count, index_lists)
    this.copy_next(item_root, copy_count, index_lists)
  }

  // itemのuuid一覧を取得
  get_item_index_lists(item_root){
    return Array.from(item_root.querySelectorAll(":scope > *[data-index]")).map(e => Number(e.getAttribute("data-index"))).sort()
  }

  get_copy_count(item_root){
    const item_count    = (item_root.querySelectorAll(":scope > *") || []).length
    const item_size     = item_root.firstElementChild.offsetWidth
    const shortage_size = (item_root.scrollWidth - item_size) / 2
    const copy_count    = Math.ceil(shortage_size / item_size) + 1
    return copy_count > item_count ? copy_count : item_count
  }

  copy_previous(item_root, copy_count, index_lists){
    for(let i=0; i<copy_count; i++){
      const num      = index_lists.length - (i % index_lists.length || 0) - 1
      const index    = index_lists[num]
      const copy_elm = this.get_copy_item(item_root, index)
      item_root.insertBefore(copy_elm, item_root.firstElementChild)
    }
  }

  copy_next(item_root, copy_count, index_lists){
    const next_count = copy_count - (index_lists.length - 1)
    if(next_count <= 0){return}
    for(let i=0; i<next_count; i++){
      const num      = i % index_lists.length || 0
      const index    = index_lists[num]
      const copy_elm = this.get_copy_item(item_root, index)
      item_root.appendChild(copy_elm)
    }
  }

  get_copy_item(item_root, index){
    const copy_elm = item_root.querySelector(`[data-index="${index}"]`).cloneNode(true)
    if(copy_elm.classList.contains("active")){
      copy_elm.classList.remove("active")
    }
    return copy_elm
  }
  

  // set_elements(uuid){
  //   const slider_root = Asset.get_slider_root(uuid)
  //   const item_root = slider_root.querySelector(Asset.item_root_selector)
  //   if(!item_root){return}

  //   const limit_width = item_root.offsetWidth * 2
  //   const active_item = Asset.get_active_item(uuid)

  //   // last add
  //   const active_right = active_item.offsetLeft + active_item.offsetWidth
  //   console.log(active_right)
  //   let last_elm       = item_root.lastElementChild
  //   let last_left      = last_elm.offsetLeft
  //   while(last_elm.offsetLeft - active_right < limit_width){
  //     last_elm  = this.last_item(slider_root, item_root)
  //     last_left = last_elm.offsetLeft
  //   }

  //   // first add
  //   let first_elm     = item_root.firstElementChild
  //   let first_right   = first_elm.offsetLeft + first_elm.offsetWidth
  //   while(active_item.offsetLeft - first_right < limit_width){
  //     first_elm  = this.first_item(slider_root, item_root)
  //     first_right = first_elm.offsetLeft + first_elm.offsetWidth
  //   }
  // }

  // last_item(slider_root, item_root){
  //   // const index_array  = slider_root.index_array
  //   // const last_elm     = item_root.lastElementChild
  //   // const last_index   = index_array.findIndex(e => e === last_elm.getAttribute("data-index"))
  //   // const next_index   = index_array.length -1 > last_index ? last_index + 1 : 0
  //   // const next_elm     = item_root.querySelector(`:scope > *[data-index="${next_index}"]`)
  //   // const new_next_elm = next_elm.cloneNode(true)
  //   // if(new_next_elm.classList.contains("active")){new_next_elm.classList.remove("active")}
  //   // item_root.appendChild(new_next_elm)
  //   // return new_next_elm
  // }

  // first_item(slider_root, item_root){
  //   // const index_array  = slider_root.index_array
  //   // const first_elm    = item_root.firstElementChild
  //   // const first_index  = index_array.findIndex(e => e === first_elm.getAttribute("data-index"))
  //   // const prev_index   = first_index === 0 ? index_array.length -1 : first_index - 1
  //   // const prev_elm     = item_root.querySelector(`:scope > *[data-index="${prev_index}"]`)
  //   // const new_prev_elm = prev_elm.cloneNode(true)
  //   // if(new_prev_elm.classList.contains("active")){new_prev_elm.classList.remove("active")}
  //   // item_root.insertBefore(new_prev_elm, first_elm)
  //   // return new_prev_elm
  // }
}