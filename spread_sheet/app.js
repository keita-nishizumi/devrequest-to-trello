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
const selected_system_column_no = properties.getProperty('selected_system_column_no');  // 最初の質問の答え（開発を依頼するシステムの選択）が入っている列の番号
const client_name_column_no = properties.getProperty('client_name_column_no');          // 依頼人氏名の列番号
const title_column_no = properties.getProperty('title_column_no');                      // カード名の列番号
const background_column_no = properties.getProperty('background_column_no');            // 背景の記述の列番号
const stamp_image_column_no = properties.getProperty('stamp_image_column_no');          // 印鑑画像の列番号
const attachment_file_column_no = properties.getProperty('attachment_file_column_no');  // 添付ファイルの列番号
const card_link_column_no = properties.getProperty('card_link_column_no');              // カードへのリンクを挿入する列の番号
const attachment_error_column_no = properties.getProperty('attachment_error_column_no');//添付ファイルのエラー文言を挿入する列の番号
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
  if (!list_id) {
    sheet.getRange(last_row, card_link_column_no).setValue('Could not fetch list_id.');
    return null;
  }
  const card_title = sheet.getRange(last_row, title_column_no).getValue();
  const card_description = sheet.getRange(last_row, background_column_no).getValue();
  const url = 'https://api.trello.com/1/cards/?key=' + api_key + '&token=' + api_token;
  const options = {
    'method' : 'post',
    'muteHttpExceptions' : true,
    'payload' : {
      'name'      : card_title,
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
}

