# SendGrid API キー設定手順

このドキュメントでは、Gemini活用セミナーLPでSendGridを使用した問い合わせメール送信機能を有効にするための環境変数設定手順を説明します。

## 概要

このアプリケーションでは、セミナー登録フォームから送信された情報を`info@anyenv-inc.com`に自動送信するために、SendGrid APIを使用しています。SendGridを正しく動作させるには、以下の環境変数を設定する必要があります。

## 必要な環境変数

### 1. SENDGRID_API_KEY（必須）

SendGridのAPIキーです。SendGridのダッシュボードから取得できます。

**設定方法:**

1. Manusの管理画面にアクセスします
2. プロジェクト「gemini-seminar-lp」を選択します
3. 右側のパネルで「Settings」→「Secrets」を開きます
4. 「Add Secret」ボタンをクリックします
5. 以下の情報を入力します:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: SendGridから取得したAPIキー（例: `SG.xxxxxxxxxxxxxxxxxxxxx`）
6. 「Save」をクリックして保存します

### 2. SENDGRID_FROM_EMAIL（オプション）

メール送信元のメールアドレスです。設定しない場合は、デフォルトで`noreply@manus.space`が使用されます。

**設定方法:**

SendGridで認証済みの送信元メールアドレスを使用する場合は、上記と同じ手順で以下の環境変数を追加します:

- **Key**: `SENDGRID_FROM_EMAIL`
- **Value**: 認証済みの送信元メールアドレス（例: `noreply@anyenv-inc.com`）

## SendGrid APIキーの取得方法

SendGridのAPIキーをまだ取得していない場合は、以下の手順で取得できます。

1. [SendGrid](https://sendgrid.com/)にログインします
2. 左側のメニューから「Settings」→「API Keys」を選択します
3. 「Create API Key」ボタンをクリックします
4. API Key名を入力します（例: `gemini-seminar-lp`）
5. 「Full Access」または「Restricted Access」を選択します
   - **推奨**: Restricted Accessを選択し、「Mail Send」権限のみを付与します
6. 「Create & View」をクリックします
7. 表示されたAPIキーをコピーして安全に保管します
   - **重要**: このAPIキーは一度しか表示されません。必ずコピーして保管してください

## 送信元メールアドレスの認証（オプション）

SendGridでカスタムの送信元メールアドレスを使用する場合は、事前に認証が必要です。

1. SendGridの左側メニューから「Settings」→「Sender Authentication」を選択します
2. 「Single Sender Verification」または「Domain Authentication」を選択します
3. 画面の指示に従って認証を完了します

## 環境変数設定後の確認

環境変数を設定した後は、以下の手順で動作を確認してください。

1. Manusの管理画面でサーバーを再起動します（Settings → General → Restart Server）
2. プレビュー画面でセミナー登録フォームにテストデータを入力して送信します
3. `info@anyenv-inc.com`にメールが届くことを確認します
4. データベースにも登録情報が保存されていることを確認します（Settings → Database）

## トラブルシューティング

### メールが送信されない場合

1. **環境変数が正しく設定されているか確認**
   - Manusの管理画面で「Settings」→「Secrets」を開き、`SENDGRID_API_KEY`が設定されていることを確認します

2. **APIキーの権限を確認**
   - SendGridのダッシュボードで、APIキーに「Mail Send」権限が付与されていることを確認します

3. **サーバーログを確認**
   - Manusの管理画面で「Dashboard」を開き、エラーログを確認します
   - `[SendGrid] SENDGRID_API_KEY is not set`というエラーが表示される場合は、環境変数が正しく設定されていません

4. **送信元メールアドレスの認証を確認**
   - `SENDGRID_FROM_EMAIL`を設定している場合は、SendGridで認証済みであることを確認します

### データベースに保存されない場合

1. データベース接続を確認します
2. マイグレーションが正しく実行されているか確認します:
   ```bash
   pnpm db:push
   ```

## セキュリティに関する注意事項

- APIキーは絶対にGitHubなどの公開リポジトリにコミットしないでください
- APIキーは環境変数として安全に管理してください
- 定期的にAPIキーをローテーションすることを推奨します
- 不要になったAPIキーは必ず削除してください

## サポート

問題が解決しない場合は、以下の情報を添えてサポートにお問い合わせください:

- エラーメッセージの詳細
- 設定した環境変数のキー名（値は含めないでください）
- SendGridのアカウント状態（アクティブかどうか）
- サーバーログの関連部分

---

**作成日**: 2026年1月21日  
**最終更新**: 2026年1月21日
