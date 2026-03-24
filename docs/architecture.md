MYNT Slider - プロジェクト構成ドキュメント
===
```
Create : 2025-02-28
Update : 2026-03-24
```

# 概要

MYNT Sliderは、軽量なカルーセル（スライダー）ライブラリ。
PC・スマホ両対応で、無限スクロール・オートスクロール・ページャー・左右ステップ移動をサポートする。
activeアイテムが常に画面中央に表示される「センターポジション」方式を採用している。

外部依存なし。ES Modules（`import/export`）で構成されたVanilla JSプロジェクト。


# ディレクトリ構成

```
mynt_slider/
├── css/
│   └── style.css              # ライブラリ本体のCSS（自動読み込み）
├── js/
│   ├── main.js                # エントリーポイント
│   ├── lib/                   # 共通ライブラリ
│   │   ├── asset.js           #   定数・セレクタ・ユーティリティ
│   │   ├── construct.js       #   CSS自動読み込み・初期化Promise
│   │   └── uuid.js            #   UUID v4生成
│   ├── slider/                # スライダー本体（DOM構築・アイテム複製）
│   │   ├── construct.js       #   初期化（UUID付与・index設定・アイテム複製・センタリング）
│   │   ├── item_copy.js       #   無限スクロール用アイテム複製処理
│   │   ├── active_center.js   #   activeアイテムを中央にスクロール
│   │   └── __copy_count.js    #   複製数計算（未使用・旧実装）
│   ├── scroll/                # スクロールイベント管理
│   │   ├── construct.js       #   初期化
│   │   ├── event.js           #   scrollイベント監視・スクロール終了検知
│   │   ├── set_active.js      #   中央アイテムをactiveに切り替え
│   │   └── item_adjust.js     #   スクロール後のアイテム追加・削除・位置補正
│   ├── pager/                 # ページャー（ドットナビゲーション）
│   │   ├── construct.js       #   ページャーDOM自動生成
│   │   ├── event.js           #   クリックイベント・移動先アイテム検索
│   │   ├── move.js            #   アニメーション付きスクロール移動
│   │   ├── set_active.js      #   ページャーのactive状態同期
│   │   └── clear.js           #   ページャーのactive全解除
│   ├── step/                  # 左右ボタン（prev/next）
│   │   ├── construct.js       #   初期化
│   │   └── event.js           #   prev/nextクリックで隣接アイテムへ移動
│   └── auto/                  # オートスクロール
│       └── construct.js       #   タイマーによる自動next移動
├── sample/                    # デモページ
│   ├── index.html             #   サンプルHTML
│   ├── style.css              #   サンプル用スタイル
│   └── debug.css              #   デバッグ用ビジュアル表示
├── bak/                       # バックアップ（リファクタリング前の旧実装）
│   └── setting.1.js           #   旧・単一クラス版の全機能実装
├── docs/                      # ドキュメント
│   ├── request.md             #   要望・改善メモ
│   └── architecture.md        #   本ドキュメント
└── README.md                  # プロジェクト概要
```


# モジュール詳細

## エントリーポイント : `js/main.js`

アプリケーションの起動処理を担当する。

1. `Lib`（CSS読み込み）のPromise完了を待つ
2. ページ内の全`.mynt-slider`要素を取得
3. 各スライダーに対して、以下のモジュールを順にインスタンス化する
   - `Slider` → DOM初期構築
   - `Scroll` → スクロールイベント管理
   - `Pager` → ページャー生成・イベント
   - `Step` → prev/nextボタンイベント
   - `AutoScroll` → 自動スクロール

`DOMContentLoaded`または`interactive`/`complete`状態で自動起動する。


## 共通ライブラリ : `js/lib/`

### `asset.js` - Asset
静的プロパティ・メソッドのみで構成されるユーティリティクラス。

| メンバ | 種別 | 説明 |
|---|---|---|
| `uuid_lists` | static | 生成済みUUID一覧 |
| `slider_root_selector` | static | `".mynt-slider"` |
| `item_root_selector` | static | `".slider"` |
| `pager_root_selector` | static | `".pager"` |
| `mynt_slider_elements` | getter | ページ内の全スライダー要素を返す |
| `dir` | getter | ライブラリのベースディレクトリパス（CSS読み込み用） |
| `get_slider_root(uuid)` | static | UUID指定でスライダールート要素を取得 |
| `get_active_item(uuid)` | static | UUID指定でactiveアイテム要素を取得 |

### `construct.js` - Lib Construct
ライブラリ本体のCSS（`css/style.css`）を`<head>`に自動挿入する。
Promiseベースで、CSS読み込み完了後にresolveされる。既に読み込み済みの場合は即resolve。

### `uuid.js` - Uuid
UUID v4互換のユニークIDを生成する。`crypto.getRandomValues`を優先使用し、非対応環境では`Math.random`にフォールバックする。


## スライダー本体 : `js/slider/`

### `construct.js` - Slider Construct
スライダーの初期構築を行う。

処理フロー:
1. スライダールートにUUIDを`data-uuid`属性として付与
2. 各アイテムに`data-index`（0始まり）を付与
3. 先頭アイテムに`active`クラスを付与
4. `ItemCopy`で無限スクロール用のアイテム複製を実行
5. `ActiveCenter`でactiveアイテムを中央にスクロール

### `item_copy.js` - ItemCopy
無限スクロールを実現するため、スライダーアイテムを前後に複製する。

- 複製数は「表示領域を埋めるのに必要な数」と「元アイテム数」の大きい方
- 前方（`insertBefore`）と後方（`appendChild`）にそれぞれ複製
- 複製アイテムからは`active`クラスを除去

### `active_center.js` - ActiveCenter
`.active`アイテムがスライダーの中央に来るよう`scrollLeft`を設定する。


