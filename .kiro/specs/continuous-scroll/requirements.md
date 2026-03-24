# 要件ドキュメント: Continuous Scroll（連続スクロール）

## はじめに

MYNT Sliderライブラリに「連続スクロール（continuous-scroll）」機能を新規モジュールとして追加する。
既存の`auto-scroll`（間欠移動: 待機→ジャンプ）とは完全に異なるマーキー的な一定速度連続スクロールモードであり、
`js/continuous/`ディレクトリに独立モジュールとして配置する。
既存モジュール（`auto/`, `scroll/`, `pager/`, `step/`）との相互依存は一切持たない。

## 用語集

- **Slider_Root**: `.mynt-slider`クラスを持つスライダーのルートDOM要素
- **Item_Root**: `.slider`クラスを持つスライダーアイテムのコンテナ要素（`<ul>`）
- **Continuous_Scroll_Module**: `js/continuous/`ディレクトリに配置される連続スクロール機能モジュール群
- **Scroll_Speed**: `data-scroll-speed`属性で指定されるスクロール速度（単位: px/秒）
- **Active_Item**: `.active`クラスが付与された現在アクティブなスライダーアイテム
- **Center_Position**: Item_Rootの表示領域の水平方向中央座標
- **Original_Item**: `data-index`属性を持つ元のスライダーアイテム（複製元）
- **Cloned_Item**: 無限ループのために複製されたスライダーアイテム

## 要件

### 要件 1: 連続スクロールモードの有効化

**ユーザーストーリー:** 開発者として、HTMLのclass属性だけで連続スクロールモードを有効化したい。設定を簡潔に保つためである。

#### 受け入れ基準

1. WHEN Slider_Rootに`continuous-scroll`クラスが付与されている場合、THE Continuous_Scroll_Module SHALL 連続スクロール動作を開始する
2. WHEN Slider_Rootに`continuous-scroll`クラスが付与されていない場合、THE Continuous_Scroll_Module SHALL 何も処理を行わない
3. WHEN Slider_Rootに`continuous-scroll`クラスと`auto-scroll`クラスの両方が付与されている場合、THE Continuous_Scroll_Module SHALL `continuous-scroll`のみを有効化し、`auto-scroll`の動作を無効化する

### 要件 2: 一定速度の連続スクロール動作

**ユーザーストーリー:** 利用者として、スライダーアイテムがマーキーのように一定速度で流れ続ける表示を見たい。コンテンツを自動的に閲覧できるようにするためである。

#### 受け入れ基準

1. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Item_Rootの`scrollLeft`を`requestAnimationFrame`を用いて一定速度で増加させ続ける
2. THE Continuous_Scroll_Module SHALL スクロール速度をフレーム間の経過時間（deltaTime）に基づいて計算し、フレームレートに依存しない一定速度を維持する
3. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL スクロール方向を左から右（`scrollLeft`増加方向）とする

### 要件 3: スクロール速度の設定

**ユーザーストーリー:** 開発者として、スクロール速度をHTML属性で指定したい。用途に応じて速度を調整できるようにするためである。

#### 受け入れ基準

1. WHEN Slider_Rootに`data-scroll-speed`属性が指定されている場合、THE Continuous_Scroll_Module SHALL 属性値をpx/秒として解釈しスクロール速度に適用する
2. WHEN `data-scroll-speed`属性が指定されていない場合、THE Continuous_Scroll_Module SHALL デフォルト値50px/秒でスクロールする
3. WHEN `data-scroll-speed`属性の値が数値として解釈できない場合、THE Continuous_Scroll_Module SHALL デフォルト値50px/秒を使用する

### 要件 4: ユーザー操作の無効化

**ユーザーストーリー:** 開発者として、連続スクロール中はユーザーの手動操作を一切受け付けないようにしたい。マーキー表示の一貫性を保つためである。

#### 受け入れ基準

1. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Item_RootにCSS `pointer-events: none`を適用し、マウス・タッチ操作を無効化する
2. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Item_RootにCSS `overflow: hidden`を適用し、手動スクロールを無効化する
3. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Slider_Root内の`.prev`、`.next`、`.pager`要素にCSS `pointer-events: none`を適用する

### 要件 5: CSSスナップの無効化

