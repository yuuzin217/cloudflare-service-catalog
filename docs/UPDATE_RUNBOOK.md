# 情報更新Runbook

Cloudflare公式情報を確認し、サービス図鑑のJSONを安全に更新する手順です。情報を取得できなかった場合に既存データを削除したり、確認日だけを更新したりしません。

## 1. Cloudflare公式情報を取得する

次の一次情報を開きます。

- Cloudflare Products: https://www.cloudflare.com/products/
- Cloudflare Docs 製品一覧: https://developers.cloudflare.com/products/
- Cloudflare Changelog: https://developers.cloudflare.com/changelog/
- 対象サービスの公式ドキュメントと、そこからリンクされる公式料金ページ

サービス名、機能の説明、提供状況、料金、Changelogの公開日を別々に確認します。公式ページの「最終更新日」はChangelogの公開日として扱いません。

## 2. 既存データと比較する

- data/services.jsonのid、name、docsUrl、sourceUrlsを確認します。
- サービス名はUnicode NFKC正規化後に大文字・小文字を無視して比較します。
- 同じ公式URLや同義の製品名がないか確認します。
- ドキュメント上の機能、共通ガイド、APIリファレンスを独立サービスとして重複登録しないようにします。
- サービス名の変更があっても、参照用のidは維持します。

## 3. 新しいサービスを追加する

1. 公式製品一覧と対象サービスの公式ドキュメントで、独立した製品・サービスであることを確認します。
2. 小文字の英数字とハイフンからなる一意で安定したidを選びます。
3. data/services.jsonに必須項目を追加します。日本語のsummaryJa、descriptionJa、category、tags、useCases、docsUrl、sourceUrlsを記入します。
4. relatedServiceIdsには既存サービスのidだけを入れます。
5. productUrl、pricingUrl、releaseStatusが確認できない場合はnullにします。一般提供、Beta、Previewを推測で設定しません。
6. 根拠を確認した後でのみverifiedAtを更新します。

## 4. 既存サービス情報を修正する

- 公式ドキュメントを読み、誤りや変更が確認できたフィールドだけを修正します。
- nameが変わってもidは維持します。
- 説明、タグ、用途、関連サービス、公式リンクの変更に根拠URLを含めます。
- 料金や提供状態がページから確認できない場合は既存の推測値を追加せず、必要ならnullに戻します。
- 内容を再確認した日付のみverifiedAtに記録します。

## 5. Changelogから更新情報を追加する

1. Cloudflare Changelogの記事を開き、記事に表示された公開日をpublishedAtに記録します。
2. titleJaとsummaryJaは記事の変更内容を日本語で簡潔に要約します。
3. serviceIdsには関連する既存サービスのidを設定します。
4. typeは新サービスなら new-service、既存サービスの変更なら service-update、公開Betaなら public-beta を使います。
5. sourceUrlには該当するChangelog記事のURLを記録し、verifiedAtには内容を確認した日付を記録します。
6. 同じURL、公開日、正規化したタイトルの更新がないか確認します。
7. サービスの提供状況と、個別機能のBeta状態は区別します。

## 6. 重複を検出する

- services.jsonではidとUnicode NFKC正規化したnameの重複を確認します。
- relatedServiceIdsが存在するサービスを参照していることを検証します。
- 同一サービスに複数の説明が作られていないか、docsUrlとsourceUrlsも比較します。
- updates.jsonではid、sourceUrl、publishedAtと正規化したtitleJaの組み合わせを確認します。
- 更新内容が既存項目に含まれる場合は、新しい行を追加せず既存項目を修正します。

## 7. JSONを検証する

リポジトリのルートで次を実行します。

    node scripts/validate-data.mjs

成功時はカテゴリ数、サービス数、更新情報数が表示されます。JSON構文、必須項目、重複ID・名前、カテゴリ、関連参照、日付、公式URLを検証します。エラーが出た場合はPRを作らず修正して再実行します。

## 8. 更新後の画面を確認する

1. ルートから簡易HTTPサーバーを起動します。

       python3 -m http.server 8000

2. http://localhost:8000/ を開き、全サービス件数とカテゴリ別件数を確認します。
3. 新しいサービス名、日本語の説明、タグ、カテゴリで検索します。
4. カテゴリ絞り込みと検索を組み合わせ、名前順・カテゴリ順・注目順を確認します。
5. カード表示とリスト表示、サービス詳細、関連サービスリンクを確認します。
6. 更新情報の日付、サービスリンク、公式Changelogリンクを確認します。
7. デスクトップとスマートフォン幅で横スクロール、文字の欠け、ボタン操作を確認します。

## 9. PR作成時の確認事項

PRの説明に、変更したサービスや更新情報、verifiedAt、根拠となるCloudflare公式URL、JSON検証結果、画面確認結果を書きます。PR差分に無関係な変更や、情報確認だけを装う日付変更が含まれていないことを確認します。レビュー後にmainへ取り込みます。定期実行や自動更新用のActionsは作成しません。

## 10. 情報取得に失敗した場合

- 既存データを消去しません。
- verifiedAtやpublishedAtを更新しません。
- 失敗したURLと確認できなかった内容を作業メモに残します。
- 変更可能な他の公式情報がある場合は、その内容だけを独立して確認します。
- 根拠を確認できるまで該当サービスや更新情報を追加・修正せず、次回確認します。
