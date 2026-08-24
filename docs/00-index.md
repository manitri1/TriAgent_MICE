# TriAgent_MICE 설계 문서

`refs/idea.md`에서 제안한 6개 역할(coordinator / proposal-agent / budget-vendor-agent /
outreach-agent / onsite-ops-agent / postevent-analyst) 기반 MICE 자동화 시스템을, **실제
[Nous Research Hermes Agent](https://github.com/NousResearch/hermes-agent) CLI** 위에서
동작하는 Profile 세트로 구체화한 설계 문서 세트입니다.

## 문서 구성

| 문서 | 내용 |
|---|---|
| [01-review-of-idea.md](01-review-of-idea.md) | 원본 아이디어 검토 — idea.md가 가정한 커스텀 연동 중 Hermes Agent가 이미 내장 제공하는 것과 실제로 새로 만들어야 하는 것 구분 |
| [02-architecture.md](02-architecture.md) | 6개 프로필의 관계도와 데이터 흐름, 오케스트레이션 방식 |
| [03-hermes-agent-integration.md](03-hermes-agent-integration.md) | 실제 Hermes Agent CLI로 프로필을 만들고 배포하는 방법, 프로필별 필요 툴셋 |
| [04-agents-and-souls.md](04-agents-and-souls.md) | 6개 에이전트의 SOUL(SOUL.md) 전체 초안 |
| [05-skills-and-tools.md](05-skills-and-tools.md) | 에이전트별 Skill(SKILL.md) 정의 |
| [06-hitl-approval-design.md](06-hitl-approval-design.md) | coordinator가 관리하는 3개 Human-in-the-Loop 승인 게이트 상세 설계 |
| [07-roadmap.md](07-roadmap.md) | 이번 단계 이후 남은 작업 (Cvent/CRM 연동, 오케스트레이션·HITL 실측) |
| [08-docker-deployment.md](08-docker-deployment.md) | Windows Docker Compose 배포 — 형제 프로젝트 포트/볼륨 조사 결과, C: 미사용 설계 |
| [09-users-guide.md](09-users-guide.md) | 실행/운영 가이드 (챗 중심) — 프로필별 대화 진입점, 흔한 함정, 트러블슈팅 |
| [10-usecase-tests.md](10-usecase-tests.md) | Usecase 테스트 목록 (챗 중심) — 현재는 전부 미검증(⬜) 상태 |
| [11-usecase-tests-pohang-mice-academy.md](11-usecase-tests-pohang-mice-academy.md) | 실제 프로젝트(`.hermes/workspace/inputs/포항 마이스아카데미 프로젝트 행사 계획.pdf`) 데이터를 사용한 별도 유스케이스 테스트 — 에이전트별 입력/출력 확인 체크리스트 포함 |
| [12-hostinger-vps-deployment.md](12-hostinger-vps-deployment.md) | Hostinger VPS(hPanel) 배포 — 로컬 Windows 인스턴스를 Docker로 상시 운영 서버로 이관하는 절차 (git clone + rsync로 런타임 데이터 이관, SSH 터널 대시보드 접근) |

## 한 줄 요약

- 원본 아이디어의 **역할별 페르소나(Profile) + 절차적 지식(Skill) 분리 철학**은 그대로 채택합니다.
- `hermes_agent`는 가상의 패키지가 아니라 Nous Research가 실제로 공개한 CLI 에이전트이며,
  인스턴스(Profile)당 페르소나 1개만 가질 수 있습니다. 그래서 idea.md의 6개 전문가 역할을
  **6개의 격리된 Hermes Agent Profile**로 만듭니다.
- idea.md가 "MCP 연동 필요"로 가정했던 Web Search/Fetch/FileSystem, "메시징 게이트웨이 구축
  필요"로 가정했던 Slack/Telegram/CLI 알림, "샌드박스 실행 환경 필요"로 가정했던 데이터
  분석/시각화는 **Hermes Agent가 이미 내장 툴셋/게이트웨이로 제공**합니다([01장](01-review-of-idea.md)
  참고). 반대로 Cvent REST API, CRM 연동 같은 **외부 MICE 전용 API**는 여전히 커스텀
  설계·구현이 필요합니다.
- 다중 프로필 간 작업 조정(coordinator의 역할)은 외부 파이썬 오케스트레이터를 새로 짜는
  대신, Hermes Agent 내장 `terminal`(프로필 동기 호출)과 `kanban`(진행 상황 트래커) 기능으로
  구현합니다([02장](02-architecture.md)). 이 저장소는 `HermesMICEAgents`가 이미 검증한 6-역할
  분담·SOUL 원칙·SKILL 절차를 실제 Hermes CLI 컨벤션으로 재구성한 것입니다 — 자매 프로젝트
  `TriAgent_Planner`가 겪은 `delegate_task` 관련 시행착오(대상 프로필을 전혀 로드하지 않는
  버그)를 처음부터 피해 `terminal` 동기 호출 방식으로 설계했습니다.
- **설계 문서 + 실행 가능한 Profile 스캐폴드**(`config.yaml`/`SOUL.md`/`USER.md`/`MEMORY.md`/
  `skills/*/SKILL.md`)까지 작성했습니다. Windows Docker Compose 배포([08장](08-docker-deployment.md))
  파일도 준비했지만, **아직 실제로 빌드·구동·챗 스모크 테스트는 하지 않았습니다** — 남은
  작업은 [07-roadmap.md](07-roadmap.md)와 [10-usecase-tests.md](10-usecase-tests.md)에
  미검증 항목으로 정리되어 있습니다.
