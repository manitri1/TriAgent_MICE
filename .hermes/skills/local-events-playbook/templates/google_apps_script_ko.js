// Google Apps Script (Korean) — creates a registration Form + Spreadsheet
// USAGE: open script.google.com, create a new project, paste this file, then run createRegistrationFormKR()
// TARGET_SPREADSHEET_NAME: "POHANG_24_7 참가 등록 응답"

function createRegistrationFormKR(){
  var form = FormApp.create('POHANG 24/7 참가 등록폼');
  form.setDescription('포항_24_7 참가 등록 — 발표자 및 일반참관 등록을 위한 폼입니다.');
  form.setCollectEmail(true);
  form.addTextItem().setTitle('팀명 / 개인명').setRequired(true);
  form.addTextItem().setTitle('대표자 이름').setRequired(true);
  form.addTextItem().setTitle('대표자 이메일').setRequired(true);
  form.addTextItem().setTitle('대표자 연락처').setRequired(true);
  form.addParagraphTextItem().setTitle('아이디어(간단 설명)').setRequired(true);
  form.addFileUploadItem().setTitle('첨부 파일 (PDF/PPT/영상 링크)').setRequired(false);
  form.addMultipleChoiceItem().setTitle('저작권/초상권 동의').setChoiceValues(['동의합니다']).setRequired(true);
  var sheet = SpreadsheetApp.create('POHANG_24_7 참가 등록 응답');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Spreadsheet URL: ' + sheet.getUrl());
}
