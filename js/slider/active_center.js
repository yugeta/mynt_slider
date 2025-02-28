/**
 * active itemをセンターポジションに移動させる処理
 */

export class ActiveCenter{
  constructor(item_root){
    if(!item_root){return}
    this.move_center(item_root)
  }

  move_center(item_root){
    const active_item = item_root.querySelector(`.active`)
    if(!active_item){return}
    const item_center_pos = active_item.offsetLeft + ~~(active_item.offsetWidth / 2)
    const root_center = ~~(item_root.offsetWidth / 2)
    const scroll_pos = item_center_pos - root_center
    item_root.scrollLeft = scroll_pos
  }
}