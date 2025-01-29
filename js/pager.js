import { Slider } from "./slider.js"

export class Pager{
  constructor(asset, index){
    this.asset = asset

    if(index){
      this.pager_active(index)
    }

    // this.set_active()
    if(this.asset.pager && !this.asset.pager.hasAttribute("data-event-set")){
      this.asset.pager.addEventListener("click" , this.click_pager.bind(this))
      this.asset.pager.setAttribute("data-event-set" , true)
    }
  }

  // set_active(){
  //   const items = this.asset.pager_items
  //   if(!items || !items.length){return}

  // }

  click2direction(click_elm){
    const click_index  = click_elm.getAttribute("data-index")
    const active_index = this.asset.active.getAttribute("data-index")
    if(!click_index || !active_index){return null}
    return Number(click_index) < Number(active_index) ? "left" : "right"
  }

  click_pager(e){
    this.asset.item_root.scroll_flg = true
    const pager_item = e.target.closest(".pager > *")
    if(!pager_item){
      this.scroll_finish()
      return
    }
    const index = pager_item.getAttribute("data-index")
    if(this.asset.active.getAttribute("data-index") === index){
      this.scroll_finish()
      return
    }

    const direction = this.click2direction(pager_item)
    const move_elm = this.get_index_near_elm(index, direction)
    if(!move_elm){
      this.scroll_finish()
      return
    }

    // node copy
    new Slider(this.asset)

    // active
    this.pager_active(index)

    // スクロールのズレを修正
    this.asset.item_root.scrollLeft = this.asset.active.offsetLeft - (this.asset.center_pos - (this.asset.active.offsetWidth / 2))

    // active
    this.pager_active(index)

    this.asset.item_root.scrollTo({
      left     : this.asset.item_root.scrollLeft + (move_elm.offsetLeft - this.asset.active.offsetLeft),
      behavior : "smooth",
    })

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  pager_active(index){
    const pager_item = this.asset.pager.querySelector(`[data-index="${index}"]`)
    this.pager_passive_all()
    this.pager_set_active(pager_item)
  }

  pager_set_active(elm){
    if(!elm){return}
    elm.classList.add("active")
  }

  pager_passive_all(e){
    const elms = this.asset.pager.querySelectorAll(`:scope > *.active`)
    if(!elms || !elms.length){return}
    for(const elm of elms){
      elm.classList.remove("active")
    }
  }

  // activeに一番近いindex値のitemを取得(後方先行検索)
  get_index_near_elm(index, direction){
    switch(direction){
      case "left":
      return this.search_left(index)

      case "right":
      return this.search_right(index)
    }
  }

  search_left(index){
    const active_elm = this.asset.active
    const items      = this.asset.items
    console.log(items.length)
    let flg = 0
    for(let i=items.length-1; i>=0; i--){
      if(items[i] === active_elm){flg++}
      if(!flg){continue}
      const prev_index = items[i].getAttribute("data-index")
      if(prev_index === index){
        return items[i]
      }
    }
  }

  search_right(index){
    return this.asset.item_root.querySelector(`:scope > *.active ~ [data-index="${index}"]`)
  }

  next_count_sibling(target_elm, count){
    let next_elm = null
    for(let i=0; i<count; i++){
      if(!target_elm.nextElementSibling){break}
      next_elm = target_elm.nextElementSibling
    }
    return next_elm
  }

  prev_count_sibling(target_elm, count){
    let next_elm = null
    for(let i=0; i<count; i++){
      if(!target_elm.previousElementSibling){break}
      next_elm = target_elm.previousElementSibling
    }
    return next_elm
  }

  scroll_finish(){
    this.asset.item_root.scroll_flg = false
  }
}