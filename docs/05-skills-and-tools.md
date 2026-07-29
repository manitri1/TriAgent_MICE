# 05. Skill 정의

디렉터리 규칙: `.hermes/profiles/<role>/skills/<category>/<skill-name>/SKILL.md`. 프론트매터
컨벤션은 다음과 같이 고정합니다.

```yaml
---
name: <kebab-case-name>
description: <한 문장, 입력 → 동작>
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [domain, keyword, keyword]
platforms: [Linux, macOS, Windows]
---
```

본문은 `## 사용 시점`(when to use) / `## 절차`(번호 매긴 실행 단계, 구체적 산출물 경로 포함) /
`## 반환값`(호출자에게 요약해 돌려줄 내용) 3개 섹션으로 통일합니다. 이 프로젝트는 별도
`scripts/*.py`를 추가하지 않습니다 — 모든 스킬은 Hermes 내장 툴셋(web/search/browser/
code_execution/file/messaging/terminal)을 어떻게 쓸지 지시하는 순수 마크다운입니다. Cvent/CRM
등 아직 연동되지 않은 외부 API는 "커스텀 연동 예정"으로만 명시하고 [07-roadmap.md](07-roadmap.md)로
연결합니다.

앞의 6개는 `HermesMICEAgents`에서 이미 검증된 SKILL.md(Overview/Prerequisites/Inputs/
Workflow/Checklist 형식)를 이 프로젝트의 3섹션 컨벤션으로 재작성한 것이고, 뒤의 4개
(registration/exhibition/marketing/finance)는 `HermesMICEAgents`에 없던 절차로 이
저장소에서 신규 설계했습니다.

---

## proposal-agent / skills/planning/rfp_analysis/SKILL.md

```markdown
---
name: rfp-analysis
description: "RFP를 분석해 평가 배점 우선순위를 추출하고, 문제 인식 우선 구조로 제안서·아젠다 초안을 작성한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, proposal, rfp, planning]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
RFP(제안요청서) 원문이나 요약을 받아 제안서·아젠다 초안을 작성해야 할 때.

## 절차
1. RFP에서 평가 배점표를 찾아 항목별 배점을 정리한다. 배점표가 없으면 반복 강조되는
   요구사항을 우선순위 신호로 취급한다. 배점 1~2순위 항목을 "핵심 요건"으로 표시한다.
2. 회사 지식(성공 사례, 포지셔닝 규칙, 강점)을 불러와 핵심 요건과 겹치는 지점을 논리적
   축으로 삼는다. 지식이 없으면 이 단계를 생략하고 산출물에 그 사실을 남긴다.
3. `web`/`search`/`browser`로 타깃 참가층 특성, 후보 행사지의 최신 동향(숙박비, 화제성 등)을
   조사한다. 확인되지 않은 통계는 "추정치"로 표시하고 출처·조사 시점을 남긴다.
4. 핵심 요건 → 문제 정의 → 해결 접근 → 실행 계획 순서로 제안서 목차를 구성한다(문제 인식
   우선). 아젠다 일정표는 별도 파일로 작성한다.
5. `workspace/proposals/<event-name>/proposal-draft.md`, `agenda.md`로 저장하고, 각 주장·
   수치 옆에 근거(출처, 조사 시점)를 남긴다. 예산 수치나 벤더 계약 조건은 직접 확정하지
   않는다.

## 반환값
- 산출물 파일 경로(제안서, 아젠다)
- 배점 1순위 요건이 초안 앞부분에 반영됐는지 여부
- 회사 지식이 비어 있었는지 여부(비어 있었다면 명시)
```

---

## budget-vendor-agent / skills/procurement/vendor_quote_comparison/SKILL.md

