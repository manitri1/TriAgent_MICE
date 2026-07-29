MICE(Meeting·Incentive·Convention·Exhibition) 기획 전 주기 — 사전 준비(Pre-Event), 현장 운영
(On-Event), 사후 회고(Post-Event) — 를 페르소나가 아닌 시스템 직관성이 높은 **역할 기반
(Role-based) 에이전트**로 전면 분업하여 설계했습니다.

---

## [1단계: 5대 레이어 설계]

### 1. I/O 및 작업 경계 명세

* **목표:** RFP 분석 및 제안서·아젠다 초안 작성, 컨벤션 센터·숙박 견적 수집 및 예산안 수립,
  연사·스폰서 소싱 및 아웃리치 메일 작성·추적, 참가자 등록·결제 확인 및 참가자 DB 관리,
  전시 부스 배치 및 전시업체 계약 관리, 행사 자체의 참가자 모객 마케팅, 현장 실시간
  오퍼레이션 추적 및 비상 대응, 행사 후 피드백 수집·감성 분석 및 실제 비용·매출 정산을
  자동화
* **입력 (Inputs):** RFP 원문/요약, 참가 규모·예산 상한·후보 지역, 섭외 대상 후보(연사/스폰서),
  참가자 등록 정보 및 결제 상태, 전시장 도면·전시업체 조건, 타깃 참가자군 정보, 현장 실시간
  상황 설명, 설문·SNS 피드백 원시 데이터, 실제 집행 인보이스/영수증
* **산출물 (Outputs):** 제안서 마크다운 및 아젠다 일정표, 벤더 견적 비교 시트 및 예산안,
  섭외 대시보드 및 메일 초안(Draft), 참가자 DB 및 등록 현황, 부스 배치도 및 전시업체 계약
  현황, 홍보 콘텐츠 및 캠페인 성과 리포트, 우회 아젠다 공지안 및 상황 보고 요약본, 카테고리별
  감성 분석 보고서, 최종 정산 보고서
* **저장 위치:** `~/.hermes/workspace/{proposals,budget,outreach,registration,exhibition,
  marketing,reports,finance}/<event-name>/`
* **금지 조건 (Prohibited Conditions):**
  * 기획자 승인 없는 예산 최종 확정 금지
  * 기획자 승인 없는 연사/스폰서 대상 최초 메일 발송 금지
  * 기획자 승인 없는 위기 우회 아젠다의 실제 공지 금지 (인명·안전 직결 시 최소 조치 예외)
  * 기획자 승인 없는 참가자 결제/환불 처리 금지
  * 기획자 승인 없는 전시 부스 계약 확정 금지
  * 기획자 승인 없는 유료 광고/대량 홍보 캠페인 집행 금지
  * 기획자 승인 없는 사후 정산 확정 및 대금 지급 금지
  * 서로 다른 행사(클라이언트)의 정보를 같은 메모리/스킬 문서에 혼입 금지
  * 확인되지 않은 벤더·담당자 보고를 재확인 없이 최종 상태로 기록 금지

---

### 2. 역할형 에이전트 분업 구조 (R&R)

* **coordinator | 총괄 코디네이터**
  * 전체 워크플로 제어, 하위 에이전트 간 작업 분배 및 산출물 교차 검증
  * **담당 영역:** 작업 분해·배정, Active Verification(하위 에이전트의 "완료" 보고를 그대로
    신뢰하지 않고 산출물을 직접 확인), Human-in-the-Loop 게이트 관리

* **proposal-agent | 제안서 작성 에이전트**
  * RFP의 평가 배점 우선순위와 숨은 의도를 분별해 "문제 인식 우선" 구조로 제안서 뼈대 구성
  * **담당 영역:** RFP 분석, 제안서·아젠다 초안, 타깃/현지 리서치, 회사 지식(성공 사례·
    포지셔닝) 결합

