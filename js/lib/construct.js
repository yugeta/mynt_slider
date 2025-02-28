import { Asset }     from "../lib/asset.js"

export class Construct{
  constructor(){
    this.promise = new Promise((resolve, reject)=>{
      this.resolve = resolve
      this.reject  = reject
      if(this.is_css){
        this.finish()
      }
      else{
        this.set_css()
      }
    })
  }

  name = "mynt-slider-css"

  get root_css(){
    return document.querySelector(`head`)
  }

  get is_css(){
    return document.querySelector(`link[class="${this.name}"]`)
  }

  set_css(){
    const link     = document.createElement("link")
    link.className = this.name
    link.rel       = "stylesheet"
    link.href      = Asset.dir + "/css/style.css"
    link.onload    = this.finish.bind(this)
    this.root_css.appendChild(link)
  }

  finish(){
    this.resolve()
  }
}