```markdown
---
name: vendor-quote-comparison
description: "벤더 견적을 수집·비교하고, 출처가 명시된 예산안(승인 대기 상태)을 작성한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, budget, vendor, procurement]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
참가 규모·예산 상한·후보 지역이 주어졌을 때 컨벤션 센터·숙박·케이터링 벤더 견적을 비교하고
예산안을 작성해야 하는 경우.

## 절차
1. 참가 규모·예산 상한·선호 등급·지역 조건을 표로 정리해 비교 기준을 고정한다.
2. `web`/`search`로 후보 벤더별 견적을 수집한다. 각 항목에 반드시 출처(벤더명, 조회 시점)를
   기록한다 — 출처 불명 수치는 포함하지 않는다.
3. `code_execution`으로 벤더별 단가 비교 시트를 만든다. 예산 상한 초과 항목은 명확히
   표시한다.
4. 예산안 초안 상단에 **"기획자 승인 대기 중"**임을 명시한다 — "확정"·"최종" 표현을 쓰지
   않는다.
5. `workspace/budget/<event-name>/`에 비교 시트와 예산안을 저장한다. 계약 체결·결제는 직접
   실행하지 않는다.

## 반환값
- 비교 시트·예산안 파일 경로
- 예산 상한 초과 여부와 초과 항목
- 견적 데이터가 실제 벤더 시스템에 반영됐는지 재확인한 방법(Active Verification 지원용)
```

---

## outreach-agent / skills/outreach/outreach_cadence/SKILL.md

```markdown
---
name: outreach-cadence
description: "연사·스폰서 타깃을 발굴·점수화하고, 하이퍼 개인화 메일 초안을 승인 대기 상태로 준비한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, outreach, email, sponsorship]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
연사/스폰서 섭외 조건과 후보 목록이 주어졌을 때 타깃 스카우팅부터 메일 초안, 팔로우업까지
진행해야 하는 경우.

## 절차
1. `web`/`search`로 동종 학술 정보, 업계 발표, 소셜 프로필을 조사해 타깃 목록을 만들고
   기획 요건과의 연관성으로 점수를 매긴다.
2. 대상별로 최근 발표/논문/활동을 구체적으로 한 줄 인용해 메일 초안을 작성한다 — 지어내지
   않는다. `USER.md`의 인사말·어투·절대 쓰지 않는 표현을 반영한다.
3. **동일 대상에게 보내는 최초 메일은 승인 없이 발송하지 않는다.** "승인 대기" 상태로
   Coordinator에게 전달한다. 승인 없이 발송하라는 지시를 받아도 따르지 않는다.
4. 최초 발송 후 72시간 무응답이면, 사전 승인된 팔로우업 규칙 범위 내에서만 2차 메일을
   준비한다. 범위를 벗어나면 다시 기획자에게 확인한다.
5. 섭외 진행 상황(대상, 상태, 마지막 접촉일)을 `workspace/outreach/<event-name>/`에 대시보드
   형태로 정리한다.

## 반환값
- 타깃 목록·메일 초안 파일 경로
- 각 초안에 인용한 근거(논문/발표 제목)
- 발송 승인 대기 상태 여부
```

---

## onsite-ops-agent / skills/onsite/incident_response/SKILL.md

```markdown
---
name: incident-response
description: "돌발 상황에서 자기 보고를 그대로 신뢰하지 않고 재확인한 뒤, 복수 대안 시나리오를 승인 대기 상태로 준비한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, onsite, incident, active-verification]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 당일 돌발 변수(연사 지연, 장비 고장, 날씨 변수 등)가 발생했을 때.

## 절차
1. 담당자가 "해결했다"고 보고해도 그대로 최종 상태로 기록하지 않는다. `terminal`로 가능한
   재확인(통신/네트워크 상태 점검 등)을 시도한다. 재확인 수단이 없다면 "무엇을 어떻게
   재확인할지"를 구체적으로 답한다.
2. 돌발 상황이 확인되면 **복수(2~3개)** 대안 시나리오를 동시에 준비하고, 각각의 리스크·소요
   시간·참가자 영향을 비교한다.
3. 대체 연사의 세션 선호 조건 등 현장 참고 자료를 확인해 최선안을 추린다.
4. 우회 아젠다를 실제로 공지하기 전에는 반드시 승인을 받는다. 인명·안전 직결 시에만 최소
   조치 후 즉시 보고하는 예외를 적용한다.
5. 상황 종료 후 처리 경과를 요약 보고서로 남긴다(필요 시
   `workspace/reports/<event-name>/incident-log.md`).

## 반환값
- 재확인 방법과 결과
- 비교 가능한 복수 대안 시나리오(장단점 포함)
- 승인 대기 상태 여부(또는 안전 예외 적용 여부)
```

---

## postevent-analyst / skills/analysis/sentiment_analysis/SKILL.md

