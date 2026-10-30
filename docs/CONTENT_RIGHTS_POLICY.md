# コンテンツ・権利・外部送信ポリシー

最終更新: 2026-10-30

## 対象と確認範囲

当サイトはCloudflare, Inc.と関係のない非公式のサービス索引であり、公式のロゴ、UI、ドキュメント本文を再配布するサイトではない。

- `data/services.json`: 61サービス。サービス名、短い日本語要約、用途、出典URLを管理。
- `data/updates.json`: 29件。公式Changelogの公開日、独自日本語見出し、短い日本語要約、記事URLを管理。
- `assets/hero-network.svg`, `favicon.svg`: リポジトリ内のSVG（由来を示す外部ファイルなし）。
- JavaScript/CSS/HTMLは外部CDNやトラッキングスクリプトを読み込まない。利用者のテーマ設定のみ`localStorage`に保存。

上記は**実装・構造の確認**であり、全90件について公式原文との文言照合や権利者による利用許諾を取得したことを意味しない。元文章の大規模転載は見られないが、各説明の翻案該当性は編集時に個別判断する。疑義があれば公開を急がず当該文章を差し替える。

## 記述を追加・更新する際のルール

1. 一次情報から製品の名称、用途、更新日などの**事実**を確認し、独立した日本語の説明を一から作成する。説明の順番や比喩・具体例をそのままなぞる翻訳／翻案をしない。
2. 公式の本文、画像、図表、スクリーンショット、ロゴをそのまま載せない。利用条件が個別に確認できない転載や翻案は公開しない。
3. `services.json`の`sourceUrls`と`docsUrl`、`updates.json`の`sourceUrl`に、参照した一次情報を記録し、画面から出典へ到達できることを確認する。リンクがあることだけで著作権の利用許諾が得られるわけではない。
4. どうしても著作物の転載・翻訳・翻案が必要な場合は、対象文書の適用ライセンスを個別に確かめ、権利者・原典URL・ライセンスURL・変更の有無を記録する。CC BY-SAの対象物には、ライセンスの継承を含む条件があり得るため、MITライセンスと混同しない。適用条件を満たせない場合は掲載せず独自の説明に戻す。
5. `data/*`の編集時には本文の類似性（文の順序・言い回し・独自の例示）を確認し、原文との実質的な複製になっていないことをレビューする。事実や一般的な技術用語と、創作的な表現を区別する。
6. 商標名は製品を識別する目的に限り使う。Cloudflare公式ロゴを使用せず、サイト名・SEOメタ情報・アプリ名にはCloudflareを組み込まない。最初の適切な商標表示と帰属文を維持する。
7. `index.html`、CSS、JSに第三者CDN・タグ・外部Webフォントを追加する場合、通信先・送信情報・適用法令・ユーザー向け案内を確認する。承認なしで外部送信を再導入しない。現状はOSのフォントへフォールバックする。
8. MITライセンスは当リポジトリにおける権利保有者のコード・文書等への許諾であり、出典元の権利を再許諾しない。商標の権利は各権利者に留保される。

## 確認に使う一次情報

- [Cloudflareの商標ガイドライン](https://www.cloudflare.com/trademark/)
- [Cloudflare Docsリポジトリ](https://github.com/cloudflare/cloudflare-docs) — READMEでドキュメントは原則CC BY 4.0、コードはMITと説明。
- [Cloudflareのライセンス案内](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/licenses/) — WorkersドキュメントにはCC BY-SA 4.0との記載。説明が食い違う場合は対象ドキュメントの権利条件を別途確認する。
- [Google Fontsのプライバシー説明](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html) — 外部配信時は利用者のIPアドレスが送信される。
- [IBM PlexのOFLライセンス](https://github.com/IBM/plex) — インストール済みのフォントの使用は可。リポジトリにフォントバイナリを配布する場合はSIL OFLの同梱・著作権表示等を別途満たすこと。

## 保留中の判断事項

- 個別のサービス・Changelog原文との**全件表現比較**は未完了。出典URL登録とデータ整合性の自動テストは、翻訳・翻案の法律判断の代わりにはならない。
- GitHubリポジトリは `edge-service-catalog` へ改名済み。GitHub上の新Pages案内URLは `https://yuuzin217.github.io/edge-service-catalog/`。旧URLの非転送リスク、旧リンクの更新、実サイト検証およびロールバックは [Pages URL移行Runbook](REPOSITORY_PAGES_MIGRATION.md) を参照。GitHub Pagesデプロイ成功だけで利用者環境の実動作確認が完了したとは扱わない。
- 法的な適法性や商標利用許可は保証・取得していない。判断が必要な場合は権利者・専門家に確認する。
