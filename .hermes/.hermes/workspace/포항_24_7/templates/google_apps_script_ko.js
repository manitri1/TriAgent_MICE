// Google Apps Script: 한국어 폼 생성 예제
function createPohang247Form() {
  var form = FormApp.create('포항_24_7 참가 등록폼');
  form.setDescription('포항_24_7 참가 등록 — 발표자와 일반참관 등록을 위한 폼입니다.');

  form.addTextItem().setTitle('성명').setRequired(true);
  form.addTextItem().setTitle('소속(학교/단체)').setRequired(true);
  form.addTextItem().setTitle('휴대전화').setRequired(true);
  form.addTextItem().setTitle('이메일').setRequired(true);
  form.addMultipleChoiceItem().setTitle('참가 형태').setChoices([
    form.newChoice('발표자'),
    form.newChoice('일반참관'),
    form.newChoice('스태프')
  ]).setRequired(true);
  form.addParagraphTextItem().setTitle('발표 제목(발표자 해당)').setRequired(false);
  form.addParagraphTextItem().setTitle('발표 요약(200자 이내)').setRequired(false);

  // 저작권 동의 체크
  form.addCheckboxItem().setTitle('저작권·촬영 동의')
      .setChoiceValues(['포항_24_7 운영팀이 행사 사진·영상을 홍보 및 아카이빙 목적으로 사용하는 것에 동의합니다.'])
      .setRequired(true);

  // 응답 시트 생성 정보
  var sheet = SpreadsheetApp.create('포항_24_7 등록 응답 시트');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('폼 URL: ' + form.getEditUrl());
  Logger.log('응답 시트 URL: ' + sheet.getUrl());
}
