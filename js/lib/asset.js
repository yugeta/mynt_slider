

export class Asset{
  static uuid_lists = []

  static slider_root_selector = ".mynt-slider"
  static item_root_selector   = ".slider"
  static pager_root_selector  = ".pager"

  static get mynt_slider_elements(){
    return document.querySelectorAll(Asset.slider_root_selector)
  }

  static get dir(){
    return import.meta.url.split("/").slice(0,-3).join("/")
  }

  static get_slider_root(uuid){
    if(!uuid){return}
    return document.querySelector(`${Asset.slider_root_selector}[data-uuid="${uuid}"]`)
  }

  static get_active_item(uuid){
    if(!uuid){return}
    const root = Asset.get_slider_root(uuid)
    if(!root){return}
    const item_uuid = root.getAttribute("data-active")
    if(!item_uuid){return}
    return root.querySelector(`[data-uuid="${item_uuid}"]`)
  }
  
}