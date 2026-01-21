# Project TODO

## GitHubソースコード統合
- [x] GitHubリポジトリのクローン
- [x] clientディレクトリの移行
- [x] serverディレクトリの移行
- [x] sharedディレクトリの移行
- [x] 設定ファイル(vite.config.ts, tsconfig.json等)の移行
- [x] package.jsonの依存関係マージ
- [x] pnpm installの実行

## データベース設定
- [x] drizzle.config.tsの更新
- [x] データベーススキーマの確認と更新
- [x] マイグレーション実行(pnpm db:push)

## SendGridメール機能実装
- [x] SendGridパッケージのインストール
- [x] バックエンドにメール送信APIエンドポイント作成(tRPC)
- [x] 受信先メールアドレス(info@anyenv-inc.com)の設定
- [x] フロントエンドの問い合わせフォームコンポーネント作成
- [x] フォームからAPIエンドポイントの呼び出し実装

## ビルドとデプロイ
- [x] プロジェクトのビルド(pnpm build)
- [x] 開発サーバーでの動作確認
- [ ] 本番環境での動作確認

## ドキュメント作成
- [x] SENDGRID_API_KEY環境変数の設定手順ドキュメント作成
- [ ] チェックポイント保存
