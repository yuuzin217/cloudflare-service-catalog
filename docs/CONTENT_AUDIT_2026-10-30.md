# 掲載本文の著作権・原典照合台帳 — Issue #10

作成日: 2026-10-30  
対象: `data/services.json` 61件の `summaryJa`・`descriptionJa`、`data/updates.json` 29件の `titleJa`・`summaryJa`。

**本台帳は一次スクリーニングであり、著作権侵害がないとの最終判断やライセンスの個別許諾確認を意味しない。** 公式資料の語順・説明構成まで対照できていない場合、判定は「一次確認」に留める。**「一次確認」を「独自要約で問題なし」や監査完了と同一視しない。**

## 今回の作業結果

- 公式の登録先URLへのアクセス結果: サービス61/61件、更新28/29件の本文ページを取得。更新1件は404（`workers-byoip-context-20261013`）。
- **詳細対照: 7件** — 公式本文の記述を見ながら日本語見出し・要約と照合。特定の専門用語、版数、変更日時といった事実のみを扱い、元資料の具体的な例示や構成を持ち込まないようチェック。
- **一次確認（未完了）: 82件** — 公式ページを取得し、短い機能・変更の説明であることを確認。完全な表現・文の構造比較と権利帰属の検証は引き続き必要。
- **要原典再確認: 1件** — 公式の参照URLが404。関連する二次情報の存在だけでは原典の検証・再利用条件の確証にはならない。
- URLを開けたことや公式情報と一致する事実が存在することは、元の創作的な文章を翻案してもよいという許諾ではない。
- 確認済みページにもURLリダイレクトがある。例: Browser Rendering→Browser Run、Page Shield→Client-side security、Cloudflare One旧Docsパス。これらは今回の著作権調査ではリンク切れ扱いにしない。製品名・URLの変更は別の根拠確認を要する。

## 判定ルール

| 判定 | 意味 | Issue #10完了判定への扱い |
| --- | --- | --- |
| 詳細対照 | 公開された公式記事の具体的な記述と、日本語の見出し・要約を個別比較し、独立の短い事実説明と暫定判断した。 | 法律上の保証ではないが、編集レビュー済みとして扱う |
| 一次確認 | 公式の指定URLから概要を取得したが、詳細の表現比較・転載/翻案条件を決定していない。 | **未完了。** 今後全文比較して再分類 |
| 要原典再確認 | 公式URLを取得できない、または根拠が欠ける。 | **未完了。** 根拠取得まで確認済みにしない |

