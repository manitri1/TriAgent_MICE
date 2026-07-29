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
   실제로 위임한다(`delegate_task` 사용 금지).
3. 카드를 `done`으로 옮기기 전, 반환된 파일 경로를 직접 열거나 외부 시스템에 반영됐는지
   재조회한다. 텍스트 보고만으로 승인하지 않는다. 확인 불가하면 `blocked`로 유지하고 근거
   자료를 재요청한다.
4. 예산 최종 승인 / 연사·스폰서 최초 발송 / 위기 우회 아젠다 적용 — 이 3개 HITL 게이트에
   도달하면 `messaging`/`clarify`로 기획자에게 검토를 요청하고, 명시적 승인 없이는 진행하지
   않는다.
5. 하위 에이전트가 비정상 종료되면 마지막 체크포인트에서 재기동을 지시하고, 기획자에게
   진행 상황을 간결하게 보고한다.

## 반환값
- 배정된 kanban 카드 목록과 상태
- Active Verification 결과(검증 방법과 확인 여부)
- HITL 게이트 통과 여부(승인/반려/대기)
