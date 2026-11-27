# MIRANIMA Official Brand Website

MIRANIMAのブランドサイトです。静的HTML / CSS / JavaScriptで構成し、PC・タブレット・スマートフォンに対応します。

## Brand meaning

- **MIRROR + ANIMA** — クリエイターの魂や感性を映し、思い描いた表現を自分の手で形にできる鏡のようなツール。
- **MIRAI + ANIMATION** — 未来のアニメーションや新しい表現をつくる人を支えること。
- 道具に合わせて表現を変えるのではなく、つくる人の表現から道具を考えることを大切にしています。

## Current product

- **NIARIM** — Android向けの手描きアニメーション制作アプリ。
- Official site: <https://niarim.miranima-studio.com/>
- Google Play: <https://play.google.com/store/apps/details?id=com.niarim.niarim>

## Business and contact information

- 屋号：MIRANIMA（ミラニマ）
- 事業形態：個人事業
- 一般・ビジネス窓口：contact@miranima-studio.com
- NIARIMサポート：support@miranima-studio.com
- 代表者・所在地・電話番号：ご請求があった場合は、遅滞なく開示する旨を掲載しています。
- NIARIM Premiumの特定商取引法に基づく表記：<https://niarim.miranima-studio.com/tokushoho/>

## Languages

NIARIM公式サイトと同じ7言語に対応しています：日本語（/）・English（/en/）・Español（/es/）・Français（/fr/）・한국어（/ko/）・简体中文（/zh-hans/）・繁體中文（/zh-hant/）。

各言語のページは、1つのテンプレートと言語ごとの文言ファイルから生成します（デプロイ時のビルドは不要で、生成済みのHTMLをそのまま配信します）。

- 文言を直す：`src/locales/<言語>.json` を編集
- 構造を直す：`src/template.html`（404ページは `src/404.html`）を編集
- そのあと必ず実行：

```bash
node tools/build.mjs
```

`index.html`・`404.html`・`en/` などの各言語フォルダ・`sitemap.xml` は生成物なので、直接編集しないでください。
SNS共有画像（`assets/og/<言語>.png`）を作り直すときは `node tools/render-og.mjs`（Playwrightが必要）を実行します。

## Project files

- src/template.html — 全言語共通のページ構造（`{{...}}` が文言・設定の差し込み位置）
- src/404.html — 全言語共通の404ページ構造
- src/locales/*.json — 言語ごとの文言・フォント・NIARIM画面の言語設定
- tools/build.mjs — 上記から各言語の index.html / 404.html と sitemap.xml を生成
- tools/render-og.mjs — 言語ごとのSNS共有画像を生成
- index.html / 404.html / en/ / es/ / fr/ / ko/ / zh-hans/ / zh-hant/ — 生成済みページ（直接編集しない）
- sitemap.xml / robots.txt — 検索エンジン向け（言語別URLの対応関係を含む）
- _headers — Cloudflare Pages用のキャッシュ・セキュリティヘッダー
- styles/core.css — デザイントークン、言語別のタイポグラフィ、ヘッダー、言語切り替え、モバイルメニュー、フッター
- styles/home.css — Hero / Name / NIARIM / Studio / Contact の各セクションとレスポンシブ
- script.js — 連絡先の反映、モバイルメニュー、言語切り替え、現在地ナビ、名前の分割モーション、NIARIMリールの位置表示
- mirror.js — Heroの鏡キャンバス（描いた線を中央軸で左右に映す）
- flipbook.js — NIARIM欄の再生デモ（サンプル「ボールのバウンド」を1フレームずつ再生）
- site.config.js — official email addresses and URLs（変更後は `node tools/build.mjs` を実行）
- assets/mark.svg — MIRANIMA symbol（ライム、暗い背景用）
- assets/favicon.svg / assets/apple-touch-icon.png — アイコン（インクの面にライムのシンボル）
- assets/og/*.png — 言語ごとのSNS共有画像（1200×630）
- DESIGN_BRIEF.md — design rationale and content accuracy rules

## Git workflow

- main はプロジェクト概要（README）を置くブランチとして維持します。
- Webサイト本体の実装・更新は dev_branch で行います。

## Design and content policy

- MIRANIMAは屋号・ブランド名として扱い、個人名や個人の活動名のように表記しません。
- ブランドのライムとNIARIMアプリのコーラルピンクは、用途を分けて使用します。
- NIARIM紹介には公式サイトで使用している実際のアプリ画面を使い、架空の画面モックは作りません。
- Bite / のぞいてクレーン！からは「プロダクトの性格に応じて見せ方を変える」という考え方だけを参考にし、文章・イラスト・レイアウトを流用しません。
- 機能・販売状況・法的情報は確認できた事実だけを記載します。

## Before publishing

1. Copy, product status, legal information and outbound links match the latest details.
2. miranima-studio.com DNS points to the hosting provider and HTTPS is enabled.
3. The NIARIM official-site screenshot URLs remain available. If they change, update the corresponding image paths and verify all three images on desktop and mobile.
4. Review page rendering at desktop, tablet and smartphone widths (320px以上), keyboard navigation, image alternatives and reduced-motion settings.
