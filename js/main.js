/**
 * MYNT Slider
 * # DOM
 * .mynt-slider
 * ├ .slider
 * │  └ items
 * ├ .pager
 * │  └ items
 * ├ .prev
 * └ .next
 */

import { Setting }    from "./setting.js"
import { AutoScroll } from "./auto_scroll.js"

class Main{
  constructor(){
    this.set_css()
  }

  get mynt_slider_elements(){
    return document.querySelectorAll(`.mynt-slider`)
  }

  set_css(){
    if(document.querySelector(`link[class="mynt-slider-css"]`)){
      this.settings()
    }
    else{
      const link = document.createElement("link")
      link.classList.add("mynt-slider-css")
      link.rel = "stylesheet"
      const href = import.meta.url.split("/").slice(0,-2).join("/") + "/css/style.css"
      link.href = href
      link.onload = this.settings.bind(this)
      document.querySelector(`head`).appendChild(link)
    }
  }

  settings(){
    const elms = this.mynt_slider_elements
    if(!elms.length){return}
    for(const elm of elms){
      new Setting(elm)
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