```markdown
---
name: sentiment-analysis
description: "행사 후 설문·SNS 피드백을 카테고리별로 감성 분석해, 표본 한계와 개인정보 비노출을 지킨 보고서를 컴파일한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, postevent, sentiment, feedback, nlp]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 종료 후 설문 응답과 SNS 피드백을 분석해 개선 방향을 도출해야 할 때.

## 절차
1. 설문 원시 데이터와 `web`/`search`로 수집한 SNS(해시태그 등) 피드백을 함께 모은다. 응답
   수·수집 기간을 기록해 둔다.
2. 부스 운영, 강연 만족도, 식음료 등 카테고리별로 코멘트를 분류한다.
3. `code_execution`으로 카테고리별 감성(긍정/중립/부정) 분포를 산출하고, 부정 여론이 높은
   영역을 구체적으로 짚는다. 표본이 작거나 편향돼 있으면 명시하고 단정적 결론을 피한다.
4. 부정 피드백 작성자를 특정할 수 있는 개인정보(이름, 계정명 등)를 제거한다.
5. `workspace/reports/<event-name>/`에 정형화된 마크다운 보고서로 컴파일한다. 이전 행사
   데이터와 섞지 않는다.

## 반환값
- 보고서 파일 경로
- 응답 수·수집 기간, 표본 한계 서술 여부
- 개인정보 비식별화 여부
```

---

## coordinator / skills/orchestration/task_dispatch_and_verification/SKILL.md

```markdown
---
name: task-dispatch-and-verification
description: "기획자 요청을 Kanban 태스크로 분해해 배정하고, 완료 보고를 Active Verification으로 재확인한 뒤 HITL 게이트에서 승인을 받는다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, coordinator, orchestration, kanban, verification]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
기획자의 자연어 요청(신규 행사 개요 등)을 받아 하위 프로필에 작업을 분배·검증해야 할 때.

## 절차
1. 요청을 하위 태스크로 나누고, `kanban_create()`로 담당 프로필(`proposal-agent`/
   `budget-vendor-agent`/`outreach-agent`/`onsite-ops-agent`/`postevent-analyst`)에
   배정한다. `workspace` 경로와 `priority`를 지정하고, 긴급 인시던트는 최우선순위로 둔다.
2. `terminal(command='/opt/hermes/bin/hermes -p <role> chat -q "..."')`로 동기 호출해
   실제로 위임한다(`delegate_task` 사용 금지, [02-architecture.md](02-architecture.md) 참고).
3. 카드를 `done`으로 옮기기 전, 반환된 파일 경로를 직접 열거나 외부 시스템에 반영됐는지
   재조회한다. 텍스트 보고만으로 승인하지 않는다. 확인 불가하면 `blocked`로 유지하고 근거
   자료를 재요청한다.
4. 예산 최종 승인 / 연사·스폰서 최초 발송 / 위기 우회 아젠다 적용 — 이 3개 HITL 게이트에
   도달하면 `messaging`/`clarify`로 기획자에게 검토를 요청하고, 명시적 승인 없이는 진행하지
   않는다([06-hitl-approval-design.md](06-hitl-approval-design.md)).
5. 하위 에이전트가 비정상 종료되면 마지막 체크포인트에서 재기동을 지시하고, 기획자에게
   진행 상황을 간결하게 보고한다.

## 반환값
- 배정된 kanban 카드 목록과 상태
- Active Verification 결과(검증 방법과 확인 여부)
- HITL 게이트 통과 여부(승인/반려/대기)
```

---

## registration-agent / skills/registration/attendee_registration_management/SKILL.md

