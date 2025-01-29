/**
 * MYNT Slider
 * 
 * # Summary
 * 
 */

export class Setting{
  constructor(elm){
    if(!elm){return}
    this.root = elm

    this.set_autoscroll()
    this.set_indexes()
    this.set_first_child_flg()
    this.set_active_init()

    this.copy_elements()
    this.set_position()
    this.set_event()
  }

  selector      = ".slider"
  scroll_flg    = null // trye : event-stop
  elm_first_flg = null
  scroll_time   = 500

  get center_pos(){
    return this.elm_item_root.offsetWidth / 2
  }

  get elm_item_root(){
    return this.root.querySelector(this.selector)
  }

  get elm_items(){
    if(!this.elm_item_root){return}
    return this.elm_item_root.querySelectorAll(`:scope > *`)
  }

  get elm_pager(){
    return this.root.querySelector(`.pager`)
  }

  get elm_pager_items(){
    if(!this.elm_pager){return}
    return this.elm_pager.querySelectorAll(`:scope > *`)
  }

  get elm_prev(){
    return this.root.querySelector(`.prev`)
  }

  get elm_next(){
    return this.root.querySelector(`.next`)
  }

  get elm_active(){
    return this.elm_item_root.querySelector(`.active`)
  }

  get elm_center(){
    const center = this.elm_item_root.scrollLeft + this.elm_item_root.offsetWidth / 2
    for(const elm of this.elm_items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }

  get active_index(){
    return this.elm_active ? this.elm_active.getAttribute("data-index") : null
  }

  set_indexes(){
    // slider items
    for(let i=0; i<this.elm_items.length; i++){
      if(this.elm_items[i].hasAttribute("data-index")){continue}
      this.elm_items[i].setAttribute("data-index", i)
    }

    // pager
    for(let i=0; i<this.elm_pager_items.length; i++){
      if(this.elm_pager_items[i].hasAttribute("data-index")){continue}
      this.elm_pager_items[i].setAttribute("data-index", i)
    }

    // default index lists
    this.index_array = Array.from(this.elm_items).map(e => e.getAttribute("data-index"))
  }

  set_event(){
    if(this.elm_prev){
      this.elm_prev.addEventListener("click" , this.click_prev.bind(this))
    }
    if(this.elm_next){
      this.elm_next.addEventListener("click" , this.click_next.bind(this))
    }
    if(this.elm_pager){
      this.elm_pager.addEventListener("click" , this.click_pager.bind(this))
    }
    if(this.elm_item_root){
      // this.elm_item_root.addEventListener("scrollend", this.scroll_end.bind(this))
      this.elm_item_root.addEventListener("scroll", this.scroll.bind(this))
    }
  }

  set_first_child_flg(){
    this.elm_first_flg = this.elm_item_root.firstElementChild
    // first_elm.setAttribute("data-first-flg" , "true")
  }

  set_active_init(){
    if(this.elm_active){return}
    if(!this.elm_items.length){return}
    this.elm_items[0].classList.add("active")
  }

  click_paget_item(e){
    const num = e.target.closest(".slider > *").getAttribute("data-index")
    if(num === null){return}
    console.log(`pager-${num}`)
  }

  copy_elements(){
    // if(!this.elm_active){
    //   // this.set_active_center()
    //   return
    // }

    const limit_width = this.elm_item_root.offsetWidth * 2

    // last add
    const active_right = this.elm_active.offsetLeft + this.elm_active.offsetWidth
    let last_elm     = this.elm_item_root.lastElementChild
    let last_left    = last_elm.offsetLeft
    while(last_elm.offsetLeft - active_right < limit_width){
      last_elm  = this.copy_last()
      last_left = last_elm.offsetLeft
    }

    // first add
    let first_elm     = this.elm_item_root.firstElementChild
    let first_right   = first_elm.offsetLeft + first_elm.offsetWidth
    while(this.elm_active.offsetLeft - first_right < limit_width){
      first_elm  = this.copy_first()
      first_right = first_elm.offsetLeft + first_elm.offsetWidth
    }
  }

  copy_last(){
    const last_elm     = this.elm_item_root.lastElementChild
    const last_index   = this.index_array.findIndex(e => e === last_elm.getAttribute("data-index"))
    const next_index   = this.index_array.length -1 > last_index ? last_index + 1 : 0
    const next_elm     = this.elm_item_root.querySelector(`.slider > *[data-index="${next_index}"]`)
    const new_next_elm = next_elm.cloneNode(true)
    if(new_next_elm.classList.contains("active")){new_next_elm.classList.remove("active")}
    this.elm_item_root.appendChild(new_next_elm)
    return new_next_elm
  }

  copy_first(){
    const first_elm    = this.elm_item_root.firstElementChild
    const first_index  = this.index_array.findIndex(e => e === first_elm.getAttribute("data-index"))
    const prev_index   = first_index === 0 ? this.index_array.length -1 : first_index - 1
    const prev_elm     = this.elm_item_root.querySelector(`.slider > *[data-index="${prev_index}"]`)
    const new_prev_elm = prev_elm.cloneNode(true)
    if(new_prev_elm.classList.contains("active")){new_prev_elm.classList.remove("active")}
    this.elm_item_root.insertBefore(new_prev_elm, first_elm)
    return new_prev_elm
  }

  remove_elements(){
    if(!this.elm_active){return}

    const limit_width = this.elm_item_root.offsetWidth * 3

    // front elements remove
    for(const elm of this.elm_items){
      const elm_right = elm.offsetLeft + elm.offsetWidth
      if(this.elm_active.offsetLeft - elm_right > limit_width){
        this.elm_item_root.removeChild(elm)
      }
      else{
        break
      }
    }

    // end elements remove
    for(let i=this.elm_items.length-1; i>=0; i--){
      const elm = this.elm_items[i]
      const elm_left = elm.offsetLeft + elm.offsetWidth
      const active_right = this.elm_active.offsetLeft + this.elm_active.offsetWidth
      if(elm_left - active_right > limit_width){
        this.elm_item_root.removeChild(elm)
      }
      else{
        break
      }
    }
  }

  scroll(e){
    // if(!this.elm_active){
    //   const elm = this.get_center_item()
    //   elm.classList.add("active")
    // }
    if(this.scroll_flg){return}
    this.scroll_flg = true

    if(this.scroll_end_timer){clearTimeout(this.scroll_end_timer)}
    this.scroll_end_timer = setTimeout((()=>{
      this.scroll_end()
    }).bind(this), 100)
  }

  scroll_end(){
    console.log("scroll_end")
    // if(this.scroll_flg){return}
    // this.update_auto_scroll()
    // this.scroll_flg = true

    // next
    if(this.elm_active.offsetLeft < this.elm_item_root.scrollLeft){
      this.move_next()
    }
    // prev
    else if(this.elm_active.offsetLeft +  this.elm_active.offsetWidth > this.elm_item_root.scrollLeft + this.elm_item_root.offsetWidth){
      this.move_prev()
    }
    else{
      requestAnimationFrame(this.scroll_finish.bind(this))
    }
  }

  // move to next item
  move_next(e){
    // active move
    this.set_active_center()

    // node-copy
    this.copy_elements()

    // remove-first
    this.remove_elements()

    // スクロールのズレを修正
    this.set_position()

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  // move to previous item
  move_prev(){
    // active move
    this.set_active_center()

    // node copy
    this.copy_elements()

    // remove-last
    this.remove_elements()

    // スクロールのズレを修正
    this.set_position()

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  scroll_finish(){
    this.scroll_flg = false
  }


  /**
   * Position
   */
  get_center_item(){
    const center = this.elm_item_root.scrollLeft + this.elm_item_root.offsetWidth / 2
    for(const elm of this.elm_items){
      if(elm.offsetLeft < center && center < elm.offsetLeft + elm.offsetWidth){
        return elm
      }
    }
    return null
  }

  set_active_center(new_elm){
    // if(!this.elm_active){
    //   // this.set_active_center()
    //   return
    // }
    this.elm_active.classList.remove("active")
    const new_active = this.get_center_item() || new_elm
    if(new_active){
      new_active.classList.add("active")
      this.pager_active(new_active.getAttribute("data-index"))
    }
  }

  set_position(){
    if(!this.elm_active){return}
    const active_left = this.elm_active.offsetLeft
    const left = active_left - (this.center_pos - (this.elm_active.offsetWidth / 2))
    requestAnimationFrame(() => {
      this.elm_item_root.scrollLeft = left
    });
  }

  click_prev(){
    if(this.scroll_flg){return}
    // this.update_auto_scroll()
    this.scroll_flg = true
    const prev_active = this.elm_active.previousElementSibling
    const active_left = this.elm_active.offsetLeft
    const prev_left   = prev_active.offsetLeft

    this.set_active_center(prev_left)

    // node copy
    this.copy_elements()

    // remove-last
    this.remove_elements()

    this.elm_item_root.scrollTo({
      left     : this.elm_item_root.scrollLeft + (prev_left - active_left),
      behavior : "smooth",
    })

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  click_next(){
    if(this.scroll_flg){return}
    // this.update_auto_scroll()
    this.scroll_flg = true
    const next_active = this.elm_active.nextElementSibling
    const active_left = this.elm_active.offsetLeft
    const next_left   = next_active.offsetLeft

    this.set_active_center(next_active)

    // node copy
    this.copy_elements()

    // remove-last
    this.remove_elements()

    this.elm_item_root.scrollTo({
      left     : this.elm_item_root.scrollLeft + (next_left - active_left),
      behavior : "smooth",
    })

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  click_pager(e){
    // this.update_auto_scroll()
    this.scroll_flg = true
    const pager_item = e.target.closest(".pager > *")
    if(!pager_item){
      this.scroll_finish()
      return
    }
    const index = pager_item.getAttribute("data-index")
    if(this.elm_active.getAttribute("data-index") === index){
      this.scroll_finish()
      return
    }

    const move_elm    = this.get_index_near_elm(index)
    if(!move_elm){
      this.scroll_finish()
      return
    }

    // node copy
    this.copy_elements()

    // remove-last
    this.remove_elements()

    // active
    this.pager_active(index)

    // スクロールのズレを修正
    this.elm_item_root.scrollLeft = this.elm_active.offsetLeft - (this.center_pos - (this.elm_active.offsetWidth / 2))

    // active
    this.pager_active(index)

    this.elm_item_root.scrollTo({
      left     : this.elm_item_root.scrollLeft + (move_elm.offsetLeft - this.elm_active.offsetLeft),
      behavior : "smooth",
    })

    requestAnimationFrame(this.scroll_finish.bind(this))
  }

  pager_active(index){
    const pager_item = this.elm_pager.querySelector(`[data-index="${index}"]`)
    this.pager_passive_all()
    this.pager_set_active(pager_item)
  }

  pager_set_active(elm){
    if(!elm){return}
    elm.classList.add("active")
  }

  pager_passive_all(e){
    const elms = this.elm_pager.querySelectorAll(`:scope > *.active`)
    if(!elms || !elms.length){return}
    for(const elm of elms){
      elm.classList.remove("active")
    }
  }

  // activeに一番近いindex値のitemを取得(後方先行検索)
  get_index_near_elm(index){
    let elm = this.elm_item_root.querySelector(`.slider > *.active ~ [data-index="${index}"]`)
    if(elm){
      return elm
    }

    const active_elm = this.elm_active
    for(const i=0; i<this.elm_items.length; i++){
      // // next
      // const next_elm = this.next_count_sibling(active_elm, i+1)
      // const next_index = next_elm.getAttribute("data-index")
      // if(next_index === index){
      //   return next_elm
      // }

      // prev
      const prev_elm = this.prev_count_sibling(active_elm, i+1)
      const prev_index = prev_elm.getAttribute("data-index")
      if(prev_index === index){
        return prev_elm
      }
    }
    return null
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

  /**
   * Auto scroll
   */
  time_auto_scroll  = 5000
  timer_auto_scroll = null

  set_autoscroll(){
    if(!this.root.classList.contains("auto-scroll")){return}
    if(this.root.hasAttribute("data-auto-scroll-time")){
      this.time_auto_scroll = Number(this.root.getAttribute("data-auto-scroll-time") || this.time_auto_scroll)
    }
    // this.update_auto_scroll()
  }

  update_auto_scroll(){
    if(this.timer_auto_scroll){
      clearTimeout(this.timer_auto_scroll)
    }
    this.timer_auto_scroll = setTimeout(this.move_auto_scroll.bind(this), this.time_auto_scroll)
  }

  move_auto_scroll(){
    if(this.scroll_flg){
      // this.update_auto_scroll()
      return
    }
    if(this.timer_auto_scroll){
      clearTimeout(this.timer_auto_scroll)
    }
    console.log("move_auto_scroll")
    // console.log(this.elm_active)
    this.click_next()
    this.update_auto_scroll()
  }

}