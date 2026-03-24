# 実装計画: Continuous Scroll（連続スクロール）

## 概要

MYNT Sliderに連続スクロール（マーキー）モードを追加する。`js/continuous/`ディレクトリに独立モジュールとして実装し、`main.js`の分岐ロジックで既存モジュールと切り替える。CSS追加、サンプルHTML更新も含む。

## タスク

- [x] 1. continuous/construct.js の作成（初期化・CSS適用）
  - [x] 1.1 `js/continuous/construct.js`を新規作成し、`Construct`クラスをexportする
    - `slider_root`に`continuous-scroll`クラスがあるか判定し、なければ即return
    - `continuous-scroll`と`auto-scroll`の両方がある場合、`auto-scroll`クラスを除去する
    - `item_root`に`scroll-snap-type: none`、`pointer-events: none`、`overflow: hidden`を適用
    - `.prev`、`.next`、`.pager`要素に`pointer-events: none`を適用
    - `Scroll`クラスをインスタンス化
    - `item_root`がnullまたは子要素がない場合は即return
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 5.1, 8.1, 8.2_

- [x] 2. continuous/scroll.js の作成（rAFループ・速度制御）
  - [x] 2.1 `js/continuous/scroll.js`を新規作成し、`Scroll`クラスをexportする
    - `data-scroll-speed`属性を解析し、有限正数値でなければデフォルト50px/秒を使用
    - Original_Itemの`data-index`一覧を取得・保持
    - `requestAnimationFrame`ループを開始
    - deltaTimeベースの速度計算: `scrollLeft += speed * dt / 1000`
    - deltaTimeの上限クランプ（100ms）でタブ復帰時の大ジャンプを防止
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

  - [ ]* 2.2 Property 1のプロパティテストを作成
    - **Property 1: スクロール増分はdeltaTimeに比例する**
    - `calcIncrement(speed, dt)`が`speed * dt / 1000`と等しいことを検証
    - 入力: 正のspeed（0.1〜500）、正のdt（1〜100）
    - **Validates: Requirements 2.2**

  - [ ] 2.3 Property 2のプロパティテストを作成
    - **Property 2: 速度パース（数値・非数値のフォールバック）**
    - `parseSpeed(value)`が有限正数値なら数値を、それ以外なら50を返すことを検証
    - 入力: 任意の文字列（数値、非数値、空文字列、特殊値）
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 3. 無限ループ機能の実装（scroll.js内）
  - [x] 3.1 末尾アイテム追加ロジックを実装
    - `scrollLeft + offsetWidth * 2 > scrollWidth`の場合、Original_Itemの`data-index`順にCloned_Itemを末尾に追加
    - `cloneNode(true)`で複製し、`active`クラスを除去してから`appendChild`
    - `append_index`で次に追加するインデックスを管理
    - _Requirements: 6.1, 6.3_

  - [x] 3.2 先頭Cloned_Item削除ロジックを実装
    - 先頭アイテムが`scrollLeft`から表示領域幅以上離れている場合、削除
    - 削除前に`offsetWidth`を記録し、削除後に`scrollLeft -= 削除幅`で視覚位置を保存
    - `data-index`を持つOriginal_Itemは削除しない（Cloned_Itemのみ削除）
    - _Requirements: 6.2, 6.3_

  - [ ]* 3.3 Property 3のプロパティテストを作成
    - **Property 3: 末尾追加によるバッファ充足**
    - 末尾追加ロジック実行後、残りアイテム幅 >= 表示領域幅であることを検証
    - 入力: ランダムなスクロール位置、アイテム数、アイテム幅
    - **Validates: Requirements 6.1**

  - [ ]* 3.4 Property 4のプロパティテストを作成
    - **Property 4: 先頭削除時のscrollLeft補正（視覚位置保存）**
    - 削除後の`scrollLeft` = 削除前の`scrollLeft` - 削除幅であることを検証
    - 入力: ランダムな先頭アイテム数、アイテム幅、初期scrollLeft
    - **Validates: Requirements 6.2, 6.3**