* **budget-vendor-agent | 예산·벤더 에이전트**
  * 컨벤션 센터·숙박·케이터링 벤더 견적을 비교해 예산안 작성, 모든 수치에 출처 표기
  * **담당 영역:** 견적 수집·비교 시트, 예산 상한 초과 항목 표시, 승인 대기 상태 유지

* **outreach-agent | 아웃리치 에이전트**
  * 연사/스폰서 타깃 스카우팅 및 점수화, 하이퍼 개인화 메일 초안 작성 및 추적
  * **담당 영역:** 섭외 대시보드, 메일 초안, 최초 발송 승인 대기, 사전 승인 규칙 내 자동
    팔로우업

* **onsite-ops-agent | 현장 오퍼레이션 에이전트**
  * "에이전트의 자기 보고 불신" 원칙 — 담당자의 "해결됐다" 보고를 그대로 믿지 않고 가능한
    경우 직접 재확인
  * **담당 영역:** 돌발 상황 시 복수(2~3개) 대안 시나리오 산출, 우회 아젠다 공지 전 승인 대기

* **postevent-analyst | 사후 분석 에이전트**
  * 설문 원시 데이터와 SNS 피드백을 카테고리별로 감성 분석해 개선 방향 도출
  * **담당 영역:** 감성 분석 보고서, 표본 크기·수집 기간 명시, 개인 식별 정보 비노출

* **registration-agent | 등록·참가자 관리 에이전트**
  * 참가자 등록 접수, 참가비 결제 상태 확인, 명찰·초청장 발급 데이터 준비
  * **담당 영역:** 참가자 DB 관리, 등록 현황 집계, 결제/환불 승인 대기 처리

* **exhibition-agent | 전시·부스 운영 에이전트**
  * 전시 부스 배치도(플로어플랜) 설계, 전시업체 계약 현황 관리, 스폰서 부스 혜택 이행 확인
  * **담당 영역:** 배치도, 전시업체 계약 시트, 안전 규정 준수 점검, 부스 계약 승인 대기 처리

* **marketing-agent | 참가자 모객 마케팅 에이전트**
  * 행사 자체의 대외 홍보(SNS/랜딩페이지/이메일 캠페인)로 일반 참가자 모객
  * **담당 영역:** 채널별 홍보 콘텐츠, 등록 링크 연동, 캠페인 성과 추적, 유료/대량 캠페인
    승인 대기 처리

* **finance-settlement-agent | 사후 정산 에이전트**
  * 사전 예산 대비 실제 집행 대조, 협력업체 대금 지급 내역 정리, 최종 정산 보고서 작성
  * **담당 영역:** 정산 보고서(출처·인보이스 번호 포함), 미지급/분쟁 항목 표시, 정산 확정
    승인 대기 처리

---

### 3. 기억 & 자산화 아키텍처

| 구분 | 위치 | 보관 내용 | 성격 및 역할 |
| --- | --- | --- | --- |
| **Profile** | `profiles/<role>/USER.md` | 기획자 이름/직함, 커뮤니케이션 스타일, 섭외 메일 문체, 승인 채널 | 정적 사용자 컨텍스트 |
| **Profile** | `profiles/<role>/SOUL.md` | 역할별 페르소나, 시스템 프롬프트, 원칙 | 에이전트 정체성 명세 |
| **Memory** | `profiles/<role>/MEMORY.md` | 확정된 벤더 목록, 회사 지식, 누적 섭외 이력 | **지속 유효 장기 기억 (Static Facts)** |
| **Skill** | `profiles/<role>/skills/` | RFP 분석 절차, 견적 비교 알고리즘, 아웃리치 캐던스, 참가자 등록 관리, 부스 배치·전시업체 관리, 참가자 모객 캠페인, 인시던트 대응, 감성분석 파이프라인, 사후 정산 절차 | **절차적 지식 (Procedural Knowledge)** |
| **Workspace** | `workspace/{proposals,budget,outreach,registration,exhibition,marketing,reports,finance}/<event-name>/` | 행사별 산출물, 임시 데이터 | 프로젝트 전용 세션 작업 공간 |

