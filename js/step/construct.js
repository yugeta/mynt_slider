import { Event }            from "../step/event.js"

export class Construct{
  constructor(slider){
    if(!slider){return}
    new Event(slider)
  }
}