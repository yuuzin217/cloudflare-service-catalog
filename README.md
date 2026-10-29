# エッジサービス図鑑

Cloudflare®の主要な製品・サービスを、日本語の概要・用途・関連サービスから探せる独立運営の非公式静的カタログです。製品情報はJSONで管理し、画面側でカテゴリ件数、検索結果、更新一覧を生成します。

Cloudflare, Inc.が運営・承認・後援するサイトではなく、提携関係もありません。最新の仕様、提供状況、料金は各ページから公式情報をご確認ください。

## 権利・商標・出典

- Cloudflare®およびCloudflareの製品名は、米国その他の国におけるCloudflare, Inc.の商標または登録商標です。[Cloudflareの商標ガイドライン](https://www.cloudflare.com/trademark/)を参照してください。本サイトはCloudflareの公式ロゴを使用せず、独自の図形を使用します。
- 製品・サービスの説明は公式情報を参照した独自の日本語要約です。公式の文章・画像・図表をそのまま転載することを前提としません。各製品の根拠URLは `data/services.json`、更新情報の原典URLは `data/updates.json` に記録しています。
- 本リポジトリのMITライセンスは、権利を保有する独自コード・文章などに適用されます。Cloudflareや第三者の商標、ロゴ、公式文書の著作権・ライセンスを再許諾するものではありません。公式文書を転載・翻訳・翻案する際は、対象資料のライセンスを個別に確認してください。[cloudflare/cloudflare-docs](https://github.com/cloudflare/cloudflare-docs)では原則CC BY 4.0が案内される一方、[Cloudflare Workersのライセンス説明](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/licenses/)ではCC BY-SA 4.0の記載もあります。資料・範囲による条件の違いを一律に解釈しないでください。
- 旧リポジトリ名と旧GitHub Pages URLは移行対象です。旧Pages URLはリポジトリのリネームだけでは転送されないため、移行中の既存リンクには影響が出る可能性があります（[Pages URL移行Runbook](docs/REPOSITORY_PAGES_MIGRATION.md)）。

## プライバシーと外部通信

- ページ読み込み時、Google Fontsなどの外部フォントCDN、外部解析・広告スクリプトを利用しません。Webフォントの代わりにインストール済みのIBM Plexファミリーを優先し、ない場合はOSの日本語フォントへフォールバックします。そのため、2026-10-30の変更前と文字幅や見た目が異なる場合があります。
- `localStorage`には任意のライト／ダークテーマの設定のみを保存します。カタログ自体にはログイン、フォーム送信、独自の追跡Cookie、ユーザー情報の独自収集機能はありません。
- GitHub Pagesの配信時に発生するホスティング事業者の通信・アクセスログ、および利用者が任意で公式DocsやGitHubなどの外部リンクを開いた際の通信は別です。これらについて、このリポジトリが一切のデータ取扱いを行わないことまで保証するものではありません。
- 一覧の各サービスは公式Docs・出典URLを表示し、公式Changelogは個別のリンクを表示します。根拠URLは事実確認のための参照であり、第三者の著作物の再利用を許可する意味ではありません。

詳細なコンテンツ制作・権利確認の基準は [docs/CONTENT_RIGHTS_POLICY.md](docs/CONTENT_RIGHTS_POLICY.md) を参照してください。

## ローカルで起動する

リポジトリのルートで簡易HTTPサーバーを起動します。JSONをfetchするため、index.htmlを直接開かずHTTP経由で確認してください。

    python3 -m http.server 8000

ブラウザーで http://localhost:8000/ を開きます。ビルドツールや外部ライブラリは不要です。

## ファイル構成

- index.html: ページ構造とメタ情報
- assets/styles.css: レスポンシブ表示とデザイン
- assets/hero-network.svg: ヒーロー背景のネットワーク図
- assets/app.js: 検索、絞り込み、並び替え、詳細表示
- data/categories.json: カテゴリ名、順序、説明
- data/services.json: サービス情報
- data/updates.json: 公開日を確認できた公式更新情報
- scripts/validate-data.mjs: JSON・参照関係の検証
- docs/UPDATE_RUNBOOK.md: 公式情報の確認と更新手順

## 画面の操作と確認ポイント

- 検索は入力時にリアルタイムに絞り込み、スペースで区切った複数語はAND条件です。Unicode NFKCと大文字小文字を正規化し、「サーバーレス／サーバレス」「ゼロトラスト／Zero Trust」の表記差も吸収します。検索結果件数は検索欄直下に表示され、「結果を見る」または検索確定で一覧に移動します。
- カテゴリ選択は検索条件とのAND絞り込みです。カードを再選択すると解除でき、一覧の「条件をリセット」で検索語とカテゴリを解除します（並び順・表示形式は保持します）。
- カテゴリ選択や検索確定時のスクロールは `prefers-reduced-motion` を尊重します。結果一覧の見出しへフォーカスを移し、キーボード操作でも位置を把握できます。
- ライト／ダークの手動設定はブラウザの `localStorage` に保持します。保存値がない場合はOS設定を使い、ストレージを利用できない場合もテーマ切り替えを継続します。
- 「掲載データの最新確認日」はサービスとChangelogの `verifiedAt` の最大値で、全サービスを一括確認した日付ではありません。最新仕様と料金はCloudflare公式Docsを参照してください。
- 回帰チェック（独立ブランド・非公式表記の検証を含む）：`node scripts/test-ui-regressions.mjs`。GitHub Actionsでは追加でPlaywright + Chromiumにより320px／390px／768px／1280pxの実ブラウザ操作（日本語IME・絞り込み解除後のフォーカス・ダイアログ・テーマ保持・リポジトリサブパス等）を検証し、スクリーンショットをArtifactとして保存します。Playwrightはテスト環境のみに導入し、公開サイトの実行依存にはしません。

## データの構造

services.jsonの各項目は安定したid、name、summaryJa、descriptionJa、category、tags、useCases、relatedServiceIds、docsUrl、productUrl、pricingUrl、sourceUrls、releaseStatus、featuredOrder、verifiedAtを持ちます。確認できない任意情報はnullにします。サービス名を変更しても参照関係が保たれるよう、idは変更しません。

カテゴリ件数はservices.jsonの実件数から計算します。注目順は利用者数の順位ではなく、featuredOrderによる編集上のおすすめです。

updates.jsonのpublishedAtには公式Changelogの公開日を記録します。情報を調べた日をverifiedAtに分けて記録し、文書の更新日とリリース日を混同しません。

## サービスを追加・修正する

1. Cloudflare公式の製品一覧と各サービスのドキュメントを照合します。
2. 独立した製品・サービスであることを確認し、機能説明や共通ガイドを重複登録しないようにします。
3. data/services.jsonに項目を追加または修正します。安定したid、公式docsUrl、確認したsourceUrlsを記録します。
4. 料金・提供状況を確認できない場合はpricingUrlまたはreleaseStatusをnullにします。
5. relatedServiceIdsが存在するidを参照することを確認します。
6. node scripts/validate-data.mjs を実行し、ローカル画面で検索、カテゴリ、詳細を確認します。

更新情報の追加や重複確認の詳しい手順は docs/UPDATE_RUNBOOK.md を参照してください。

## GitHub Pages

このリポジトリはビルド不要で公開できます。

1. PRをmainにマージした後、GitHubのリポジトリ設定で Settings → Pages を開きます。
2. Build and deployment の Source を Deploy from a branch にします。
3. Branch に main、フォルダーに /(root) を選び、保存します。
4. Pagesの画面に表示される公開状態を確認します。

リポジトリ名を `edge-service-catalog` に変更したうえで、main ブランチのルートを GitHub Pages の公開元に設定した場合の既定URLは https://yuuzin217.github.io/edge-service-catalog/ です。**リポジトリ名を変更しただけでは旧Pages URLは自動的に転送されません。** 実際の公開URL・Pages設定・公開状態は切り替え後に確認してください。カスタムドメイン設定がある場合はURLが異なります。変更手順・確認項目は [Pages URL移行Runbook](docs/REPOSITORY_PAGES_MIGRATION.md) に記録しています。

## 情報更新とメンテナンス

公式Products、Cloudflare Docsの製品一覧、公式Changelogを確認してから、根拠URLと実際の公開日をデータに記録します。取得に失敗したときは既存データや確認日を変更せず、情報が確認できた後に再開します。定期実行や更新検知用のGitHub Actionsは設定していません。

初期データの確認日: 2026-10-20
