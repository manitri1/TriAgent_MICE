# 02. 아키텍처 — 프로필 관계와 오케스트레이션

## 프로필 관계도

```
                                   기획자(사용자)
                                        │
                                        ▼
                              ┌───────────────────┐
                              │    coordinator     │  ← 유일한 대화 진입점
                              │  (총괄 코디네이터)   │
                              └─────────┬─────────┘
                                        │ terminal(hermes -p <role> chat -q "...") 동기 호출
     ┌───────────┬───────────┬─────────┼─────────┬───────────┬────────────┬────────────┐
     ▼           ▼           ▼         ▼         ▼           ▼            ▼            ▼
proposal-   budget-     exhibition outreach registration marketing  onsite-ops  postevent-  finance-
agent       vendor-     -agent     -agent   -agent       -agent     -agent      analyst     settlement
(제안서)     agent(예산)  (전시부스)  (섭외)   (등록)       (모객)     (현장)      (사후분석)   -agent(정산)
     │           │           │         │         │           │            │            │            │
     └───────────┴───────────┴─────────┴─────────┴───────────┴────────────┴────────────┴────────────┘
                                        │
                              산출물 반환 (파일 경로)
                                        │
                                        ▼
                              coordinator: Active Verification
                              (파일 직접 열람 / 외부 API 재조회)
                                        │
                              HITL 게이트 대상이면 ↓
                                        ▼
                              🛑 기획자 승인 (Slack/Telegram/CLI)
```

`coordinator`가 유일한 대화 진입점이며, 나머지 9개는 `coordinator`가 위임할 때만 구동되는
실행 전문 프로필입니다(총 10개 프로필). 실행 프로필 사이에는 직접적인 프로필 간 호출이
없습니다 — 모든 조정은 `coordinator`를 거칩니다(중앙집중형 오케스트레이션).

## 왜 외부 파이썬 오케스트레이터를 만들지 않는가

`HermesPPTAutoAgent` 계열 프로젝트처럼 고정된 다단계 파이프라인을 외부 파이썬 스크립트로
짜는 대신, 이 프로젝트는 기획자의 요청이 비선형적이고 대화형이라는 특성에 맞춰
**`coordinator` 프로필 안의 LLM 스스로가** 어떤 하위 프로필에 무엇을 위임할지 판단하게
합니다. 이 판단은 `coordinator`의 SOUL.md 원칙(요청을 하위 태스크로 분해 → 담당 프로필
판단 → 위임 → 검증)으로 유도합니다.

## 위임 메커니즘: `terminal` 동기 호출 (`delegate_task` 아님)

Hermes Agent에는 서브에이전트 위임용 내장 툴 `delegate_task`가 있지만, 자매 프로젝트
`TriAgent_Planner`에서 실측한 결과 **`delegate_task`는 대상 프로필의 SOUL.md/USER.md/
MEMORY.md/skills를 전혀 로드하지 않고, 같은 세션 안에서 이름 없는 범용 서브에이전트를
띄우는 함정**임이 확인되었습니다(TC-20). 이 프로젝트는 처음부터 이 함정을 피해 다음
방식을 채택합니다:

```
terminal(command='/opt/hermes/bin/hermes -p <role> chat -q "<위임 내용>"')
```

- **반드시 동기(foreground)로 실행합니다** — `background=true`로 실행하면 부모 프로세스가
  자식을 죽이는 문제가 있습니다(`TriAgent_Planner` TC-21에서 확인).
- 절대경로(`/opt/hermes/bin/hermes`)를 사용합니다 — 컨테이너 내부 `PATH`에 하위 `hermes`
  호출이 없을 수 있기 때문입니다.
- `kanban`은 이 위임의 **대체재가 아니라 진행 상황을 사람이 볼 수 있게 병행 기록하는
  트래커**로만 사용합니다(`docs/kanban-task-templates.md`류 패턴 — 카드 생성 시
  `assignee`, `workspace`, `priority`, `idempotency_key`를 채웁니다).