- [x] 4. resizeイベント対応とactive切替の実装（scroll.js内）
  - [x] 4.1 `window`の`resize`イベントハンドラを実装
    - 新しい`offsetWidth`に基づきバッファ量（必要アイテム数）を再計算
    - 不足分は末尾にCloned_Itemを追加
    - 過剰分は先頭側から削除し`scrollLeft`を補正
    - _Requirements: 6.4, 6.5, 6.6_

  - [x] 4.2 active切替ロジックを実装
    - rAFループ内で中央座標`scrollLeft + offsetWidth / 2`を計算
    - 全子要素を走査し、中央座標を含むアイテムに`active`クラスを付与
    - 以前のactiveアイテムから`active`クラスを除去
    - 中央にアイテムが見つからない場合は前回のactiveを維持
    - `scroll/set_active.js`に依存しない自前実装
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 4.3 Property 5のプロパティテストを作成
    - **Property 5: バッファ計算は表示領域幅に比例する**
    - 必要バッファアイテム数 >= `ceil(viewport_width / item_width) + 1`であることを検証
    - 入力: 正のviewport_width、正のitem_width
    - **Validates: Requirements 6.4**

  - [ ]* 4.4 Property 6のプロパティテストを作成
    - **Property 6: activeアイテムの一意性と中央位置の正確性**
    - `active`クラスを持つアイテムがちょうど1つ存在し、中央座標を含むことを検証
    - 入力: ランダムなアイテムレイアウト、スクロール位置
    - **Validates: Requirements 7.1, 7.2**

- [x] 5. チェックポイント - continuous/モジュールの動作確認
  - continuous/construct.jsとcontinuous/scroll.jsが正しく連携し、rAFループ・無限ループ・active切替が動作することを確認する。テストが全て通ることを確認し、不明点があればユーザーに質問する。

- [x] 6. main.jsの変更（分岐ロジック追加）
  - [x] 6.1 `js/main.js`に`ContinuousScroll`のimportと分岐ロジックを追加
    - `import { Construct as ContinuousScroll } from "./continuous/construct.js"`を追加
    - `slider.classList.contains("continuous-scroll")`で分岐
    - trueの場合: `new Slider()` + `new ContinuousScroll()`のみ実行
    - falseの場合: 既存フロー（Scroll, Pager, Step, AutoScroll）を変更なく実行
    - _Requirements: 8.3, 8.4, 9.1, 9.2, 9.3_

- [x] 7. CSS追加（css/style.css）
  - [x] 7.1 `css/style.css`にcontinuous-scroll用のCSSルールを追加
    - `.mynt-slider.continuous-scroll .slider`に`scroll-snap-type: none`、`pointer-events: none`、`overflow: hidden`
    - `.mynt-slider.continuous-scroll .prev, .next, .pager`に`pointer-events: none`
    - FOUC対策としてCSSでの静的適用を行う（JSでの動的適用と併用）
    - _Requirements: 4.1, 4.2, 4.3, 5.1_

- [x] 8. サンプルHTMLの更新（sample/index.html）
  - [x] 8.1 `sample/index.html`にcontinuous-scrollのサンプルスライダーを追加
    - `<div class="mynt-slider continuous-scroll">`でマークアップ
    - `data-scroll-speed`属性でカスタム速度のサンプルも追加
    - 既存のauto-scrollサンプルは変更しない
    - _Requirements: 1.1, 3.1_

- [x] 9. 最終チェックポイント - 全体統合確認
  - 全てのテストが通ることを確認する。continuous-scrollモードと既存モードの両方が正しく動作することを確認し、不明点があればユーザーに質問する。

## 備考

- `*`マーク付きのタスクはオプションであり、スキップ可能
- 各タスクは対応する要件番号を参照しトレーサビリティを確保
- チェックポイントで段階的に動作を検証
- プロパティテストはfast-checkをESM CDN経由で読み込み、HTMLページとして実行
- テストファイルのタグ形式: `Feature: continuous-scroll, Property {number}: {property_text}`
