# DevRequest To Trello

[開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLSdg6VoERTJu93CrJagIF5PIgO6rL4Gw7OaolL6DVLcF6-1MXA/viewform)のフォームが送信されると、Trello内の所定のボードの所定のリストにカードを追加する。

## 開発環境構築手順

### 1. chrome拡張をインストール

[Google Apps Script](https://chrome.google.com/webstore/detail/google-apps-script/eoieeedlomnegifmaghhjnghhmcldobl?hl=ja&hl=ar)

### 2. [node.js](https://nodejs.org/en/)をインストール

### 3. [こちらの記事](https://qiita.com/taiponrock/items/9001ae194571feb63a5e)にしたがってnpmをインストール

Git Bash同様、npmのコマンドがうまくいかない場合はやはりプロキシを設定してみてください。

```bash
$ npm -g config set proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080/
$ npm -g config set https-proxy http://[ユーザ名]:[パスワード]@webgate.amadagp.local:8080/

# config確認
npm config list
```

### 4. Google App Script（以下、GAS）専用のCLIであるclaspをインストール

```bash
npm i @google/clasp -g
```

### 5. 初回のみ、claspで自分のGoogleアカウントにログイン

claspはプロキシ設定不要かもしれません（私の環境では不要でした）。

```bash
clasp login
```

### 6. ローカルの任意のディレクトリにこのリポジトリをクローンします

```bash
git clone https://github.com/keita-nishizumi/vf-request-to-trello.git
```

### 7. `form`ディレクトリと`spread_sheet`ディレクトリのそれぞれの配下に`.clasp.json`というファイルを作成し、スクリプトIDを記載


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

### 8. `form`ディレクトリ配下にappscript.jsonを作成し、スプレッドシートのスクリプトIDを設定

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

## 編集したコードのデプロイ

フォームのコードを編集した場合は`form/`配下で、スプレッドシートの場合は`spread_sheet/`配下で、以下のコマンドでコードをプッシュできます。

```bash
clasp push
```

逆にプルもできます。

```bash
clasp pull
```

## メンテナンス手順

新しいボードが追加されたり、毎年4月にTrelloに新しいチームが作成されたら、以下の手順で「スクリプトのプロパティ」を設定してください。

### 1. 以下のスプレッドシート（フォームの送信結果が集まるスプレッドシート）にアクセス

[開発依頼書（回答）](https://docs.google.com/spreadsheets/d/1I4fNlQpzcrcaFH6lQdGydn_mLKR1K4HPLmdwwr0G-5o/edit?usp=sharing)

### 2. スクリプトのプロパティを開く

ファイル > プロジェクトのプロパティ > スクリプトのプロパティ

### 3. 管理者のユーザ情報（ユーザ名、APIキー、APIトークン）とチームのIDを設定する

※必ずチームに参加しているTrelloユーザで行ってください

|プロパティ|値   |
| ------ | --- |
| user_name | Trelloのプロフィールから確認してください |
| api_key   | [ここから取得](https://trello.com/app-key)       |
| api_token | [ここから自動生成する](https://trello.com/app-key) |
| team_name | チームのトップページを開き、URLの末尾を入力してください。`trello.com/チームID`となっています。 |

### 4. Trelloの各ボードに、依頼リストを作成する

それぞれのボードで、タイトルに「依頼」の文言が含まれるリストがカード追加の対象になります。

もし「依頼」以外の文言を使いたい場合は、スクリプトのプロパティで`request_list_name`項目を編集してください。

### 5. フォームがスプレッドシートのスクリプトと結び付けられていることを確認する

フォームの「リソース」から、スプレッドシート側のスクリプトIDを入力し、スクリプトを紐付けます。

### 6. フォームをチェックする

[開発依頼書](https://docs.google.com/forms/d/e/1FAIpQLSdg6VoERTJu93CrJagIF5PIgO6rL4Gw7OaolL6DVLcF6-1MXA/viewform)へアクセスし、最初の質問「開発を依頼するシステムを選択してください」で、依頼リストをもつボード名が全て表示されていることを確認してください。
※先に下の「トリガー設定」を行っておいてください。
※うまくいかない場合は何度か更新してみてください。

## トリガー設定

フォームとスプレッドシートでそれぞれ以下のトリガー設定がされている必要があります。

###　フォーム側

起動時に`setFirstQuestion()`関数を実行

### スプレッドシート側

フォーム送信時に`addTrelloCard()`関数を実行

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License