**ユーザーストーリー:** 開発者として、連続スクロール中はCSSスクロールスナップを無効化したい。スナップがスムーズな連続移動を妨げるためである。

#### 受け入れ基準

1. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Item_RootにCSS `scroll-snap-type: none`を適用する

### 要件 6: 無限ループ対応

**ユーザーストーリー:** 利用者として、スライダーが途切れることなく永続的にスクロールし続ける表示を見たい。コンテンツが循環的に表示されるようにするためである。

#### 受け入れ基準

1. WHILE 連続スクロール中にItem_Rootの末尾側のアイテム残数が表示領域幅分を下回った場合、THE Continuous_Scroll_Module SHALL Original_Itemの順序に従いCloned_Itemを末尾に追加する
2. WHILE 連続スクロール中にItem_Rootの先頭側に表示領域外のCloned_Itemが蓄積した場合、THE Continuous_Scroll_Module SHALL 先頭側の不要なCloned_Itemを削除し`scrollLeft`を削除分だけ補正する
3. THE Continuous_Scroll_Module SHALL アイテム追加・削除時に視覚的なジャンプやちらつきを発生させない
4. WHEN `window`の`resize`イベントが発生した場合、THE Continuous_Scroll_Module SHALL 変更後のウィンドウサイズに基づきアイテム複製数（前後のバッファ量）を再計算する
5. WHEN `window`の`resize`イベントによりバッファ量が不足していると判定された場合、THE Continuous_Scroll_Module SHALL 不足分のCloned_Itemを末尾に追加する
6. WHEN `window`の`resize`イベントによりバッファ量が過剰であると判定された場合、THE Continuous_Scroll_Module SHALL 過剰分のCloned_Itemを先頭側から削除し`scrollLeft`を削除分だけ補正する

### 要件 7: Active切り替え（中央判定）

**ユーザーストーリー:** 開発者として、連続スクロール中もCenter_Positionにあるアイテムが`active`状態になるようにしたい。現在表示中のアイテムを識別できるようにするためである。

#### 受け入れ基準

1. WHILE 連続スクロールモードが有効である間、THE Continuous_Scroll_Module SHALL Center_Positionに位置するアイテムを判定し、該当アイテムに`active`クラスを付与する
2. WHEN Active_Itemが変更される場合、THE Continuous_Scroll_Module SHALL 以前のActive_Itemから`active`クラスを除去してから新しいアイテムに付与する
3. THE Continuous_Scroll_Module SHALL active判定を既存の`scroll/set_active.js`に依存せず、自前のロジックで実装する

### 要件 8: モジュール独立性

**ユーザーストーリー:** 開発者として、連続スクロールモジュールが既存モジュールと完全に独立していることを保証したい。保守性と拡張性を確保するためである。

#### 受け入れ基準

1. THE Continuous_Scroll_Module SHALL `js/continuous/`ディレクトリに配置する
2. THE Continuous_Scroll_Module SHALL `js/lib/asset.js`のみを共通依存として使用し、`auto/`、`scroll/`、`pager/`、`step/`モジュールのファイルをimportしない
3. THE Continuous_Scroll_Module SHALL `js/main.js`から他のモジュールと同様にインスタンス化される
4. WHEN 連続スクロールモードが有効な場合、THE `js/main.js` SHALL `Scroll`、`Pager`、`Step`、`AutoScroll`モジュールのインスタンス化をスキップする

### 要件 9: main.jsへの統合

**ユーザーストーリー:** 開発者として、連続スクロールモジュールが既存のエントリーポイントから自然に起動されるようにしたい。利用方法を統一するためである。

#### 受け入れ基準

1. THE `js/main.js` SHALL Continuous_Scroll_Moduleをimportし、各スライダーの初期化ループ内でインスタンス化する
2. WHEN Slider_Rootに`continuous-scroll`クラスが付与されている場合、THE `js/main.js` SHALL Continuous_Scroll_Moduleのみをインスタンス化し、`Scroll`、`Pager`、`Step`、`AutoScroll`のインスタンス化を行わない
3. WHEN Slider_Rootに`continuous-scroll`クラスが付与されていない場合、THE `js/main.js` SHALL 既存の初期化フロー（`Scroll`、`Pager`、`Step`、`AutoScroll`）を変更なく実行する
