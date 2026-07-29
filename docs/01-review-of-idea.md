2# 01. `refs/idea.md` 재검토 — 실제 Hermes Agent CLI 기능 대조

`refs/idea.md`는 Hermes Agent를 "우리가 처음부터 다 만들어야 하는 프레임워크"처럼 다루고
있습니다. 실제로는 Nous Research가 공개한 실존 오픈소스 CLI 에이전트(`hermes-agent`)이며,
상당한 기능을 이미 내장하고 있습니다. 이번 장은 idea.md의 각 항목을 "이미 있음 / 커스텀
필요"로 재분류합니다. (이 대조 방법론과 결론은 자매 프로젝트 `TriAgent_Planner`의
`docs/01-review-of-idea.md`에서 실제로 검증된 내용을 MICE 도메인에 맞게 재적용한 것입니다.)

## 대조표

| idea.md 항목 | idea.md의 가정 | 실제 Hermes Agent CLI | 결론 |
|---|---|---|---|
| Web Search MCP / Fetch MCP | 별도 MCP 서버를 구축·연동해야 함 | 내장 `web`/`search`/`browser` 툴셋 (`hermes tools enable web`) | **이미 있음** — MCP를 새로 만들 필요 없음 |
| FileSystem MCP | 별도 MCP 서버 구축 | 내장 `file` 툴셋 (read/write/search/patch) | **이미 있음** |
| Messaging Gateway (Slack/Telegram/CLI) | 우리가 직접 구현해야 하는 알림 채널 | `hermes gateway setup`으로 Telegram/Discord/Slack/WhatsApp/Email 등 20+ 플랫폼 기본 지원 | **이미 있음** — 설정만 하면 됨 |
| 견적 비교 시트·감성분석 실행 환경 (budget-vendor-agent, postevent-analyst) | 별도 실행 환경 구축 | 내장 `code_execution`(샌드박스 파이썬) 툴셋 | **이미 있음** |
| Cvent REST API 연동 (budget-vendor-agent) | Python 코드로 직접 구현 예정이었음 | 내장 기능 없음 | **커스텀 필요** — MCP 서버 또는 커스텀 툴, 계약·인증 정보 확보 후 진행 |
| CRM(HubSpot/Salesforce) 연동 (outreach-agent) | Python 코드로 직접 구현 예정이었음 | 내장 기능 없음 | **커스텀 필요** |
| 등록 플랫폼/결제 PG 연동 (registration-agent) | Python 코드로 직접 구현 예정이었음 | 내장 기능 없음 | **커스텀 필요** — 등록 폼까지는 `code_execution`/`file`로 대체 가능하나 실시간 결제 확정·환불은 PG API 연동이 필요 |
| 광고 플랫폼 API 연동 (marketing-agent) | Python 코드로 직접 구현 예정이었음 | 내장 기능 없음 | **커스텀 필요** — 연동 전까지는 캠페인 성과를 수동 입력·`code_execution` 집계로 대체 |
| 다중 에이전트 오케스트레이션 (coordinator) | 우리가 별도 오케스트레이터를 만들어야 함 | 내장 `terminal`(프로필 동기 호출), `kanban`(다중 프로필 작업큐), `profile` 시스템 | **이미 있음** — 단, `delegate_task`는 대상 프로필의 SOUL/USER/MEMORY/skills를 로드하지 않는 함정임이 `TriAgent_Planner`에서 실측 확인됨 → `terminal` 동기 호출로 대체, [02장](02-architecture.md) 참고 |
| 승인 지점 (HITL) | Slack/CLI로 사람에게 승인받는 절차를 새로 설계해야 함 | 게이트웨이의 `/approve`/`/deny`는 **쉘 명령 승인**용 (`approvals.mode`) — 예산 확정·메일 발송처럼 도메인 특화된 승인과는 다름 | **부분적** — 메커니즘은 있지만 용도가 다름. `messaging`/`clarify` 툴셋으로 도메인 승인 대화를 직접 설계해야 함 ([06장](06-hitl-approval-design.md)) |
| 기억 구조 (Profile/SOUL/MEMORY) | idea.md 자체 설계 | Hermes Agent의 Profile 시스템(`~/.hermes/profiles/<name>/`)과 정확히 대응 | **설계 그대로 유효** — 파일 배치 방식만 실제 CLI 컨벤션에 맞춤 |