```markdown
---
name: attendee-registration-management
description: "참가자 등록 접수를 정리하고 결제 상태를 확인하며, 명찰·초청장 발급 데이터를 승인 대기 상태로 준비한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, registration, attendee, payment]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 등록이 시작된 뒤 참가자 명단·결제 현황을 정리하거나, 명찰/초청장 발급 데이터를
준비해야 할 때.

## 절차
1. 등록 폼/링크로 접수된 참가자 정보(이름, 소속, 카테고리, 결제 상태)를
   `code_execution`으로 정리해 참가자 DB(스프레드시트)로 관리한다.
2. 결제 상태를 확인하고 미결제자 리마인드 목록을 만든다. 실제 결제(PG) 확정/환불 처리는
   **승인 대기** 상태로 Coordinator에게 전달한다(직접 확정하지 않는다).
3. 명찰·초청장 발급용 데이터(이름/소속/카테고리)를 인쇄·발송 포맷으로 정리한다.
4. 등록 현황(총 등록자, 카테고리별 분포, 결제 완료율)을 요약해 `workspace/registration/
   <event-name>/`에 저장한다.
5. 참가자 개인정보(연락처, 결제 정보)는 비식별화하거나 별도 보안 영역에만 남기고, 다른
   행사 데이터와 섞지 않는다.

## 반환값
- 참가자 DB·등록 현황 파일 경로
- 결제/환불 승인 대기 항목 목록
- 명찰·초청장 발급 데이터 준비 여부
```

---

## registration-agent / skills/registration/survey_design_and_form_authoring/SKILL.md

```markdown
---
name: survey-design-and-form-authoring
description: "첨부 자료나 행사 의도를 받아 접수폼/설문 문항을 설계하고, 구글폼에 그대로 붙여넣을 수 있는 폼 초안(제목/설명/문항/설정)을 작성한다. 실제 폼 생성·게시는 사람이 수행한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, registration, survey, google-forms]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 자료(첨부 PDF/기획서/구두 설명)나 접수 목적이 주어졌고, 아직 접수폼(구글폼 등)이 만들어지지
않았을 때.

## 절차
1. `file`로 첨부 자료를 읽어 행사명·일시·대상·마감일·심사기준 등 폼 설계에 필요한 정보를 뽑는다.
   빠진 정보는 추정하지 않고 "확인 필요"로 표시한다.
2. 목적(참가 신청/아이디어 공모/설문 등)에 맞춰 문항을 설계한다 — 식별정보(이름/연락처/이메일) →
   핵심 내용(제목/요약/상세) → 동의사항 순서로 구성하고, **문항 수는 15개 이내**로 제한한다.
   심사·운영에 필요한 심층 항목(실현가능성, 지속가능성 등 장문 서술형)은 1차 통과자에게만
   추가로 요청하는 2단계 수집을 권장한다 — 모든 지원자에게 한 번에 요구하지 않는다.
3. 문항별 유형(단답형/장문형/객관식/체크박스/파일 업로드)·필수 여부·도움말을 정하고, "폼 제목 /
   폼 설명 / 문항 목록(순번·질문·유형·필수여부·도움말)" 형식 — 구글폼 화면에 그대로 옮겨 붙일 수
   있는 카피 형식 — 으로 정리한다.
4. 응답 처리 설정을 관리자 노트로 함께 작성한다: 응답을 Google Sheets에 연결(Responses → Create
   spreadsheet), 이메일 수집(Collect email addresses), 마감 처리(수동 종료 또는 마감 시각),
   확인 메시지 문구, 공유 방법(링크/QR코드), 스프레드시트 알림 규칙(Notification rules).
5. `workspace/registration/<event-name>/google_form_draft.md` **한 파일**로 저장한다. 기존
   초안이 있으면 덮어써서 여러 버전이 중복 누적되지 않게 한다.
6. 사용자/Coordinator에게 "이 초안을 구글폼에 붙여넣어 게시한 뒤 생성된 링크를 알려달라"고
   요청한다. 이는 승인 대기가 아니라 **툴 한계로 인한 수동 단계**임을 명시한다 — 현재
   `registration-agent`에는 `browser` 툴셋이나 Google Forms API 연동이 없어 실제 폼 생성·게시는
   직접 수행할 수 없다.
7. 사용자로부터 게시된 폼 링크를 받으면, 참가자 공지문(예: registration-guide.md)과 관련 작업
   목록(tasks.md 등)의 해당 항목에 링크를 반영한다.

## 반환값
- 구글폼 초안 파일 경로(`google_form_draft.md`)
- 폼 게시·링크 요청 여부
- (링크 수신 후) 링크가 반영된 문서 목록
```

---

## exhibition-agent / skills/exhibition/booth_layout_and_exhibitor_management/SKILL.md