## スクロール管理 : `js/scroll/`

### `event.js` - Scroll Event
`scroll`イベントを監視し、スクロール中・スクロール終了を検知する。

- スクロール中: `data-scrolling`属性を付与、`SetActive`で中央アイテムをactive化
- スクロール終了: 50ms無操作で`ItemAdjust`を実行
- `data-scrolling-moving`属性がある場合（プログラム的移動中）はスキップ

### `set_active.js` - Scroll SetActive
スクロール位置から中央にあるアイテムを特定し、`active`クラスを切り替える。
同時にページャーのactive状態も`PagerSetActive`経由で同期する。

### `item_adjust.js` - ItemAdjust
スクロール停止後に、前後のアイテム数を調整する。

- activeアイテムの前後に十分なアイテムがあるか確認
- 不足していれば複製追加（`prev_add` / `next_add`）
- 過剰であれば削除（`prev_del` / `next_del`）
- 最後に`ActiveCenter`でセンタリング補正


## ページャー : `js/pager/`

### `construct.js` - Pager Construct
スライダーの元アイテム数に基づき、ページャー（`<li>`要素）を自動生成する。
既存のページャー内容はクリアされ、`data-index`付きの`<li>`で再構築される。

### `event.js` - Pager Event
ページャーアイテムのクリックイベントを処理する。

1. クリックされたアイテムの`data-index`を取得
2. 現在のactiveとの方向（prev/next）を判定
3. 該当方向の兄弟要素から目的のアイテムを検索
4. `Move`クラスでアニメーション移動を実行

### `move.js` - Move
`requestAnimationFrame`を使ったスムーズスクロールアニメーション。

- 目標位置との差分を1/7ずつ縮小するイージング
- 差分が10px以下になったら目標位置にスナップして完了
- 移動中は`data-scrolling-moving`属性を付与（scroll eventの干渉を防止）

### `set_active.js` - Pager SetActive
スライダーのactiveアイテムの`data-index`に対応するページャーアイテムを`active`にする。

### `clear.js` - Clear
ページャー内の全`active`クラスを除去する。


## ステップ移動 : `js/step/`

### `event.js` - Step Event
`.prev`/`.next`ボタンのクリックイベントを処理する。
activeアイテムの前後の兄弟要素を取得し、`pager/move.js`の`Move`クラスでアニメーション移動する。


## オートスクロール : `js/auto/construct.js`

`auto-scroll`クラスと`data-auto-scroll-time`属性を持つスライダーに対して、タイマーベースの自動スクロールを実行する。

- デフォルト間隔: 5000ms
- `.next`ボタンの`click()`を発火させて移動
- スクロール操作があるとタイマーをリセット（ユーザー操作を優先）


# DOM構造とdata属性

## 必須HTML構造
```html
<div class="mynt-slider">
  <ul class="slider">
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
  </ul>
  <ul class="pager"></ul>     <!-- 中身は自動生成される -->
  <p class="prev"></p>
  <p class="next"></p>
</div>
```

## 動的に付与されるdata属性

| 属性 | 対象 | 説明 |
|---|---|---|
| `data-uuid` | `.mynt-slider` | スライダー識別用UUID |
| `data-index` | `.slider > *` | アイテムの元インデックス（0始まり） |
| `data-index` | `.pager > *` | ページャーの対応インデックス |
| `data-scrolling` | `.slider` | スクロール中フラグ |
| `data-scrolling-moving` | `.slider` | プログラム的移動中フラグ |
| `data-auto-scroll-time` | `.mynt-slider` | オートスクロール間隔（ms） |

## CSSクラス

| クラス | 対象 | 説明 |
|---|---|---|
| `active` | `.slider > *` | 現在アクティブなスライダーアイテム |
| `active` | `.pager > *` | 現在アクティブなページャードット |
| `auto-scroll` | `.mynt-slider` | オートスクロール有効化 |


# モジュール依存関係

```
main.js
├── lib/asset.js          ← 全モジュールから参照される共通定数
├── lib/construct.js      ← CSS読み込み（起動時のみ）
│   └── lib/asset.js
├── slider/construct.js
│   ├── lib/uuid.js
│   ├── slider/item_copy.js
│   └── slider/active_center.js
├── scroll/construct.js
│   └── scroll/event.js
│       ├── scroll/set_active.js
│       │   └── pager/set_active.js
│       │       └── pager/clear.js
│       └── scroll/item_adjust.js
│           └── slider/active_center.js
├── pager/construct.js
│   ├── pager/event.js
│   │   ├── pager/clear.js
│   │   └── pager/move.js
│   └── pager/set_active.js
├── step/construct.js
│   └── step/event.js
│       └── pager/move.js
└── auto/construct.js
```


# CSS設計

## `css/style.css`（ライブラリ本体）
- `.slider`のスクロールバー非表示
- `scroll-snap-type: x mandatory` によるスナップスクロール
- `scroll-snap-align: center` でアイテムを中央スナップ
- `::before`/`::after`疑似要素で左右に50%幅の余白を確保（センタリング用）
- `data-scrolling-moving`時はスナップを無効化（アニメーション移動との競合防止）

## `sample/style.css`（デモ用）
- スライダーの外観（サイズ・ボーダー・色）
- prev/nextボタンのデザイン（矢印型ボーダー）
- ページャードットのデザイン

## `sample/debug.css`（デバッグ用）
- activeアイテムに赤い破線ボーダー
- スクロール中のスライダーに半透明赤ボーダー


# バックアップ : `bak/setting.1.js`

リファクタリング前の旧実装。全機能が単一の`Setting`クラスに集約されていた。
現在のモジュール分割構成への移行前の参考コードとして保持されている。
