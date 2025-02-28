import { Asset } from "../lib/asset.js"
import { Event } from "../scroll/event.js"

export class Construct{
  constructor(item_root){
    if(!item_root){return}
    new Event(item_root)
  }
}