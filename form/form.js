function setFirstQuestion() {
  const first_question = FormApp.getActiveForm().getItems()[0];
  const request_lists = SpreadSheetScript.setProperties();
  const values = JSON.parse(request_lists).map(list => list.board_name);
  first_question.asListItem().setChoiceValues(values);
}