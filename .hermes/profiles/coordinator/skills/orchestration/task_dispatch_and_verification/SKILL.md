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
   `budget-vendor-agent`/`outreach-agent`/`exhibition-agent`/`registration-agent`/
   `marketing-agent`/`onsite-ops-agent`/`postevent-analyst`/`finance-settlement-agent`)에
   배정한다. `workspace`(`dir:/opt/data/workspace/<category>/<event-slug>`)와 `tenant`
   (`<event-slug>`), `priority`를 지정하고, 의존관계가 있는 태스크는 `parents`(또는
   `kanban_link()`)로 명시한다. 같은 요청을 반복 처리하지 않도록 `idempotency_key`를
   `<event-slug>-<task-name>` 형태로 채운다. 긴급 인시던트는 최우선순위로 둔다.
2. **`terminal`로 하위 프로필을 직접 호출하지 않는다.** `parents`가 모두 `done`이 되면
   칸반 디스패처가 게이트웨이 안에서 자동으로 해당 프로필을 워커 프로세스로 구동한다
   (`delegate_task`는 대상 프로필의 SOUL/USER/MEMORY/skills를 로드하지 않으므로 여전히
   사용 금지 — [02-architecture.md](../../../../../../docs/02-architecture.md) 참고).
   coordinator는 태스크를 만든 뒤 동기로 기다리지 않는다 — `auto_subscribe_on_create`
   설정에 의해 담당 태스크가 `done`/`blocked`로 바뀌면 세션이 자동으로 재개된다.
3. 태스크가 `done`으로 표시되면, 반환된 파일 경로를 직접 열거나 외부 시스템에 반영됐는지
   재조회한다. 워커의 `kanban_complete()` 요약 텍스트만으로 승인하지 않는다(Active
   Verification). 확인 불가하면 `kanban_comment()`로 재작업을 요청한다.
4. 예산 최종 승인 / 연사·스폰서 최초 발송 / 위기 우회 아젠다 적용 / 참가자 결제·환불 /
   전시 부스 계약 확정 / 유료 광고·대량 캠페인 집행 / 사후 정산 확정·지급 — 이 7개 HITL
   게이트는 담당 워커가 `kanban_complete()` 대신 `kanban_block(reason=...)`을 호출해
   스스로 멈춘다. coordinator는 `blocked` 태스크의 reason을 `messaging`/`clarify`로
   기획자에게 그대로 전달하고, 명시적 승인을 받은 뒤에만 `kanban_unblock(task_id)`를
   호출한다. 반려 시에는 `kanban_comment()`로 반려 사유를 남기고 재작업을 요청한다
   ([06-hitl-approval-design.md](../../../../../../docs/06-hitl-approval-design.md) 참고).
5. 태스크가 `failure_limit`(디스패처 기본 재시도 횟수)에 도달해 실패 상태가 되면, 원인을
   확인하고 같은 입력으로 새 태스크를 재생성하거나 기획자에게 판단을 구한다. 승인 대기
   (`blocked`) 상태는 실패가 아니므로 재시도 대상이 아니다 — 기획자 승인 없이는 절대
   `kanban_unblock`을 호출하지 않는다.

## 반환값
- 배정된 kanban 카드 목록과 상태
- Active Verification 결과(검증 방법과 확인 여부)
- HITL 게이트 통과 여부(승인/반려/대기)
