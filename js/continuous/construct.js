import { Scroll } from "./scroll.js"

export class Construct{
  constructor(slider_root, item_root){
    if(!slider_root){return}
    if(!slider_root.classList.contains("continuous-scroll")){return}

    // continuous-scroll と auto-scroll の競合時、auto-scroll を除去
    if(slider_root.classList.contains("auto-scroll")){
      slider_root.classList.remove("auto-scroll")
    }

    if(!item_root){return}
    const items = item_root.querySelectorAll(":scope > *")
    if(!items || !items.length){return}

    // CSS適用
    item_root.style.scrollSnapType  = "none"
    item_root.style.pointerEvents   = "none"

    // 子要素のスナップ無効化
    const children = item_root.querySelectorAll(":scope > *")
    for(const child of children){
      child.style.scrollSnapAlign = "none"
    }

    // ナビゲーション要素の無効化
    const controls = slider_root.querySelectorAll(".prev, .next, .pager")
    for(const el of controls){
      el.style.pointerEvents = "none"
    }

    new Scroll(slider_root, item_root)
  }
}
