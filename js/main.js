/**
 * MYNT Slider
 * - お手軽カルーセルライブラリ
 */

import { Asset }                   from "./lib/asset.js"
import { Construct as Lib }        from "./lib/construct.js"
import { Construct as Slider }     from "./slider/construct.js"
import { Construct as Scroll }     from "./scroll/construct.js"
import { Construct as Pager }      from "./pager/construct.js"
import { Construct as Step }       from "./step/construct.js"
import { Construct as AutoScroll } from "./auto/construct.js"

class Main{
  constructor(){
    new Lib().promise.then(()=>{
      this.init()
    })
  }

  init(){
    const sliders = Asset.mynt_slider_elements
    if(!sliders || !sliders.length){return}

    for(const slider of sliders){
      const item_root = slider.querySelector(Asset.item_root_selector)
      if(!item_root){continue}
      new Slider(slider, item_root)
      new Scroll(item_root)
      new Pager(slider, item_root)
      new Step(slider)
      new AutoScroll(slider)
    }
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main();break
  default:
    window.addEventListener("DOMContentLoaded", (()=>new Main()))
}