export class Slider{
  constructor(asset){
    this.asset  = asset

    this.copy_elements()
    this.remove_elements()
  }

  copy_elements(){
    const limit_width = this.asset.item_root.offsetWidth * 2

    let last_add=0,first_add=0
    
    // last add
    const active_right = this.asset.active.offsetLeft + this.asset.active.offsetWidth
    let last_elm     = this.asset.item_root.lastElementChild
    let last_left    = last_elm.offsetLeft
    while(last_elm.offsetLeft - active_right < limit_width){
      last_elm  = this.copy_last()
      last_left = last_elm.offsetLeft
      last_add++
    }

    // first add
    let first_elm     = this.asset.item_root.firstElementChild
    let first_right   = first_elm.offsetLeft + first_elm.offsetWidth
    while(this.asset.active.offsetLeft - first_right < limit_width){
      first_elm  = this.copy_first()
      first_right = first_elm.offsetLeft + first_elm.offsetWidth
      first_add++
    }
    console.log("last_add:",last_add," / first_add:",first_add)
  }

  copy_last(){
    const index_array  = this.asset.root.index_array
    const last_elm     = this.asset.item_root.lastElementChild
    const last_index   = index_array.findIndex(e => e === last_elm.getAttribute("data-index"))
    const next_index   = index_array.length -1 > last_index ? last_index + 1 : 0
    const next_elm     = this.asset.item_root.querySelector(`:scope > *[data-index="${next_index}"]`)
    const new_next_elm = next_elm.cloneNode(true)
    if(new_next_elm.classList.contains("active")){new_next_elm.classList.remove("active")}
    this.asset.item_root.appendChild(new_next_elm)
    return new_next_elm
  }

  copy_first(){
    const index_array  = this.asset.root.index_array
    const first_elm    = this.asset.item_root.firstElementChild
    const first_index  = index_array.findIndex(e => e === first_elm.getAttribute("data-index"))
    const prev_index   = first_index === 0 ? index_array.length -1 : first_index - 1
    const prev_elm     = this.asset.item_root.querySelector(`:scope > *[data-index="${prev_index}"]`)
    const new_prev_elm = prev_elm.cloneNode(true)
    if(new_prev_elm.classList.contains("active")){new_prev_elm.classList.remove("active")}
    this.asset.item_root.insertBefore(new_prev_elm, first_elm)
    return new_prev_elm
  }


  remove_elements(){
    const limit_width = this.asset.item_root.offsetWidth * 3

    // front elements remove
    for(const elm of this.asset.items){
      const elm_right = elm.offsetLeft + elm.offsetWidth
      if(this.asset.active.offsetLeft - elm_right > limit_width){
        this.asset.item_root.removeChild(elm)
      }
      else{
        break
      }
    }

    // end elements remove
    for(let i=this.asset.items.length-1; i>=0; i--){
      const elm = this.asset.items[i]
      const elm_left = elm.offsetLeft + elm.offsetWidth
      const active_right = this.asset.active.offsetLeft + this.asset.active.offsetWidth
      if(elm_left - active_right > limit_width){
        this.asset.item_root.removeChild(elm)
      }
      else{
        break
      }
    }
  }
}