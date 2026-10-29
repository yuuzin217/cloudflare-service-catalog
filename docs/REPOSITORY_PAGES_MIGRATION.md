# GitHubリポジトリ名・Pages公開URL移行Runbook（Issue #9）

更新日: 2026-10-30
状態: **移行用PRを準備中。GitHubリポジトリのリネームと公開URL切替は未実施。**

## 1. 変更対象と影響

| | 移行前（現在） | 移行後（候補） |
| --- | --- | --- |
| リポジトリ | `yuuzin217/cloudflare-service-catalog` | `yuuzin217/edge-service-catalog` |
| リポジトリURL | https://github.com/yuuzin217/cloudflare-service-catalog | https://github.com/yuuzin217/edge-service-catalog |
| Pages既定URL | https://yuuzin217.github.io/cloudflare-service-catalog/ | https://yuuzin217.github.io/edge-service-catalog/ |
| 表示ブランド | エッジサービス図鑑（PR #8から変更済み） | 変更なし |
| サービスデータ | 61サービス・29件更新 | 変更なし |

GitHub公式ドキュメントによれば、リポジトリ名変更時に **GitHub上の旧リポジトリ・Issue・PRなどのURLは新URLへ転送されるが、GitHub Pagesの旧プロジェクトサイトURLは自動転送されない**。Git clone等の旧リモートは当面利用可能でも、新URLへ変更することを推奨している。古いリポジトリ名の再利用はGitHubのリダイレクトを失わせるため避ける。