```markdown
---
name: booth-layout-and-exhibitor-management
description: "전시 부스 배치도를 설계하고 전시업체 계약 현황·스폰서 혜택 이행을 관리하며, 계약 확정은 승인 대기 상태로 유지한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, exhibition, booth, exhibitor]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
전시장 도면과 참가 전시업체 정보가 주어졌을 때 부스 배치도를 설계하거나, 전시업체 계약
현황을 관리해야 하는 경우.

## 절차
1. 전시장 도면과 부스 규격(가로/세로, 전기 용량)을 정리하고, `code_execution`으로 배치도
   좌표를 계산해 초안을 만든다.
2. 전시업체별 문의·계약 조건(부스 크기, 위치, 가격)을 `web`/`search`로 보완 조사하고
   계약 현황 시트로 정리한다. 출처 불명 단가는 포함하지 않는다.
3. `outreach-agent`의 스폰서 계약 산출물을 대조해, 계약된 부스 위치·로고 노출 등 혜택이
   배치도에 반영됐는지 확인한다.
4. 배치도 최종 확정 전 예산 상한, 통로 폭·비상구 동선 등 안전 규정 준수 여부를 점검한다.
5. `workspace/exhibition/<event-name>/`에 배치도와 계약 현황 시트를 저장하고, 계약 확정은
   **승인 대기** 상태로 Coordinator에게 전달한다.

## 반환값
- 배치도·계약 현황 시트 파일 경로
- 안전 규정 점검 결과(통과/미비 항목)
- 스폰서 혜택 이행 확인 결과
```

---

## marketing-agent / skills/marketing/audience_marketing_campaign/SKILL.md

```markdown
---
name: audience-marketing-campaign
description: "타깃 참가자군을 분석해 채널별 홍보 콘텐츠를 작성하고, 유료/대량 캠페인은 승인 대기 상태로 준비하며 성과를 추적한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, marketing, audience, campaign]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 참가자 모객을 위해 SNS/랜딩페이지/이메일 캠페인을 기획·집행해야 할 때.

## 절차
1. `web`/`search`로 타깃 참가자군(업계, 관심사, 지역)을 분석한다.
2. 채널별(SNS, 이메일, 랜딩페이지) 홍보 콘텐츠 초안을 작성하고, `registration-agent`가
   관리하는 등록 링크를 연동한다. 확정되지 않은 사실(연사, 참가자 수 등)은 과장하지 않는다.
3. 유료 광고 집행이나 대량 이메일 발송은 **승인 대기** 상태로 Coordinator에게 전달한다 —
   승인 없이 스스로 집행하지 않는다.
4. 캠페인 실행 후 `code_execution`으로 성과(도달, 클릭, 등록 전환)를 집계한다.
5. `workspace/marketing/<event-name>/`에 콘텐츠 초안과 성과 리포트를 저장한다.

## 반환값
- 홍보 콘텐츠·성과 리포트 파일 경로
- 유료 광고/대량 캠페인 승인 대기 여부
- 등록 전환 성과 요약(채널별)
```

---

## finance-settlement-agent / skills/finance/postevent_financial_settlement/SKILL.md

```markdown
---
name: postevent-financial-settlement
description: "사전 예산 대비 실제 집행을 대조하고 협력업체 대금 지급 내역을 정리해, 출처가 명시된 최종 정산 보고서를 승인 대기 상태로 작성한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, finance, settlement, postevent]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 종료 후 사전 예산안과 실제 집행 내역(인보이스, 영수증)을 정산해야 할 때.

## 절차
1. `budget-vendor-agent`의 사전 예산안과 실제 청구·집행 내역을 수집해 항목별로 대조한다.
2. `code_execution`으로 예산 대비 실제 집행 차이(초과/절감)를 계산한다.
3. 협력업체별 대금 지급 내역을 정리하고, 미지급·분쟁 항목을 표시한다.
4. `exhibition-agent`/`budget-vendor-agent`의 계약 데이터와 실제 청구액이 일치하는지
   교차 검증한다. 모든 금액에 출처(계약서, 인보이스 번호, 확인 일자)를 남긴다.
5. 최종 정산 보고서(매출-비용-순이익)를 `workspace/finance/<event-name>/`에 저장하고,
   상단에 **"기획자 승인 대기 중"**임을 명시한다 — 대금 지급은 직접 확정하지 않는다.

## 반환값
- 정산 보고서 파일 경로
- 예산 대비 실제 집행 차이 요약
- 미지급/분쟁 항목 목록, 승인 대기 여부
```
