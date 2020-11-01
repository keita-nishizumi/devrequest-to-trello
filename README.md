# Vf Request To Trello

[V-factory開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLScj3rb05Ze98xs1_LCxBjN1NSjBXXwUyVmbmdUrdHNmj8HU5A/viewform)のフォームが送信されると、Trello内の所定のボードの所定のリストにカードを追加する。

## 開発環境構築手順

Windows PCでの開発環境構築手順を以下に示します。

1. [こちらの記事](https://eng-entrance.com/git-install#Git-2)にしたがってGit及びGit Bashをインストール

以下コマンドラインによる操作は全てGit Bashを使うことをおすすめします。
コマンド操作がうまくいかない場合はGit Bashのプロキシの設定をしてみてください。

```bash
git config --global http.proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080
git config --global https.proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080
```

1. [node.js](https://nodejs.org/en/)をインストール

1. [こちらの記事](https://qiita.com/taiponrock/items/9001ae194571feb63a5e)にしたがってnpmをインストール

Git Bash同様、npmのコマンドがうまくいかない場合はやはりプロキシを設定してみてください。

```bash
$ npm -g config set proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080/
$ npm -g config set https-proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080/

# config確認
npm config list
```

1. Google App Script（以下、GAS）専用のCLIであるclaspをインストール

```bash
npm i @google/clasp -g
```

1. 初回のみ、claspで自分のGoogleアカウントにログイン

claspはプロキシ設定不要かもしれません（私の環境では不要でした）。

```bash
clasp login
```

1. ローカルの任意のディレクトリにこのリポジトリをクローンします

```bash
git clone https://github.com/keita-nishizumi/vf-request-to-trello.git
```

1. `form`ディレクトリと`spread_sheet`ディレクトリのそれぞれの配下に`.clasp.json`というファイルを作成し、スクリプトIDを記載


form/.clasp.json
```json
{"scriptId":"[フォームのスクリプトID]"}
```

spread_sheet/.clasp.json
```json
{"scriptId":"[スプレッドシートのスクリプトID]"}
```

※スクリプトIDは、フォームやスプレッドからスクリプトを開いて、次のクリックパスで確認できます。
ファイル > プロジェクトのプロパティ > スクリプトのプロパティ

## 編集したコードのデプロイ



TrelloのAPIキーやボード・リストIDはすべてプロジェクトのプロパティにセットしておき、そこから取得しています。

## Maintenance（編集中）

新しいボードが追加されたり、毎年4月にTrelloに新しいチームが作成されたら、以下の手順で「スクリプトのプロパティ」を設定してください。

1. 以下のスプレッドシート（フォームの結果）にアクセス

[V-factory開発依頼書（回答）](https://docs.google.com/spreadsheets/d/1cmBAS6tyYhg4_yOJ7P1OnxQ8qtl55YrM8lvikEPGgG8/edit#gid=1275307971)

1. スクリプトのプロパティを開く

ファイル > プロジェクトのプロパティ > スクリプトのプロパティ

1. 管理者のユーザ情報（ユーザ名、APIキー、APIトークン）を設定する ※必ずチームに参加しているTrelloユーザで行ってください

|プロパティ|値   |
| ------ | --- |
| user_name | Trelloのプロフィールから確認してください |
| api_key   | [ここから取得](https://trello.com/app-key)       |
| api_token | [ここから自動生成する](https://trello.com/app-key) |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License