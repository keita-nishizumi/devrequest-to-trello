# Vf Request To Trello

[開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLSdg6VoERTJu93CrJagIF5PIgO6rL4Gw7OaolL6DVLcF6-1MXA/viewform)のフォームが送信されると、Trello内の所定のボードの所定のリストにカードを追加する。

## 開発環境構築手順

Windows PCでの開発環境構築手順を以下に示します。

### [こちらの記事](https://eng-entrance.com/git-install#Git-2)にしたがってGit及びGit Bashをインストール

以下コマンドラインによる操作は全てGit Bashを使うことをおすすめします。
コマンド操作がうまくいかない場合はGit Bashのプロキシの設定をしてみてください。

### [GASのChrome拡張](https://chrome.google.com/webstore/detail/google-apps-script/eoieeedlomnegifmaghhjnghhmcldobl?hl=ja&hl=ar)をインストール

### [こちらの記事](https://qiita.com/taiponrock/items/9001ae194571feb63a5e)にしたがって[node.js](https://nodejs.org/en/)とnpmをインストール

Git Bash同様、npmのコマンドがうまくいかない場合はやはりプロキシを設定してみてください。

### Google App Script（以下、GAS）専用のCLIであるclaspをインストール

```bash
npm i @google/clasp -g
```

### 初回のみ、claspで自分のGoogleアカウントにログイン

claspはプロキシ設定不要かもしれません（私の環境では不要でした）。

```bash
clasp login
```

### ローカルの任意のディレクトリにこのリポジトリをクローンします

```bash
git clone https://github.com/keita-nishizumi/devrequest-to-trello.git
```

### `form`ディレクトリと`spread_sheet`ディレクトリのそれぞれの配下に`.clasp.json`というファイルを作成し、スクリプトIDを記載


form/.clasp.json
```json
{"scriptId":"[フォームのスクリプトID]"}
```

spread_sheet/.clasp.json
```json
{"scriptId":"[スプレッドシートのスクリプトID]"}
```

※スクリプトIDは、フォームやスプレッドからスクリプトを開いて、次のクリックパスで確認できます。

ファイル > プロジェクトのプロパティ

### `form`ディレクトリ配下にappsscript.jsonを作成し、スプレッドシートのスクリプトIDを設定

```json
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {
    "libraries": [
      {
        "userSymbol": "SpreadSheetScript",
        "libraryId": "[スプレッドシートのスクリプトID]",
        "version": "1"
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```
### [こちら](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=ja)からGASをChromeに追加



### スプレッドシートがあるのと同じディレクトリに`store.json`というファイルを作成し、以下を記述

```json
{
    "user_name": "[Trelloのユーザ名]",
    "api_key": "[TrelloのAPIキー（後述）]",
    "api_token": "[TrelloのAPIトークン（後述）]",
    "team_name": "自分が参加しているチーム名",
    "request_list_name": "依頼",
    "selected_system_column_no": "3",
    "client_name_column_no": "4",
    "title_column_no": "5",
    "background_column_no": "6",
    "required_spec_column_no": "7",
    "expected_effect_column_no": "8",
    "delivery_date_column_no": "9",
    "client_team_column_no": "10",
    "stamp_image_column_no": "11",
    "attachment_file_column_no": "12",
    "card_link_column_no": "13",
    "attachment_error_column_no": "14"
}
```

|プロパティ|値   |
| ------ | --- |
| user_name | Trelloのプロフィールから確認してください |
| api_key   | [ここから取得](https://trello.com/app-key)       |
| api_token | [ここから自動生成する](https://trello.com/app-key) |
| team_name | チームのトップページを開き、URLの末尾を入力してください。`trello.com/チームID`となっています。 |

### スプレッドシート側の`setPropaties()`関数を実行
JSONの内容を読み込んで、スクリプトのプロパティに反映します。

## 編集したコードのデプロイ

フォームのコードを編集した場合は`form/`配下で、スプレッドシートの場合は`spread_sheet/`配下で、以下のコマンドでコードをプッシュできます。

```bash
clasp push
```

逆にプルもできます。

```bash
clasp pull
```

## メンテ手順

新しいボードが追加されたり、毎年4月にTrelloに新しいチームが作成されたら、以下の手順で「スクリプトのプロパティ」を設定してください。

### 1. スプレッドシート（フォームの送信結果が集まるスプレッドシート）にアクセス

### 2. スクリプトのプロパティを開く

ファイル > プロジェクトのプロパティ > スクリプトのプロパティ

### 3. 管理者のユーザ情報（ユーザ名、APIキー、APIトークン）とチームのIDを設定

※必ずチームに参加しているTrelloユーザで行ってください
スプレッドシートと同じディレクトリにある`store.json`ファイルで次の値を設定します。

|プロパティ|値   |
| ------ | --- |
| user_name | Trelloのプロフィールから確認してください |
| api_key   | [ここから取得](https://trello.com/app-key)       |
| api_token | [ここから自動生成する](https://trello.com/app-key) |
| team_name | チームのトップページを開き、URLの末尾を入力してください。`trello.com/チームID`となっています。 |

### 4. Trelloの各ボードに、依頼リストを作成

それぞれのボードで、タイトルに「依頼」の文言が含まれるリストがカード追加の対象になります。

もし「依頼」以外の文言を使いたい場合は、スクリプトのプロパティで`request_list_name`項目を編集してください。

### 5. フォームがスプレッドシートのスクリプトと結び付けられていることを確認

フォーム側のスクリプトで「リソース」>「ライブラリ」と進み、「SpreadSheetScript」の別名が付いたライブラリが登録されていることを確認します。

### 6. フォームをチェックする

[開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLSdg6VoERTJu93CrJagIF5PIgO6rL4Gw7OaolL6DVLcF6-1MXA/viewform)へアクセスし、最初の質問「開発を依頼するシステムを選択してください」で、依頼リストをもつボード名が全て表示されていることを確認してください。

## トリガー設定

フォームとスプレッドシートでそれぞれ以下のトリガー設定がされている必要があります。

### フォーム側

起動時に`setFirstQuestion()`関数を実行

### スプレッドシート側

フォーム送信時に`addTrelloCard()`関数を実行

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
