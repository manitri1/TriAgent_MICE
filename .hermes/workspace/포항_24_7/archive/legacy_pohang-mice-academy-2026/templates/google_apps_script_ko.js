/**
 * Google Apps Script (Korean)
 * 폼 및 응답 스프레드시트 자동 생성 스크립트
 * 사용법: script.google.com 에 새 프로젝트 생성 -> 이 파일의 내용을 붙여넣고 createStrategyFormKR() 실행
 */

function createStrategyFormKR() {
  var title = '포항 MICE 아카데미 — 전략 기획서 제출';
  var description = ''
    + '포항 지역 콘텐츠 발굴 콘테스트의 전략 기획서를 제출하세요.\n'
    + '템플릿 항목(요약, 기획 취지, 브랜드, 목표, 대상, 포지셔닝, 기대효과, 전략, KPI, 로드맵, 예산, 리스크, 이해관계자, 산출물)을 따라 작성해 주십시오.\n'
    + '제출 마감: 2026-10-20 23:59. 파일 업로드가 불가한 경우 공개 링크(Google Drive/Dropbox)를 제공해 주세요.';

  var form = FormApp.create(title).setDescription(description);
  form.setCollectEmail(true);
  form.setConfirmationMessage('제출이 접수되었습니다. 선정팀은 2026-10-28까지 이메일로 안내드립니다.');

  // 연락처/팀 정보
  form.addTextItem().setTitle('팀명(또는 개인 이름)').setRequired(true).setHelpText('팀명 또는 개인 이름을 입력하세요.');
  form.addTextItem().setTitle('팀 대표자 이름').setRequired(true).setHelpText('대표자(팀 연락 담당자) 성명을 입력하세요.');
  form.addTextItem().setTitle('대표자 이메일').setRequired(true).setHelpText('선정 시 연락을 드릴 이메일을 입력하세요.');
  form.addTextItem().setTitle('대표자 연락처(휴대폰)').setRequired(true).setHelpText('심사·확인 연락을 위한 휴대전화 번호를 입력하세요.');
  form.addTextItem().setTitle('소속(대학/단체/직장)').setHelpText('예: 포항대학교, 지역주민, 스타트업 등');
  form.addParagraphTextItem().setTitle('팀원 명단(최대 4명)').setHelpText('팀원 이름을 쉼표로 구분해서 입력하세요(개인인 경우 비워두세요).');

  // 문서 헤더
  form.addTextItem().setTitle('문서명(예: [행사] 전략 기획서 - 팀명)').setRequired(true);
  form.addTextItem().setTitle('작성일(YYYY-MM-DD)').setRequired(true);
  form.addTextItem().setTitle('프로젝트(행사)명(예: 포항 MICE 아카데미)').setRequired(true);
  form.addTextItem().setTitle('행사 일시·장소(예: 2026-11-03 18:00 · 파랑뜰 2층)').setRequired(true);

  // 핵심 항목(전략 템플릿 항목별 질문)
  form.addParagraphTextItem().setTitle('요약 (Executive Summary, 150~250자)').setRequired(true)
      .setHelpText('행사의 핵심(무엇인지), 달성 목표, 한 줄 제안을 150~250자 내로 작성하세요.');

  form.addParagraphTextItem().setTitle('기획 취지(Why) - 배경 및 문제 정의 (200~400자)').setRequired(true)
      .setHelpText('이 행사가 필요한 이유, 해결하려는 문제(수요/공백)를 근거와 함께 기술하세요.');

  form.addTextItem().setTitle('브랜드명(권장)').setRequired(true).setHelpText('제안하는 공식 브랜드명을 입력하세요.');
  form.addParagraphTextItem().setTitle('대안 브랜드명(2~3개) 및 슬로건 2개').setHelpText('대체 이름과 짧은 태그라인을 제시하세요.');

  form.addParagraphTextItem().setTitle('목적(Objectives) - 정량·정성 목표 (SMART)').setRequired(true)
      .setHelpText('정량적 목표(숫자·기한)와 정성적 목표(네트워크·프로토타입)를 분리하여 작성하세요.');

  form.addParagraphTextItem().setTitle('대상(Target) - 핵심 대상 및 확장 대상 및 동기').setRequired(true)
      .setHelpText('1차 핵심 대상과 2차 확장 대상, 각 대상이 참여할 동기를 한 문장씩 적으세요.');

  form.addParagraphTextItem().setTitle('지향점(Positioning & 방향)').setRequired(true)
      .setHelpText('이 행사가 어떤 허브가 되고 싶은지, 다른 공모전과의 차별점(접근성·실행가능성·지속가능성)을 서술하세요.');

  form.addParagraphTextItem().setTitle('기대 효과(Impact) - 단기/중기/장기').setRequired(true)
      .setHelpText('0~3개월, 3~12개월, 1년+ 단위로 기대 효과를 작성하세요(가능하면 수치 포함).');

  form.addParagraphTextItem().setTitle('핵심 전략(How) - 채널/심사·지원/운영/자원').setRequired(true)
      .setHelpText('각 항목에 대해 "무엇을, 누가, 언제, 어떻게"로 구체적으로 기술하세요.');

  form.addParagraphTextItem().setTitle('KPI 및 평가 지표(입력/활동/산출/성과/영향)').setHelpText('지표 | 목표값 | 측정방법 | 담당자 형식으로 작성하세요.');
  form.addParagraphTextItem().setTitle('일정(로드맵) - D-90/D-60/D-30/D-7/D-Day/D+14').setRequired(true)
      .setHelpText('각 마일스톤에 날짜와 간단한 실행 항목을 적으세요.');

  form.addParagraphTextItem().setTitle('예산 요약(항목별 배분)').setHelpText('예: 장비 120,000원 - 프로젝터 대여 (근거)');
  form.addParagraphTextItem().setTitle('리스크 및 대응(Top 5)').setRequired(true).setHelpText('리스크와 각 리스크의 대응(Plan B)을 기술하세요.');

  form.addParagraphTextItem().setTitle('이해관계자 목록(이름 | 역할 | 연락처 | 기대 역할)').setHelpText('표 형식으로 적어주세요. 예: 포항시관광센터 | 파트너 | 이메일/전화 | 홍보 연계');
  form.addParagraphTextItem().setTitle('산출물 목록(전/당일/사후)').setHelpText('예: 프로그램(최종), 참가자명단, 사진/영상, 보도자료, 정산서 등');

  form.addTextItem().setTitle('제출 파일(업로드 불가 시 공개 링크)').setHelpText('Google Drive/Dropbox 등 공개 링크를 입력하거나, 아래 파일 업로드로 제출하세요.');

  // 파일 업로드 (주의: 로그인 필요)
  try {
    form.addFileUploadItem().setTitle('상세 제안서 첨부 (PDF / PPTX, 최대 10MB)').setHelpText('업로드가 어려울 경우 공개 링크를 대신 제공해주세요. (파일 업로드는 Google 로그인 필요)');
  } catch (e) {
    Logger.log('파일 업로드 항목 생성 실패: ' + e.message);
  }

  form.addMultipleChoiceItem().setTitle('발표 형식(선호)').setChoices([
    form.createChoice('현장 발표'),
    form.createChoice('사전 녹화'),
    form.createChoice('슬라이드 + 데모')
  ]).setRequired(true);

  form.addParagraphTextItem().setTitle('기술적 요구사항(전원, 네트워크, 기타 장비)').setHelpText('필요한 장비를 구체적으로 기입하세요.');

  form.addMultipleChoiceItem().setTitle('사진/영상 홍보 활용 동의').setChoices([
    form.createChoice('동의합니다'),
    form.createChoice('동의하지 않습니다')
  ]).setRequired(true);

  form.addMultipleChoiceItem().setTitle('멘토링/후속지원 희망 여부').setChoices([
    form.createChoice('희망'),
    form.createChoice('희망하지 않음'),
    form.createChoice('상황에 따라')
  ]);

  form.addMultipleChoiceItem().setTitle('어떤 경로로 행사를 알게 되었나요?').setChoices([
    form.createChoice('대학'),
    form.createChoice('SNS'),
    form.createChoice('포스터'),
    form.createChoice('지인/동료'),
    form.createChoice('기타')
  ]);

  form.addParagraphTextItem().setTitle('추가 코멘트/메모').setHelpText('검토자에게 전달하고 싶은 기타 정보를 적어주세요.');

  form.addCheckboxItem().setTitle('제출 동의 (원본성 및 약관)').setChoices([
    form.createChoice('본 제출물은 본 팀(또는 개인)의 창작물이며, 선정시 홍보 활용에 동의합니다.')
  ]).setRequired(true);

  // 관리자 설정
  form.setAcceptingResponses(true);
  form.setAllowResponseEdits(false);

  var ss = SpreadsheetApp.create(title + ' - 응답');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  PropertiesService.getScriptProperties().setProperty('STRATEGY_FORM_ID_KO', form.getId());

  Logger.log('폼 편집 URL: ' + form.getEditUrl());
  Logger.log('폼 공개 URL: ' + form.getPublishedUrl());
  Logger.log('응답 시트 URL: ' + ss.getUrl());
}

function closeStrategyFormKR() {
  var id = PropertiesService.getScriptProperties().getProperty('STRATEGY_FORM_ID_KO');
  if (!id) { Logger.log('저장된 폼 ID가 없습니다.'); return; }
  var form = FormApp.openById(id);
  form.setAcceptingResponses(false);
  Logger.log('폼을 종료했습니다: ' + form.getEditUrl());
}

function scheduleFormClosureKR(isoDateString) {
  var when = new Date(isoDateString);
  ScriptApp.newTrigger('closeStrategyFormKR').timeBased().at(when).create();
  Logger.log('종료 예약 시간: ' + when);
}