**適用ライセンスの確認:** [Cloudflare Docsリポジトリ](https://github.com/cloudflare/cloudflare-docs)は原則CC BY 4.0、[CloudflareのWorker向け案内](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/licenses/)にはCC BY-SA 4.0との記述もある。原文のコピー・翻訳・翻案を行う場合、各ページでライセンス対象・帰属表示・改変表示・継承要件を調べ、独自MITライセンスだけで上書きしない。今回のリライトは元記事の一部を転載するのではなく、**技術的な事実・実務上の注意を簡潔に記述する**方針。これは権利者の許諾を証明するものではない。

## `LICENSE`の権利者表示の確認

`LICENSE`には `Copyright (c) 2026 脱力（datsuryoku）` とある。公開`main`のGitコミット（直近7件）はGitHubユーザー `yuuzin217` に紐づく作者名 `脱力（datsuryoku）` であり、**表記の不一致は現時点では検出していない**。ただし、コミットの名義と著作権の実際の帰属・第三者素材の適用条件は別問題。元データ・UIの制作経緯、他者の寄稿・転載素材の有無は依然未確認であり、**権利者の合意なくLICENSEを書き換えない**。外部由来の原文を当リポジトリのMITに包含することはしない。

## 個別一覧（90件）

列の出典URLは監査対象JSONの記録値と一致させる。ページの取得確認は2026-10-30時点のもので、将来のHTTP 200を保証しない。

| 種類 | ID | 原典URL | 判定 | 根拠・残作業 |
| --- | --- | --- | --- | --- |
| service | `workers` | https://developers.cloudflare.com/workers/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `pages` | https://developers.cloudflare.com/pages/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `email-service` | https://developers.cloudflare.com/email-service/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `containers` | https://developers.cloudflare.com/containers/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `sandboxes` | https://developers.cloudflare.com/sandbox/ | 一次確認 | 独自の機能説明として一次確認。数値・Beta・プラン条件は細部の一次情報照合を継続（著作権判定は保留）。 |
| service | `durable-objects` | https://developers.cloudflare.com/durable-objects/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `workflows` | https://developers.cloudflare.com/workflows/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `workers-for-platforms` | https://developers.cloudflare.com/cloudflare-for-platforms/workers-for-platforms/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `browser-run` | https://developers.cloudflare.com/browser-rendering/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `workers-observability` | https://developers.cloudflare.com/workers/observability/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `d1` | https://developers.cloudflare.com/d1/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `r2` | https://developers.cloudflare.com/r2/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `workers-kv` | https://developers.cloudflare.com/kv/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `queues` | https://developers.cloudflare.com/queues/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `k2` | https://developers.cloudflare.com/k2/ | 一次確認 | 独自の機能説明として一次確認。数値・Beta・プラン条件は細部の一次情報照合を継続（著作権判定は保留）。 |
| service | `hyperdrive` | https://developers.cloudflare.com/hyperdrive/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `pipelines` | https://developers.cloudflare.com/basin-pipelines/ | 一次確認 | 独自の機能説明として一次確認。数値・Beta・プラン条件は細部の一次情報照合を継続（著作権判定は保留）。 |
| service | `basin` | https://developers.cloudflare.com/basin/ | 一次確認 | 独自の機能説明として一次確認。数値・Beta・プラン条件は細部の一次情報照合を継続（著作権判定は保留）。 |
| service | `cache-reserve` | https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `secrets-store` | https://developers.cloudflare.com/secrets-store/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `artifacts` | https://developers.cloudflare.com/artifacts/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `workers-ai` | https://developers.cloudflare.com/workers-ai/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `ai-gateway` | https://developers.cloudflare.com/ai-gateway/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `ai-search` | https://developers.cloudflare.com/ai-search/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `ai-crawl-control` | https://developers.cloudflare.com/ai-crawl-control/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `agents` | https://developers.cloudflare.com/agents/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `vectorize` | https://developers.cloudflare.com/vectorize/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `waf` | https://developers.cloudflare.com/waf/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `ddos-protection` | https://developers.cloudflare.com/ddos-protection/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `bots` | https://developers.cloudflare.com/bots/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `api-shield` | https://developers.cloudflare.com/api-shield/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `turnstile` | https://developers.cloudflare.com/turnstile/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `page-shield` | https://developers.cloudflare.com/page-shield/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `cloud-workload-security` | https://developers.cloudflare.com/cloudflare-one/cloud-workload-security/ | 一次確認 | 独自の機能説明として一次確認。数値・Beta・プラン条件は細部の一次情報照合を継続（著作権判定は保留）。 |
| service | `security-center` | https://developers.cloudflare.com/security-center/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `leaked-credentials` | https://developers.cloudflare.com/waf/detections/leaked-credentials/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `dns` | https://developers.cloudflare.com/dns/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `load-balancing` | https://developers.cloudflare.com/load-balancing/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `argo-smart-routing` | https://developers.cloudflare.com/argo-smart-routing/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `magic-transit` | https://developers.cloudflare.com/magic-transit/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `magic-wan` | https://developers.cloudflare.com/cloudflare-wan/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `magic-firewall` | https://developers.cloudflare.com/cloudflare-network-firewall/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `spectrum` | https://developers.cloudflare.com/spectrum/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `network-interconnect` | https://developers.cloudflare.com/network-interconnect/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `china-network` | https://developers.cloudflare.com/china-network/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `registrar` | https://developers.cloudflare.com/registrar/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `cloudflare-for-saas` | https://developers.cloudflare.com/cloudflare-for-saas/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `waiting-room` | https://developers.cloudflare.com/waiting-room/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `ssl-tls` | https://developers.cloudflare.com/ssl/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `cdn-cache` | https://developers.cloudflare.com/cache/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `access` | https://developers.cloudflare.com/cloudflare-one/applications/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `gateway` | https://developers.cloudflare.com/cloudflare-one/traffic-policies/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `cloudflare-tunnel` | https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `browser-isolation` | https://developers.cloudflare.com/cloudflare-one/policies/browser-isolation/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `casb` | https://developers.cloudflare.com/cloudflare-one/applications/scan-apps/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `data-loss-prevention` | https://developers.cloudflare.com/cloudflare-one/data-loss-prevention/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `digital-experience-monitoring` | https://developers.cloudflare.com/cloudflare-one/insights/dex/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `warp-client` | https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/ | 一次確認 | 製品用途を技術用語で説明する短文。公式概要へアクセス済み、翻案の詳細比較は未完了。 |
| service | `images` | https://developers.cloudflare.com/images/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `stream` | https://developers.cloudflare.com/stream/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| service | `realtime` | https://developers.cloudflare.com/realtime/ | 一次確認 | 機能・利用目的の短い日本語説明。公式概要へアクセス済み、表現構成の詳細比較は未完了。 |
| update | `waf-brotli-nextjs-emergency-20261025` | https://developers.cloudflare.com/changelog/post/2026-10-25-emergency-waf-release/ | 詳細対照 | CVE番号、Log既定、既存Block上書きの影響を原典本文と照合。具体的なリスクを事実中心に編集。 |
| update | `d1-undelete-seven-days-20261023` | https://developers.cloudflare.com/changelog/post/2026-10-23-undelete-seven-day-window/ | 詳細対照 | 7日制限の条件と削除後の復元可否を原典本文と照合。機能変更の事実のみ記述。 |
| update | `workers-builds-package-manager-20261023` | https://developers.cloudflare.com/changelog/post/2026-10-23-workers-builds-pin-npm-version/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `warp-windows-beta-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-warp-windows-beta/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `warp-macos-beta-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-warp-macos-beta/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `agents-mcp-sse-retirement-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-cloudflare-mcp-servers-retire-sse/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `agents-pi14-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-pi-harness-pi-1-4/ | 詳細対照 | Pi 1.4／SDK 0.30.0、復旧改善、ストレージ互換性の注意を原典本文と照合。 |
| update | `sandboxes-emudhra-ca-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-emudhra-certificates/ | 詳細対照 | SDK 0.x／1.x別の必要対応を原典本文と照合。詳細な手順は転載せず利用者が実施すべき要旨を簡略化。 |
| update | `tunnel-path-normalization-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-cloudflared-path-normalization/ | 詳細対照 | 2026.10.0と2027-01-25の切替予定およびAccess条件を原典本文と照合。 |
| update | `tunnel-read-monitor-ga-20261022` | https://developers.cloudflare.com/changelog/post/2026-10-22-granular-read-and-monitor-ga/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `agents-createai-20261021` | https://developers.cloudflare.com/changelog/post/2026-10-21-createai/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `basin-sql-offset-20261021` | https://developers.cloudflare.com/changelog/post/2026-10-21-basin-sql-offset/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `waf-managed-emergency-20261021` | https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-cfmr/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `waf-free-emergency-20261021` | https://developers.cloudflare.com/changelog/post/2026-10-21-emergency-waf-release-free/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `warp-windows-client-2026-10-20` | https://developers.cloudflare.com/changelog/post/2026-10-20-warp-windows-ga/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `warp-macos-client-2026-10-20` | https://developers.cloudflare.com/changelog/post/2026-10-20-warp-macos-ga/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `warp-linux-client-2026-10-20` | https://developers.cloudflare.com/changelog/post/2026-10-20-warp-linux-ga/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `agents-mcp-step-up-2026-10-19` | https://developers.cloudflare.com/changelog/post/2026-10-19-cloudflare-mcp-step-up/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `bots-precursor-monitor-mode-2026-10-19` | https://developers.cloudflare.com/changelog/post/2026-10-19-precursor-monitor-mode/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `cloud-workload-security-beta-20261019` | https://developers.cloudflare.com/changelog/post/2026-10-19-cloud-workload-security-beta/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `workers-ai-clairic-preview-2026-10-19` | https://developers.cloudflare.com/changelog/post/2026-10-19-clairic-workers-ai/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `workers-ai-deepseek-v41-flash-2026-10-19` | https://developers.cloudflare.com/changelog/post/2026-10-19-deepseek-v4.1-flash-workers-ai/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `workers-cron-local-explorer-2026-10-17` | https://developers.cloudflare.com/changelog/post/2026-10-17-local-explorer-cron-triggers/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `ai-search-cjk-keyword-search-2026-10-16` | https://developers.cloudflare.com/changelog/post/2026-10-16-cjk-keyword-search/ | 詳細対照 | trigram・CJK検索のサポート事実を原典本文と照合。公式例文は転載しない。 |
| update | `tunnels-platforms-50000-routes-2026-10-16` | https://developers.cloudflare.com/changelog/post/2026-10-16-tunnels-for-platforms-and-50k-routes/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `gateway-workers-public-beta-20261015` | https://developers.cloudflare.com/changelog/post/2026-10-15-gateway-workers-public-beta/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `workers-build-tooling-20261014` | https://developers.cloudflare.com/changelog/post/2026-10-14-workers-builds-default-tooling/ | 一次確認 | 公式Changelog本文にアクセスし、日付・版数・機能名・変更内容を概観。見出し/文章構成の詳細対照は継続。 |
| update | `workers-byoip-context-20261013` | https://developers.cloudflare.com/changelog/post/2026-10-13-byoip-workers-subrequest-context/ | 要原典再確認 | 公式Changelogの指定URLが404。別の公式記事で公開日・事実を確証できず、原文比較不可。公開表示を確認済み扱いにしない。 |
| update | `workers-runtime-grace-period-20261012` | https://developers.cloudflare.com/changelog/post/2026-10-12-longer-runtime-update-grace-period/ | 詳細対照 | 最大20分の猶予およびWebSocketが途中切断され得る注意書きを原典本文と照合。 |

## 今後の実務

1. **一次確認82件**: 公式原文の文章・段落構成（英語の逐語翻訳、比喩、具体的なユースケースの順番を含む）とJSONの個別フィールドを詳細に対照。必要なら記述をさらに短い独自の事実説明に書き換え、台帳の判定と根拠を更新する。
2. **404の1件**: Cloudflare公式の元記事または同等の一次記録を見つけてURLと日付・内容を検証。見つからなければ、無理に公式リンクを別のページで代用しない。記事を残すか非掲載にするかは根拠に基づき判断する。
3. **LICENSE著作権者**: Git履歴以外に第三者の寄稿・外部素材の取り込みがあるか、所有者に確認する。外部コードや文章があるなら個別のライセンスを保全する。
4. **公開確認**: 詳細表示から各サービスの公式Docs、各Changelogへのリンクを確認する。404記事のリンクを「正常」と判定しない。
5. **レビューゲート**: 90件がすべて詳細対照済みになり、要原典再確認0件、権利者確認が揃うまでIssue #10は閉じない。新しい掲載文を追加・更新した場合は台帳の判定を再評価する。

