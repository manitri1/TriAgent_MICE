# 02. 아키텍처 — 프로필 관계와 오케스트레이션

## 프로필 관계도

```
                                   기획자(사용자)
                                        │
                                        ▼
                              ┌───────────────────┐
                              │    coordinator     │  ← 유일한 대화 진입점(칸반 오케스트레이터)
                              │  (총괄 코디네이터)   │
                              └─────────┬─────────┘
                                        │ kanban_create()+kanban_link() → 디스패처 자동 spawn
     ┌───────────┬───────────┬─────────┼─────────┬───────────┬────────────┬────────────┐
     ▼           ▼           ▼         ▼         ▼           ▼            ▼            ▼
proposal-   budget-     exhibition outreach registration marketing  onsite-ops  postevent-  finance-
agent       vendor-     -agent     -agent   -agent       -agent     -agent      analyst     settlement
(제안서)     agent(예산)  (전시부스)  (섭외)   (등록)       (모객)     (현장)      (사후분석)   -agent(정산)
     │           │           │         │         │           │            │            │            │
     └───────────┴───────────┴─────────┴─────────┴───────────┴────────────┴────────────┴────────────┘
                                        │
                    kanban_complete(summary=...) — 산출물 경로 포함
                       (HITL 지점이면 대신 kanban_block(reason=...))
                                        │
                                        ▼
                    auto_subscribe_on_create 이벤트로 coordinator 세션 자동 재개
                                        │
                                        ▼
                              coordinator: Active Verification
                              (파일 직접 열람 / 외부 API 재조회)
                                        │
                              HITL 게이트(blocked)면 ↓
                                        ▼
                    🛑 기획자 승인 (Slack/Telegram/CLI) → kanban_unblock(task_id)
```

`coordinator`가 유일한 대화 진입점이며, 나머지 9개는 `coordinator`가 kanban 태스크를
만들 때 디스패처가 자동으로 구동하는 실행 전문 프로필입니다(총 10개 프로필). 실행
프로필 사이에는 직접적인 프로필 간 호출이 없습니다 — 모든 조정은 `coordinator`가 만드는
태스크 그래프(`kanban_create`/`kanban_link`)를 거칩니다(중앙집중형 오케스트레이션, 단
실제 구동 자체는 디스패처가 비동기로 수행합니다).

## 왜 외부 파이썬 오케스트레이터를 만들지 않는가

`HermesPPTAutoAgent` 계열 프로젝트처럼 고정된 다단계 파이프라인을 외부 파이썬 스크립트로
짜는 대신, 이 프로젝트는 기획자의 요청이 비선형적이고 대화형이라는 특성에 맞춰
**`coordinator` 프로필 안의 LLM 스스로가** 어떤 하위 프로필에 무엇을 위임할지 판단하게
합니다. 이 판단은 `coordinator`의 SOUL.md 원칙(요청을 하위 태스크로 분해 → 담당 프로필
판단 → 위임 → 검증)으로 유도합니다.

## 위임 메커니즘: 칸반 디스패처 자동 spawn (`delegate_task`도 `terminal`도 아님)

Hermes Agent에는 서브에이전트 위임용 내장 툴 `delegate_task`가 있지만, 자매 프로젝트
`TriAgent_Planner`에서 실측한 결과 **`delegate_task`는 대상 프로필의 SOUL.md/USER.md/
MEMORY.md/skills를 전혀 로드하지 않고, 같은 세션 안에서 이름 없는 범용 서브에이전트를
띄우는 함정**임이 확인되었습니다(TC-20). 이 판단은 여전히 유효하며 바뀌지 않습니다.

초기 설계는 이 함정을 피해 `terminal(hermes -p <role> chat -q "...")` 동기 호출을 위임
메커니즘으로 채택했지만, 실측 결과 이 방식은 근본적인 한계가 있었습니다: coordinator가
한 번에 하나씩만 순차 호출할 수 있어 실제 병렬 분기(예산/전시/섭외/마케팅/등록)를 흉내만
낼 수 있고, 하위 프로필의 응답 전문이 그대로 coordinator 컨텍스트에 쌓여 팽창하며, 재기동/
복구가 전적으로 LLM의 즉흥 판단에 의존했습니다. 또한 "칸반은 트래커일 뿐"이라는 원래
방침 아래 실제 운영에서는 `kanban_create()` 대신 사람이 손으로 마크다운 카드를 쓰는
방식으로 흘러갔습니다(`.hermes/kanban.db`의 `tasks` 테이블이 0행이었던 것으로 확인).

현재 설계는 Hermes Agent에 내장된 **진짜 칸반 디스패처**를 씁니다 — `delegate_task`와는
완전히 다른 메커니즘으로, SOUL.md/USER.md/MEMORY.md/skills를 온전히 로드한 실제
`hermes -p <role>` 워커 프로세스를 게이트웨이 안에서 자동으로 구동합니다.

