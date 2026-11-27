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

## Project files

- index.html — ページ構造・日本語コピー（共通SVGシンボル、OGP、構造化データを含む）
- styles/core.css — デザイントークン、タイポグラフィ、ヘッダー、モバイルメニュー、フッター
- styles/home.css — Hero / Name / NIARIM / Studio / Contact の各セクションとレスポンシブ
- script.js — 連絡先・リンク設定の反映、モバイルメニュー、現在地ナビ、NIARIMリールの位置表示
- mirror.js — Heroの鏡キャンバス（描いた線を中央軸で左右に映す）
- site.config.js — official email addresses and URLs
- assets/mark.svg — MIRANIMA symbol（ライム、暗い背景用）
- assets/favicon.svg / assets/apple-touch-icon.png — アイコン（インクの面にライムのシンボル）
- assets/og-image.png — SNS共有画像（1200×630）
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
