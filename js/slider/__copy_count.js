export class CopyCount{
  constructor(item_root){
    if(!item_root){return}

    this.value = this.get_copy_count(item_root)
  }

  value = null

  get_copy_count(item_root){
    const item_count    = (item_root.querySelectorAll(":scope > *") || []).length
    const item_size     = item_root.firstElementChild.offsetWidth
    const shortage_size = (item_root.scrollWidth - item_size) / 2
    const copy_count    = Math.ceil(shortage_size / item_size) + 1
    return copy_count > item_count ? copy_count : item_count
  }
}