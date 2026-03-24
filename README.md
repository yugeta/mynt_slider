MKB-SLIDER
===
```
Create : 2025-01-29
Author : Yugeta.Koji
```

# Summary : 概要
- 軽量カルーセル用スライダー
- PCブラウザ、スマホスライダー両対応
- 無限スクロール対応
- センターポジション表示のみ対応（activeアイテムが画面中央のカルーセル）
- 自由なデザインに対して、対応可能。

# Functions : 機能
- scroll
  - 手動スクロールによる、アイテムセンタリング
  - 無限ループ対応
  - オートスクロール対応

- 左右移動ボタン
  - アイテムを１つずつ移動させる

- ページャーボタン
  - 任意のアイテムに瞬時移動できる


# Usage : 使用方法
- 下記のDOM構造で、slider内を横スクロールさせることができる。
```
# DOM structure
.mynt-slider
├ .slider
│  └ items
├ .pager
│  └ items
├ .prev
└ .next
```

- auto-scroll設定
  - .mynt-slider要素に、data-auto-scroll-time（属性）をセットすることで、自動スクロール時間が設定できる。（オートにしない場合は属性を削除）
    - 単位 : ms
    - デフォルト値 : 5000
  > sample : <div class="mynt-slider" data-auto-scroll-time="1000">

- continuous-scroll設定（マーキー型連続スクロール）
  - .mynt-slider要素に`continuous-scroll`クラスを付与すると、一定速度で流れ続けるマーキー型スクロールになる。
  - auto-scrollとは排他（両方指定した場合はcontinuous-scrollが優先）。
  - continuous-scroll中は、手動スクロール・ボタン・ページャーは無効化される。
  - data-scroll-speed属性でスクロール速度を指定できる。
    - 単位 : px/秒
    - デフォルト値 : 50
  > sample : <div class="mynt-slider continuous-scroll" data-scroll-speed="100">

  - CSS注意点
    - .mynt-slider（親要素）に`overflow: hidden`を必ず設定すること。（translateXで移動するため、親でクリップが必要）
    - .slider内のアイテムには固定幅（width, min-width）を設定すること。（可変幅だとバッファ計算が不安定になる）
    - .sliderに`display: flex`を設定すること。（アイテムを横並びにするため）


# Demo
- https://yugeta.github.io/mynt_slider/sample/


# Update
- 2025-02-28 : Refactoring
  - 構造は同じ条件で、モジュール群のリファクタリングを実施。

# Conditions : 条件

