// // コードの可読性をあげるため、本来必要のない関数などはこちらに退避する

// // ボードID
// const board_id = propaties.getProperty('board_id'); //83期Trello リファレンスボード

// // リストID
// const list_id = propaties.getProperty('list_id'); //[テスト] 開発依頼 ボード

function getBoards() {
  const url = 'https://api.trello.com/1/members/' + user_name + '/boards?key=' + api_key + '&token=' + api_token + '&fields=name';
  Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function getlists() {
  const url = "https://trello.com/1/boards/" + board_id + "/lists?key=" + api_key + "&token=" + api_token + "&fields=id,name";
  Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function getLabels() {
  const url = "https://trello.com/1/boards/" + board_id + "/labels?key=" + api_key + "&token=" + api_token + "&fields=name";
  Logger.log(UrlFetchApp.fetch(url, {'method':'get'}));
}

function addAllTrelloCards() {

  // 選択しているセルの開始行番号を取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const upper_left_cell = sheet.getActiveCell();
  const start_row = upper_left_cell.getRow();

  // 選択しているセルの行数を取得
  const range = SpreadsheetApp.getActiveRange();
  const rows = range.getNumRows();

  // カード作成
  for (let i = 0; i < rows; i++) {
    const row = start_row + i;
    const card_title = sheet.getRange(row, title_column_no).getValue();
    const card_description = sheet.getRange(row, description_column_no).getValue();
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
    sheet.getRange(row, 13).setValue(response_data['shortUrl']);
  }
}


// 不要なプロパティを削除したいときはこちら
function deleteProperties() {
  PropertiesService.getScriptProperties().deleteProperty('board_id');
  PropertiesService.getScriptProperties().deleteProperty('list_id');
}