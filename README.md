# Vf Request To Trello

This is an application that create new card when [V-factory development request form](https://docs.google.com/forms/d/e/1FAIpQLScj3rb05Ze98xs1_LCxBjN1NSjBXXwUyVmbmdUrdHNmj8HU5A/viewform) submitted.

## Installation

```bash
npm i @google/clasp -g
```

Please create `.clasp.json` file and input your script ID.

```json
{"scriptId":"[your script ID]"}
```

## Usage

[V-factory開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLScj3rb05Ze98xs1_LCxBjN1NSjBXXwUyVmbmdUrdHNmj8HU5A/viewform)のフォームが送信されると、Trello内の所定のボードの所定のリストにカードを追加する。

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