---

### 4. 도구 및 게이트웨이 연동

* **MCP (Model Context Protocol):**
  * `Web Search MCP` / `Fetch MCP`: `proposal-agent`의 타깃/현지 리서치, `postevent-analyst`의
    SNS 피드백 수집용
  * `FileSystem MCP`: 로컬 workspace 산출물 관리

* **Messaging Gateway (Slack / Telegram / CLI):**
  * 기획자 명령 입력 및 `coordinator`의 🛑 **[사람 승인]** 요청 알림 발송

* **Nous Tool Gateway & CLI:**
  * `code_execution`(샌드박스): `budget-vendor-agent`의 견적 비교 시트, `postevent-analyst`의
    감성분석 파이프라인 실행
  * `terminal`: `onsite-ops-agent`의 통신/장비 상태 재확인, `coordinator`의 프로필 간 위임 호출

* **API Integrations (커스텀 연동 필요, 계획 단계):**
  * `Cvent REST API`: 컨벤션 센터·숙박 실시간 견적 조회 — `budget-vendor-agent`
  * `CRM(HubSpot/Salesforce)`: 리드 스코어링 연계 — `outreach-agent`
  * `등록 플랫폼(예: Cvent Registration, 자체 등록 폼) API`: 참가자 등록·결제 상태 실시간
    동기화 — `registration-agent`
  * `결제 PG(Payment Gateway) API`: 참가비 결제/환불 처리 — `registration-agent`
  * `광고 플랫폼 API(Meta/Google Ads 등)`: 유료 캠페인 성과 자동 수집 — `marketing-agent`

---

### 5. 안전 승인 지점 (Human-in-the-Loop)

```
[budget-vendor-agent: 예산안 초안]     ──┐
[outreach-agent: 최초 섭외 메일 초안]    ──┤
[onsite-ops-agent: 우회 아젠다 초안]     ──┼──> [coordinator: 검증] ──> 🛑 [사람 승인: Slack/CLI] ──> (승인 시) 다음 단계 진행
[registration-agent: 결제/환불 처리]    ──┤                                        └──> (반려 시) 수정 재요청
[exhibition-agent: 부스 계약 확정]      ──┤
[marketing-agent: 유료/대량 캠페인]     ──┤
[finance-settlement-agent: 정산 확정]  ──┘
```

* 🛑 **승인 지점 1 (예산 최종 승인):** 벤더 계약을 실제로 확정하기 전
* 🛑 **승인 지점 2 (연사/스폰서 최초 발송):** 동일 대상에게 보내는 첫 메일을 발송하기 전
  (승인된 팔로우업 규칙 내 후속 메일은 자동 진행 가능)
* 🛑 **승인 지점 3 (위기 우회 아젠다 적용):** 대안 시나리오를 실제로 공지하기 전 (인명·안전
  직결 시 최소 조치 후 즉시 사후 보고 예외)
* 🛑 **승인 지점 4 (참가자 결제/환불 처리):** `registration-agent`가 실제 결제·환불을
  확정하기 전
* 🛑 **승인 지점 5 (전시 부스 계약 확정):** `exhibition-agent`가 전시업체와의 계약을
  실제로 확정하기 전
* 🛑 **승인 지점 6 (유료 광고/대량 캠페인 집행):** `marketing-agent`가 유료 광고 예산을
  집행하거나 대량 홍보 캠페인을 발송하기 전
* 🛑 **승인 지점 7 (사후 정산 확정):** `finance-settlement-agent`가 최종 정산을 확정하고
  협력업체 대금 지급을 진행하기 전

---

## [2단계: 표준 폴더 구조 배치]