出典: [GitHub公式リポジトリ名変更](https://docs.github.com/ja/repositories/creating-and-managing-repositories/renaming-a-repository)

### 制約と既知・未確認の切り分け

- 確認済み: `main`で独立ブランド・権利表記（PR #8）を導入。CSS/JS/JSONは相対URLで静的ファイルを読み込んでいる。移行準備PRで `index.html` のGitHub参照3か所、README/ポリシー、Playwrightの固定パスを更新する。
- 確認済み: ChatGPTの**Cloudflareサービス図鑑 週次更新**定期タスクは旧リポジトリ・旧Pages URLをプロンプトに保持している（毎週月曜7:00 JST、タスクID: `6ad854a008d881918b18dfcaa73527ac`）。**切替後すぐに更新する**。
- 確認済み: 新リポジトリ名 `yuuzin217/edge-service-catalog` は準備時点のGitHub REST参照で404（未作成の可能性）。リネーム可能性を保証するものではない。
- **未確認**: GitHub Pagesの現在の設定（Branch／Actions、フォルダー、カスタムドメイン、公開ドメイン設定）を参照できていない。GitHubのリポジトリメタ情報に`has_pages: true`はあるが、実URLと構成を所有者が `Settings → Pages` で確認する必要がある。
- 未確認: 他サイト、README以外の外部リンク、ブックマーク、CI以外の外部連携・API・キャッシュでの旧URLの利用。Github検索等で追加調査する。
- 現在のURLはGitHub Pagesの**既定URL候補**であり、カスタムドメインがあると異なる。

## 2. 変更前のpreflight（必須）

- [ ] リポジトリ `Settings → Pages` で、公開URL、Source、Branch/Folder、CNAME、HTTPSを確認・記録する（スクリーンショット等）。
- [ ] 現在の公開サイトがHTTPSで開き、検索、カテゴリ、詳細、最新更新、外部公式Docsリンクが動作することを確認する。
- [ ] 新リポジトリ名の使用可能性を実際に確認する。
- [ ] 既存のPRやワークフローを確認し、リネーム直前にリポジトリ変更の競合がないことを確認する。
- [ ] 旧Pages URL利用箇所（ユーザー側のブックマークや公開紹介リンク等）と週次自動更新タスクを移行対象に含める。
- [ ] 移行用PRのNode検証・PlaywrightがすべてPASSであることを確認する。
- [ ] **所有者の明示承認**: 変更対象、旧Pages URLがリダイレクトされないこと、短時間の公開断・リンク切れリスク、ロールバック手順を確認する。

## 3. 本番移行手順（承認後に順序を厳守）

1. **GitHubリポジトリの名前変更**: `Settings → General → Repository name` にて `edge-service-catalog` へ変更。これは本番公開URLに影響する操作であり、明示承認なしに実行しない。
2. **Pagesの公開設定確認**: 名前変更後のリポジトリの `Settings → Pages` を開く。新URLの表示、公開元、Deploy状況とHTTPSを確認する。自動的な公開や転送は保証しない。設定が変更されていた場合は記録した旧Sourceに沿って必要な設定を復元する（変更に追加承認が必要なら停止）。
3. **移行用PRを新リポジトリ名側で再取得・レビュー**: 最新のmainとの競合、改名後のPRリンク、CIを確認する。ソースは静的相対パスなので、新しいパスでの閲覧が想定される。GitHubリンクと文書はPRをマージすると新URLを指すようになる。マージは所有者の明示指示を得て実施する。
4. **定期タスクを更新**: タスク `6ad854a008d881918b18dfcaa73527ac` のプロンプト内の旧GitHub/Pages URLを新URLへ変更し、既存の月曜7:00 JSTスケジュール・制約・監査手順は維持する。更新結果と次回実行を確認。
5. **外部参照とローカルGitリモート更新**: `git remote set-url origin git@github.com:yuuzin217/edge-service-catalog.git` など、既存のSSH/HTTPS方式を維持して移行する。他のGitHub Issue、README、紹介文、保存リンク等を更新する。
6. **サイト確認**: 新Pages URLでHTTPS表示、61サービス/29件更新、JSON読込、検索、フィルタ、詳細、相対リソース、非公式表記、権利・プライバシー表記、GitHubリンクが正常であることを確認。Chromeとモバイル幅で確認する。
7. **旧URLの扱いを報告**: 旧GitHub PagesのURLは自動転送されないため、リンク切れ可能性を周知。旧名でリダイレクト用リポジトリを新規作成するとGitHubの旧リポジトリ転送を壊し、商標語を残すことにもなるため、本移行では作成しない。

## 4. ロールバックと停止条件

### 停止条件
- 新しいリポジトリ名が利用できない、カスタムドメインを含むPagesの構成不明、CI不合格、本番URL影響への承認なし、作業対象のPRが更新されている、予期しない外部依存が判明した場合は、名前変更・PRマージを行わない。
- 名前変更後、新URLに継続的な404、HTTPS不備、データ読込失敗があれば、影響範囲を記録し、公開設定/Actionsの不備を先に確認する。闇雲な再実行や機能変更をしない。

### 切り戻し
- 新URL公開を復旧できない場合、元のリポジトリ名へ戻すことを含め所有者の追加承認を得る。名前を戻せば以前のPages URLと自動公開が必ず復旧する保証はなく、`Settings → Pages` の設定・Actions・リンクを再確認する。
- 移行用PRをマージ済みなら、新URLを指すリンクや固定テストパスの変更を逆向きのPRで戻す。単純なforce pushや本番ブランチへの直接pushはしない。
- 週次更新タスクのURLは復旧した実際のURLへ戻して再検証する。
- 旧名での「転送専用リポジトリ」は作成しない。別途独自ドメインの導入を選ぶ場合は、DNSや課金・設定変更への承認と計画を新たに準備する。

## 5. PRの検証と完了条件

- `node --check assets/app.js`、`node scripts/validate-data.mjs`、`node scripts/test-regressions.mjs`、`node scripts/test-ui-regressions.mjs`、`node scripts/test-ui-browser.mjs`（Playwrightの実行環境がある場合）を確認。
- 320px／390px／768px／1280pxで新しい `/edge-service-catalog/` サブパスのブラウザテストを通す。外部通信が増えないことを確認。
- Pages URL変更は**実サイトでのHTTPS/データ取得/リンク/コンテンツ表示を確認して初めて「公開移行完了」**とする。PRのCI成功のみで本番移行完了とはしない。
- Issue #9は新URLでの運用確認・タスク更新・旧URLリスクの報告まで終えてからcloseする。
