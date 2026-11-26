# MIRANIMA Official Brand Website

MIRANIMAのブランドサイトです。静的HTML / CSS / JavaScriptで構成し、PC・タブレット・スマートフォンに対応します。

## Brand meaning

- **MIRROR + ANIMA** — クリエイターの魂や感性を映し、思い描いた表現を自分の手で形にできる鏡のようなツール。
- **MIRAI + ANIMATION** — 未来のアニメーションや新しい表現をつくる人を支えること。

## Current product

- **NIARIM** — 手描きアニメーション制作アプリ。現在開発中です。
- Official site: <https://niarim.miranima-studio.com/>

## Business and contact information

- 屋号：MIRANIMA（ミラニマ）
- 事業形態：個人事業
- 一般・ビジネス窓口：`contact@miranima-studio.com`
- NIARIMサポート：`support@miranima-studio.com`
- 代表者・所在地・電話番号：ご請求があった場合は、遅滞なく開示する旨を掲載しています。
- NIARIM Premiumの特定商取引法に基づく表記：<https://niarim.miranima-studio.com/tokushoho/>

## Project files

- `index.html` — ページ構造・日本語コピー
- `styles.css` — PC / tablet / smartphone向けスタイル
- `script.js` — モバイルナビゲーション、連絡先・製品リンク設定
- `site.config.js` — 公式メールアドレス・URL
- `assets/mark.svg` — 提供されたシンボル画像をベースにしたベクターロゴ
- `assets/og-image.svg` — SNS共有用画像
- `DESIGN_BRIEF.md` — ブランド・デザインの意図と運用上の注意

## Git workflow

- `main` はプロジェクト概要（README）を置くブランチとして維持します。
- Webサイト本体の実装・更新は `dev_branch` で行います。
- NIARIMは開発中のため、製品ステータスは `IN DEVELOPMENT` としています。

## Before publishing

1. サイトのコピー、商品ステータス、法定表示、リンク先が現状と一致することを確認します。
2. `miranima-studio.com` のDNSをホスティング先へ向け、HTTPSを有効にします。
3. 実際の解析・フォーム・Cookie運用に合わせて、必要なプライバシー情報を整備します。現状のお問い合わせは `mailto:` 方式で、Webフォームはありません。