```text
~/.hermes/
├── config.yaml                       # 메인 Hermes Agent 설정
├── profiles/
│   ├── coordinator/                  # [총괄] 작업 분배 및 검증
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 확정된 마일스톤 및 검증 이력
│   │   └── skills/
│   │       └── task_dispatch_and_verification/
│   │           └── SKILL.md          # 작업 분배·Active Verification·HITL 게이트 절차
│   │
│   ├── proposal-agent/               # [제안서] RFP 분석 및 초안 작성
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 회사 지식(성공 사례·포지셔닝) 및 조사 이력
│   │   └── skills/
│   │       └── rfp_analysis/
│   │           └── SKILL.md          # RFP 배점 분석 및 문제 인식 우선 제안서 빌드 절차
│   │
│   ├── budget-vendor-agent/          # [예산·벤더] 견적 비교 및 예산안
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 확정 벤더 목록 및 단가 이력
│   │   └── skills/
│   │       └── vendor_quote_comparison/
│   │           └── SKILL.md          # 견적 수집·비교·예산안 작성 절차
│   │
│   ├── outreach-agent/               # [아웃리치] 연사·스폰서 섭외
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 섭외 대상 이력 및 응답률
│   │   └── skills/
│   │       └── outreach_cadence/
│   │           └── SKILL.md          # 타깃 점수화·하이퍼개인화 메일·팔로우업 절차
│   │
│   ├── onsite-ops-agent/             # [현장 대응] 실시간 오퍼레이션
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 현장 참고 자료 및 과거 인시던트 이력
│   │   └── skills/
│   │       └── incident_response/
│   │           └── SKILL.md          # 자기보고 불신·복수 대안 시나리오 절차
│   │
│   ├── postevent-analyst/            # [사후 분석] 피드백 감성 분석
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 과거 행사 감성 분석 요약
│   │   └── skills/
│   │       └── sentiment_analysis/
│   │           └── SKILL.md          # 카테고리별 감성분석 및 보고서 컴파일 절차
│   │
│   ├── registration-agent/           # [등록·참가자 관리] 등록 접수 및 결제 확인
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 등록 현황 및 결제 확인 이력
│   │   └── skills/
│   │       └── attendee_registration_management/
│   │           └── SKILL.md          # 등록 접수·결제 확인·명찰 발급 데이터 준비 절차
│   │
│   ├── exhibition-agent/             # [전시·부스 운영] 부스 배치 및 전시업체 관리
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 부스 배치 및 전시업체 계약 이력
│   │   └── skills/
│   │       └── booth_layout_and_exhibitor_management/
│   │           └── SKILL.md          # 배치도 설계 및 전시업체 계약 관리 절차
│   │
│   ├── marketing-agent/              # [참가자 모객 마케팅] 대외 홍보 및 캠페인
│   │   ├── SOUL.md
│   │   ├── USER.md
│   │   ├── MEMORY.md                 # 캠페인 성과 이력
│   │   └── skills/
│   │       └── audience_marketing_campaign/
│   │           └── SKILL.md          # 채널별 홍보 콘텐츠 및 캠페인 성과 추적 절차
│   │
│   └── finance-settlement-agent/     # [사후 정산] 실제 비용·매출 정산
│       ├── SOUL.md
│       ├── USER.md
│       ├── MEMORY.md                 # 정산 확정 및 대금 지급 이력
│       └── skills/
│           └── postevent_financial_settlement/
│               └── SKILL.md          # 예산 대비 실제 집행 대조 및 정산 보고서 작성 절차
│
└── workspace/                        # 산출물 작업 디렉토리
    ├── proposals/<event-name>/       # proposal-agent 산출물
    ├── budget/<event-name>/          # budget-vendor-agent 산출물
    ├── outreach/<event-name>/        # outreach-agent 산출물
    ├── registration/<event-name>/    # registration-agent 산출물
    ├── exhibition/<event-name>/      # exhibition-agent 산출물
    ├── marketing/<event-name>/       # marketing-agent 산출물
    ├── reports/<event-name>/         # postevent-analyst 산출물
    └── finance/<event-name>/         # finance-settlement-agent 산출물
```