> 이 결정은 `TriAgent_Planner`가 겪은 실제 시행착오(delegate_task → 문제 발견 → terminal로
> 교체 → 재검증)를 이 저장소에서 반복하지 않기 위해 설계 단계에서부터 확정한 것입니다.
> 다만 **이 저장소 자체에서는 아직 이 방식을 실제로 구동해 재검증하지 않았습니다** —
> [10-usecase-tests.md](10-usecase-tests.md) Part A 참고.

## 데이터 흐름 (Pre-Event → On-Event → Post-Event)

```
[RFP 입력]
   │
   ▼
proposal-agent: rfp_analysis
   │  (제안서 마크다운, 아젠다 일정표 → workspace/proposals/<event>/)
   │
   ├──▶ budget-vendor-agent: vendor_quote_comparison
   │       (견적 비교 시트, 예산안(승인 대기) → workspace/budget/<event>/)
   │
   ├──▶ exhibition-agent: booth_layout_and_exhibitor_management
   │       (부스 배치도, 전시업체 계약 현황(승인 대기) → workspace/exhibition/<event>/)
   │       — budget-vendor-agent의 예산, outreach-agent의 스폰서 계약과 연계
   │
   ├──▶ outreach-agent: outreach_cadence
   │       (섭외 대시보드, 메일 초안(승인 대기) → workspace/outreach/<event>/)
   │
   ├──▶ marketing-agent: audience_marketing_campaign
   │       (홍보 콘텐츠, 캠페인(승인 대기) → workspace/marketing/<event>/)
   │       — registration-agent의 등록 링크와 연계
   │
   └──▶ registration-agent: attendee_registration_management
           (참가자 DB, 등록 현황, 결제 확인(승인 대기) → workspace/registration/<event>/)
   │
   ▼
   ── 승인 게이트(1·2·5·6 등) 통과 후 행사 진행 ──
   ▼
onsite-ops-agent: incident_response
   │  (돌발 상황 대응 시나리오, 상황 보고 → 필요 시 workspace/reports/<event>/)
   │  — registration-agent의 등록자 명단 참조
   ▼
   ┌─────────────────────────────┬──────────────────────────────────────┐
   ▼                             ▼
postevent-analyst: sentiment_analysis   finance-settlement-agent: postevent_financial_settlement
   (감성 분석 보고서 → workspace/reports/<event>/)   (정산 보고서(승인 대기) → workspace/finance/<event>/)
   (병렬 실행 — 서로 의존하지 않음)                    — budget-vendor-agent/exhibition-agent 계약 데이터 대조
```

각 화살표 옆 스킬명은 [05-skills-and-tools.md](05-skills-and-tools.md)에서 정의합니다.
모든 산출물은 `workspace/{proposals,budget,outreach,registration,exhibition,marketing,
reports,finance}/<event-name>/` 아래에 누적되며, 진행 상황은 `coordinator`의 `MEMORY.md`와
`kanban` 카드에서 추적합니다.

## 최소 권한 원칙

`HermesMICEAgents/AGENTS.md` 4절의 원칙을 그대로 채택합니다: `coordinator`는 파일 생성·
메일 발송 등 **구현 도구를 직접 실행하는 용도로 쓰지 않습니다** — 산출물 확인(Active
Verification)을 위한 읽기 목적으로만 `file` 툴셋을 사용하고, 실제 작성/발송은 항상 하위
프로필에 위임합니다. 이는 Hermes CLI가 `file` 툴셋을 read/write로 세분화해서 끌 수 없기
때문에 **기술적 강제가 아니라 SOUL.md의 행동 규범으로 강제**합니다(`TriAgent_Planner`의
`email_communicator`가 "초안까지만" 원칙을 SOUL.md로 강제하는 것과 동일한 패턴).