## `HermesMICEAgents`와의 관계

이 저장소의 6개 역할·SOUL 원칙·SKILL 절차는 새로 지어낸 것이 아니라, 자매 프로젝트
`HermesMICEAgents`(별도 저장소, `e:/work/Hermes/HermesMICEAgents`)에서 이미 실제로 구축·
운영하며 검증한 내용을 **실제 Hermes Agent CLI의 Profile 컨벤션**으로 재구성한 것입니다.

| `HermesMICEAgents` 소스 | 이 저장소의 대응 위치 |
|---|---|
| `hermes-data/profiles/*/SOUL.md`(톤/해야 할 일/하지 말아야 할 일/도구 범위) | `.hermes/profiles/*/SOUL.md`(Persona/Principles 구조로 재작성), [04장](04-agents-and-souls.md) |
| `hermes-data/profiles/*/skills/*/SKILL.md`(RFP 분석, 견적 비교, 아웃리치 캐던스, 인시던트 대응, 감성분석, 작업 분배·검증) | `.hermes/profiles/*/skills/*/SKILL.md`, [05장](05-skills-and-tools.md) |
| `hermes-data/AGENTS.md` 3절(HITL 3개 게이트) | [06-hitl-approval-design.md](06-hitl-approval-design.md) |
| `hermes-data/AGENTS.md` 1·4절(팀 구성·최소 권한 원칙) | [02-architecture.md](02-architecture.md) |

`HermesMICEAgents`는 이 작업 과정에서 전혀 수정하지 않았습니다 — 읽기 전용 참고 소스입니다.

> **참고:** `registration-agent`/`exhibition-agent`/`marketing-agent`/
> `finance-settlement-agent` 4개 역할은 `HermesMICEAgents`에서 이식한 것이 아니라, 이
> 저장소에서 MICE 기획사 실무 관점으로 신규 설계한 것이다(등록·전시·모객 마케팅·사후 정산은
> 원래 6개 역할 어디에도 없던 기능 영역). 나머지 표의 이식 관계와는 별개다.

## 핵심 결론

1. **idea.md의 "Soul + Skill 분리" 철학은 그대로 유효합니다.** 좋은 설계이며 수정할 필요가
   없습니다.
2. **idea.md가 "직접 구현해야 한다"고 가정했던 인프라(MCP, 게이트웨이, 실행환경,
   오케스트레이션)의 절반 이상은 Hermes Agent가 이미 제공**합니다. 이번 스캐폴드는 이 내장
   기능을 "어떻게 켜고 어떻게 SOUL.md/SKILL.md에서 지시할지"를 정의하는 데 집중합니다
   ([03장](03-hermes-agent-integration.md)).
3. **여전히 커스텀 구현이 필요한 것**: Cvent REST API 연동, CRM 연동, 등록 플랫폼/결제 PG
   연동, 광고 플랫폼 API 연동, 도메인 단위 HITL 승인 대화 설계. 앞의 넷은 스킬 문서에 "향후
   연동 예정"으로 명시만 하고([07장](07-roadmap.md)), HITL 승인 대화는 이미 있는
   `messaging`/`clarify` 툴셋으로 지금 설계·문서화합니다([06장](06-hitl-approval-design.md)).
4. **오케스트레이션은 `terminal` 동기 호출 방식으로 처음부터 확정합니다.** `TriAgent_Planner`가
   `delegate_task`를 먼저 써봤다가 대상 프로필을 전혀 로드하지 않는다는 것을 뒤늦게 발견하고
   교체한 시행착오(TC-17~21)를 이 저장소는 반복하지 않습니다 — 다만 이 결정 자체는 아직 이
   저장소에서 실제로 구동해 재검증하지는 않았습니다([10장](10-usecase-tests.md) 참고).
