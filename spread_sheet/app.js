// DevRequest To Trello(公開版)
// プロパティを初期化するときは以下のコメントアウトを外して、logProperties()を実行
// logProperties();

function logProperties() {
    const fileIT = DriveApp.getFilesByName('store.json').next();
    const textdata = fileIT.getBlob().getDataAsString('utf8');
    const prop_json = JSON.parse(textdata);

    const properties = PropertiesService.getScriptProperties();

    for (let key in prop_json) {
        properties.setProperty(key, prop_json[key]);
        Logger.log('key:' + key + ' value:' + properties.getProperty(key));
    }
}

//始めに、プロジェクトのプロパティを読み込む
const properties = PropertiesService.getScriptProperties();

// ユーザー名
const user_name = properties.getProperty('user_name');

// APIキーとトークン
const api_key = properties.getProperty('api_key');
const api_token = properties.getProperty('api_token');

const team_name = properties.getProperty('team_name');
const request_list_name = properties.getProperty('request_list_name');

const request_lists = JSON.parse(setProperties());

// ---ここから列番号の取得---
const selected_system_column_no = properties.getProperty('selected_system_column_no');    // 最初の質問の答え（開発を依頼するシステムの選択）が入っている列の番号
const client_name_column_no = properties.getProperty('client_name_column_no');            // 依頼人氏名の列番号
const title_column_no = properties.getProperty('title_column_no');                        // カード名の列番号
const background_column_no = properties.getProperty('background_column_no');              // 背景の記述の列番号
const required_spec_column_no = properties.getProperty('required_spec_column_no')         //やりたいことの記述の列番号
const expected_effect_column_no = properties.getProperty('expected_effect_column_no')     //期待される効果の列番号
const delivery_date_column_no = properties.getProperty('delivery_date_column_no')         //希望納期の列番号
const client_team_column_no = properties.getProperty('client_team_column_no')             //依頼元担当者（複数可）の列番号
const stamp_image_column_no = properties.getProperty('stamp_image_column_no');            // 印鑑画像の列番号
const attachment_file_column_no = properties.getProperty('attachment_file_column_no');    // 添付ファイルの列番号
const card_link_column_no = properties.getProperty('card_link_column_no');                // カードへのリンクを挿入する列の番号
const attachment_error_column_no = properties.getProperty('attachment_error_column_no');  //添付ファイルのエラー文言を挿入する列の番号
// ---ここまで列番号の取得---

function setProperties() {
  const boards = getTeamBoards(team_name);
  const request_lists_json = getRequestLists(boards, request_list_name);
  const request_lists = JSON.stringify(request_lists_json);
  properties.setProperty('request_lists', request_lists);
  return request_lists;
}

// チーム名を渡すと、そのチームの全ボードIDを取得してくれる関数
function getTeamBoards(team_name) {
  const url = `https://api.trello.com/1/organizations/${team_name}/boards?key=${api_key}&token=${api_token}&fields=id,name`;
  const response = UrlFetchApp.fetch(url, {'method':'get'});
  const response_data = JSON.parse(response.getContentText());
  return response_data;
}

// ボードのリストとリスト名を渡すと、それぞれのボードの中で指定したリスト名をもつリストのIDを取得してくれる関数
// 返り値は{ボード名：指定したリストのID}の配列になる
function getRequestLists(boards, request_list_name) {
  const retMap = boards.map(board => {
    const url = `https://api.trello.com/1/boards/${board.id}/lists?key=${api_key}&token=${api_token}&filter=open&fields=id,name`
    const response = UrlFetchApp.fetch(url, {'method':'get'});
    const response_data = JSON.parse(response.getContentText());
    // 名前にlist_nameが含まれているリストだけ抜き出します
    const request_lists = response_data.filter(list => list.name.indexOf(request_list_name) >= 0 );
    if (request_lists[0]) {
      return {
        'board_id': board.id,
        'board_name': board.name,
        'list_id': request_lists[0].id,
        'list_name': request_lists[0].name
      };
    }
  })
  return retMap.filter(e => e);
}

function addTrelloCard() {
  // 最後の行を取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const last_row = sheet.getLastRow();

  const selected_system = sheet.getRange(last_row, selected_system_column_no).getValue();
  const list_id = request_lists.find(list => list.board_name == selected_system).list_id;

  //リストIDが取得できなければ強制終了
  if (!list_id) {
    sheet.getRange(last_row, card_link_column_no).setValue('Could not fetch list_id.');
    return null;
  }

  const card_title = sheet.getRange(last_row, title_column_no).getValue();
  const client_name = sheet.getRange(last_row, client_name_column_no).getValue();

  //ここでdescriptionの記述内容を取得
  const background = sheet.getRange(last_row, background_column_no).getValue();
  const required_spec = sheet.getRange(last_row, required_spec_column_no).getValue();
  const expected_effect = sheet.getRange(last_row, expected_effect_column_no).getValue();
  const delivery_date = sheet.getRange(last_row, delivery_date_column_no).getValue();
  const client_team = sheet.getRange(last_row, client_team_column_no).getValue();

  // Markdownのdescriptionを生成
  const card_description = generateDescription(background, required_spec, expected_effect, delivery_date, client_team);

  const url = 'https://api.trello.com/1/cards/?key=' + api_key + '&token=' + api_token;
  const options = {
    'method' : 'post',
    'muteHttpExceptions' : true,
    'payload' : {
      'name'      : card_title + ' #' + client_name,
      'desc'      : card_description,
      'due'       : '',
      'idList'    : list_id,
      // 'idLabels'  : 'ラベルを使用したい場合はgetLabelsを実行してよしなに',
      'urlSource' : ''
    }
  }
  const response = UrlFetchApp.fetch(url, options);
  const response_data = JSON.parse(response.getContentText());
  sheet.getRange(last_row, card_link_column_no).setValue(response_data['shortUrl']);
  Logger.log(response_data);

  // 印鑑画像及び添付ファイルがあるかどうかをチェックし、あれば添付する
  const card_id = response_data['id'];
  const stamp_image = sheet.getRange(last_row, stamp_image_column_no).getValue();
  const attachment_file = sheet.getRange(last_row, attachment_file_column_no).getValue();
  if (stamp_image) attachFile(card_id, stamp_image, '印鑑画像');
  if (attachment_file) attachFile(card_id, attachment_file, '補足資料');
}

// フォームの内容を元に、カードのdescriptionにあたるマークダウンの文字列を生成する関数
function generateDescription(background, required_spec, expected_effect, delivery_date, client_team) {
  const descriptions = [];
  descriptions.push('### 背景・現状・課題\n' + background);
  descriptions.push('### やりたいこと\n' + required_spec);
  descriptions.push('### 開発によって見込まれる効果\n' + expected_effect);
  descriptions.push('### 希望納期\n' + delivery_date);
  descriptions.push('### 依頼元の担当者\n' + client_team);
  return descriptions.join('\n***\n\n');
}

// カードIDとファイルURLを渡すと、カードに指定したファイル名で添付ファイルをつけてくれる関数
function attachFile(card_id, file_url, file_name) {
  const url = `https://api.trello.com/1/cards/${card_id}/attachments?key=${api_key}&token=${api_token}&name=${file_name}&url=${file_url}`;
  const options = {
    'method' : 'post',
    'muteHttpExceptions' : true,
    'pauload' : {
      'name' : file_name,
      'file' : file_url
    }
  }
  const response = UrlFetchApp.fetch(url, options);
  const response_data = JSON.parse(response.getContentText());
  Logger.log(response_data);
}