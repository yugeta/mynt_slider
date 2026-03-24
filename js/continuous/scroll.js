/**
 * continuous-scroll: translateXベースの連続スクロール
 * - scrollLeftではなくtranslateXでアイテムを移動
 * - DOM操作を最小限にしてリフローによるカクつきを防止
 */

export class Scroll{
  constructor(slider_root, item_root){
    if(!item_root){return}
    if(!item_root.children.length){return}

    this.slider_root = slider_root
    this.item_root   = item_root

    this.speed            = this.parse_speed(slider_root.getAttribute("data-scroll-speed"))
    this.original_indexes = this.get_original_indexes()
    this.append_index     = this.get_initial_append_index()
    this.last_time        = 0
    this.raf_id           = null
    this.prev_active      = null
    this.viewport_width   = slider_root.offsetWidth // 親要素の幅をviewportとして使用

    // 初期offsetをscrollLeft（ActiveCenterが設定した値）から引き継ぐ
    this.offset           = item_root.scrollLeft

    // scrollLeftを使わないのでscrollLeftをリセット
    item_root.scrollLeft  = 0

    this.on_resize = this.handle_resize.bind(this)
    window.addEventListener("resize", this.on_resize)

    // 初期バッファ確保（右端が見切れないように）
    this.append_items_if_needed()

    this.raf_id = requestAnimationFrame(this.tick.bind(this))
  }

  // --- 速度パース ---

  parse_speed(value){
    const num = parseFloat(value)
    if(Number.isFinite(num) && num > 0){
      return num
    }
    return 50
  }

  // --- Original_Itemのdata-index一覧 ---

  get_original_indexes(){
    const elms    = this.item_root.querySelectorAll(`:scope > *[data-index]`)
    const indexes = Array.from(elms).map(e => Number(e.getAttribute("data-index")))
    const unique  = [...new Set(indexes)]
    return unique.sort((a, b) => a - b)
  }

  // --- 初期append_index ---

  get_initial_append_index(){
    const last = this.item_root.lastElementChild
    if(!last){return 0}
    const last_index = Number(last.getAttribute("data-index"))
    const pos = this.original_indexes.indexOf(last_index)
    if(pos === -1){return 0}
    return (pos + 1) % this.original_indexes.length
  }

  // --- rAFループ ---

  tick(now){
    if(this.last_time === 0){
      this.last_time = now
      this.raf_id = requestAnimationFrame(this.tick.bind(this))
      return
    }

    let dt = now - this.last_time
    this.last_time = now

    // deltaTime上限クランプ（100ms）
    if(dt > 100){ dt = 100 }

    // 1. offset更新
    this.offset += this.speed * dt / 1000

    // 2. translateX適用（GPU合成レイヤーで描画）
    this.item_root.style.transform = `translateX(${-this.offset}px)`

    // 3. 末尾追加判定
    this.append_items_if_needed()

    // 4. 先頭削除判定（offsetを補正）
    this.remove_items_if_needed()

    // 5. active切替
    this.update_active()

    this.raf_id = requestAnimationFrame(this.tick.bind(this))
  }

  // --- 末尾アイテム追加 ---

  append_items_if_needed(){
    const viewport = this.viewport_width

    while(this.offset + viewport * 2 > this.get_total_content_width()){
      const index    = this.original_indexes[this.append_index]
      const original = this.item_root.querySelector(`:scope > *[data-index="${index}"]`)
      if(!original){break}

      const clone = original.cloneNode(true)
      clone.classList.remove("active")
      clone.style.scrollSnapAlign = "none"
      this.item_root.appendChild(clone)

      this.append_index = (this.append_index + 1) % this.original_indexes.length
    }
  }

  // --- コンテンツ合計幅の取得 ---

  get_total_content_width(){
    const children = this.item_root.children
    if(!children.length){return 0}
    const last  = children[children.length - 1]
    return last.offsetLeft + last.offsetWidth
  }

  // --- 先頭アイテム削除 ---

  remove_items_if_needed(){
    while(this.item_root.children.length > this.original_indexes.length){
      const first = this.item_root.firstElementChild
      if(!first){break}

      // 先頭アイテムの右端がoffsetより前（=完全に画面外左）なら削除
      const item_right = first.offsetLeft + first.offsetWidth
      if(item_right > this.offset){
        break
      }

      // 削除してoffsetを補正（アイテム幅+gap分）
      const width = first.offsetWidth
      this.item_root.removeChild(first)

      // 削除後、残りの要素が左にシフトするのでoffsetを減算
      this.offset -= width
      // gapも考慮
      const gap = this.get_gap()
      this.offset -= gap

      // transformを即座に更新（ジャンプ防止）
      this.item_root.style.transform = `translateX(${-this.offset}px)`
    }
  }

  // --- gap取得 ---

  get_gap(){
    const style = getComputedStyle(this.item_root)
    return parseFloat(style.gap) || 0
  }

  // --- active切替 ---

  update_active(){
    const center_pos = this.offset + this.viewport_width / 2
    const items      = this.item_root.children
    let new_active   = null

    for(const item of items){
      const left  = item.offsetLeft
      const right = left + item.offsetWidth
      if(left <= center_pos && center_pos < right){
        new_active = item
        break
      }
    }

    if(!new_active){return}
    if(new_active === this.prev_active){return}

    // 全アイテムからactiveを除去
    const actives = this.item_root.querySelectorAll(":scope > .active")
    for(const el of actives){
      el.classList.remove("active")
    }

    new_active.classList.add("active")
    this.prev_active = new_active
  }

  // --- resizeイベント ---

  handle_resize(){
    this.viewport_width = this.slider_root.offsetWidth
    this.append_items_if_needed()
  }
}