```python
kanban_create(
    title="...", assignee="<role>",
    workspace="dir:/opt/data/workspace/<category>/<event-slug>",
    tenant="<event-slug>", parents=[...], idempotency_key="<event-slug>-<task>",
)
kanban_link(parent_id=..., child_id=...)   # 의존관계가 여러 개일 때
```

- `parents`로 연결된 태스크는 부모가 전부 `done`이 되어야 `ready`로 승격되고, 이때
  디스패처(`kanban.dispatch_in_gateway: true`, 게이트웨이 안에서 상시 폴링)가 담당 프로필을
  자동 spawn합니다. `coordinator`는 `terminal`로 직접 하위 프로필을 호출하지 않습니다.
- `coordinator`는 태스크 생성 후 동기로 기다리지 않습니다 — `auto_subscribe_on_create`
  설정으로 담당 태스크가 `done`/`blocked`가 되면 세션이 자동으로 재개됩니다.
- `tenant`(이벤트 슬러그)로 이벤트 간 데이터 격리에 처음으로 기술적 근거가 생겼습니다 —
  기존에는 SOUL.md 문구("다른 행사 자료와 섞지 않는다")에만 의존했습니다.
- HITL 게이트는 워커가 `kanban_complete()` 대신 `kanban_block(reason=...)`을 호출해
  스스로 멈추고, `coordinator`가 기획자 승인 후에만 `kanban_unblock()`을 호출합니다 —
  [06-hitl-approval-design.md](06-hitl-approval-design.md) 참고.

> `terminal` 자체는 여전히 coordinator의 툴셋에 남아 있지만(진단용 CLI 호출 등), 위임의
> 주 경로로는 더 이상 쓰지 않습니다. `delegate_task` 회피 결정은 이 변경과 무관하게
> 계속 유효합니다.
>
> ⚠️ **이 칸반 디스패처 메커니즘은 이 저장소에서 단 한 번도 실행된 적이 없습니다**
> (`.hermes/kanban.db`가 배포 시점까지 빈 상태였음). 프레임워크 공식 문서를 근거로
> 설계했으나, 실제 컨테이너에서 스모크 테스트로 검증되기 전까지는 "설계됨"이지 "동작
> 확인됨"이 아닙니다 — [10-usecase-tests.md](10-usecase-tests.md) Part A 참고.

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

### 위 다이어그램의 `kanban_create(parents=...)` 매핑

다이어그램의 화살표는 실제로는 `parents`(또는 `kanban_link()`)로 표현되는 의존관계입니다.
`rfp_analysis`에서 직접 뻗는 화살표만으로는 부족한 교차 연계(위 "연계" 주석)까지 반영하면:

| 태스크 | assignee | parents |
|---|---|---|
| `rfp_analysis` | proposal-agent | (없음 — 루트) |
| `vendor_quote_comparison` | budget-vendor-agent | `rfp_analysis` |
| `outreach_cadence` | outreach-agent | `rfp_analysis` |
| `attendee_registration_management` | registration-agent | `rfp_analysis` |
| `booth_layout_and_exhibitor_management` | exhibition-agent | `rfp_analysis`, `vendor_quote_comparison`, `outreach_cadence` (예산+섭외 데이터 필요) |
| `audience_marketing_campaign` | marketing-agent | `rfp_analysis`, `attendee_registration_management` (등록 링크 필요) |
| `incident_response` | onsite-ops-agent | `attendee_registration_management`(등록자 명단) — 그 외 예산/섭외/전시/마케팅/등록의 HITL 게이트가 전부 `kanban_unblock`된 뒤에만 coordinator가 이 태스크를 생성 |
| `sentiment_analysis` | postevent-analyst | `incident_response` |
| `postevent_financial_settlement` | finance-settlement-agent | `incident_response`, `vendor_quote_comparison`, `booth_layout_and_exhibitor_management` |

`sentiment_analysis`와 `postevent_financial_settlement`는 서로를 `parents`에 넣지 않습니다
(다이어그램의 "병렬 실행 — 서로 의존하지 않음" 그대로). 모든 태스크에 동일한
`tenant: "<event-slug>"`를 지정해 이벤트 간 데이터가 섞이지 않게 합니다 — 필드 전체 설명은
`coordinator`의 `skills/orchestration/mice-coordinator-workflow/templates/
kanban_create_call_reference.md` 참고.

## 최소 권한 원칙

`HermesMICEAgents/AGENTS.md` 4절의 원칙을 그대로 채택합니다: `coordinator`는 파일 생성·
메일 발송 등 **구현 도구를 직접 실행하는 용도로 쓰지 않습니다** — 산출물 확인(Active
Verification)을 위한 읽기 목적으로만 `file` 툴셋을 사용하고, 실제 작성/발송은 항상 하위
프로필에 위임합니다. 이는 Hermes CLI가 `file` 툴셋을 read/write로 세분화해서 끌 수 없기
때문에 **기술적 강제가 아니라 SOUL.md의 행동 규범으로 강제**합니다(`TriAgent_Planner`의
`email_communicator`가 "초안까지만" 원칙을 SOUL.md로 강제하는 것과 동일한 패턴).
