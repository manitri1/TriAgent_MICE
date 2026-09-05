# 07. 로드맵 — 남은 작업

이번 단계(설계 문서 + Profile 스캐폴드)에서 의도적으로 범위 밖에 둔 항목입니다.

## 1. Cvent REST API 연동

`budget-vendor-agent`가 컨벤션 센터/숙박 실시간 견적을 자동 조회하려면 Cvent의 OAuth 2.0
Client Credentials 연동(이벤트 코드, Client ID/Secret)이 필요합니다. 계약·인증 정보가
없어 이번 단계에서는 스킬 문서에 "웹 리서치로 대체, Cvent 연동 예정"으로만 명시했습니다.
실제 구현 시 커스텀 MCP 서버 또는 `tools/cvent_client.py` 형태의 커스텀 툴을 제안합니다.

## 2. CRM(HubSpot/Salesforce) 연동

`outreach-agent`의 리드 스코어링 연계용. 마찬가지로 인증 정보 미보유로 미착수.

## 2-1. 등록 플랫폼/결제 PG 연동

`registration-agent`가 참가자 등록·결제를 실시간으로 확정하려면 등록 플랫폼(예: Cvent
Registration, 자체 등록 폼 백엔드) API와 결제 PG(토스페이먼츠, 아임포트 등) 연동이
필요합니다. 인증 정보 미보유로 미착수 — 현재는 결제 상태 확인·안내까지만 수행하고 확정은
게이트 4(HITL)를 거쳐 수동 처리를 안내합니다.

## 2-2. 광고 플랫폼 API 연동

`marketing-agent`의 캠페인 성과(도달, 클릭, 전환)를 자동 수집하려면 Meta/Google Ads 등
광고 플랫폼 API 연동이 필요합니다. 인증 정보 미보유로 미착수 — 현재는 수동 입력 데이터를
`code_execution`으로 집계하는 방식으로 대체합니다.

## 3. 칸반 디스패처 위임 메커니즘 실측 검증

`docs/02-architecture.md`는 `delegate_task`도, 초기에 썼던 `terminal` 동기 호출도 아닌
**칸반 디스패처 자동 spawn**을 위임 메커니즘으로 채택했지만, **이 저장소에서는 아직 실제로
구동해본 적이 없습니다**(`.hermes/kanban.db`가 배포 시점까지 빈 상태). `kanban_create()` +
`kanban_link()`로 만든 태스크 그래프가 실제로 디스패처에 의해 자동 spawn되는지, `parents`
승격이 의도대로 동작하는지, `kanban_block`/`kanban_unblock`이 HITL 게이트를 실제로
막는지, `auto_subscribe_on_create`가 coordinator 세션을 실제로 재개시키는지를 검증해야
합니다 — 구체적 절차는 [10-usecase-tests.md](10-usecase-tests.md) Part A(TC-02, TC-05~07).

## 4. HITL 승인 대화 실측

`docs/06-hitl-approval-design.md`의 7개 게이트(예산/최초발송/위기아젠다/결제환불/전시계약/
캠페인집행/정산지급)는 각각 `kanban_block`/`kanban_unblock` 구현까지 설계돼 있지만, 실제
게이트웨이(Telegram 등) 연결 후 `messaging`/`clarify` 툴셋으로 승인 대화가 의도대로
동작하는지, 그리고 `blocked` 태스크가 승인 전까지 디스패처에 의해 재구동되지 않는지 검증이
필요합니다.

## 5. 배포 자동화 (완료)

`docker-compose.yml`/`Dockerfile` 작성은 완료했습니다([08장](08-docker-deployment.md)) —
단, 실제 `docker compose build/up`은 아직 실행하지 않았습니다.

## 6. 프로필별 챗 스모크 테스트

10개 프로필 모두 실제 챗 세션으로 최소 1회 구동해 SOUL.md 지시를 안정적으로 따르는지
확인이 필요합니다([10-usecase-tests.md](10-usecase-tests.md) Part B, 현재 전부 미검증).

## 7. `kanban` 기반 다단계 파이프라인 실행

이전에는 이 항목이 백로그(향후 검토 과제)였지만, 이제는 **현재 설계 자체**입니다 —
`docs/02-architecture.md`의 위임 메커니즘이 곧 칸반 디스패처 기반 태스크 그래프입니다.
Pre-Event(제안서→예산/전시/섭외/마케팅/등록 병렬 분기)→On-Event→Post-Event 전체를
`coordinator`가 `kanban_create`/`kanban_link`로 태스크 그래프를 만들고 디스패처가 자동
구동·검증하는 것을 처음부터 끝까지 실행하는 시나리오는 **설계는 끝났으나 아직 미검증**입니다
([10-usecase-tests.md](10-usecase-tests.md) Part A).
