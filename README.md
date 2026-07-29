# TriAgent_MICE

RFP 분석·제안서 작성, 장소·숙박 견적 및 예산안 수립, 연사·스폰서 아웃리치, 참가자 등록·결제
관리, 전시 부스·전시업체 운영, 참가자 모객 마케팅, 현장 실시간 대응, 행사 후 피드백 분석 및
사후 정산을 자동화하는, [Nous Research Hermes Agent](https://github.com/NousResearch/hermes-agent)
CLI 기반 10-역할(coordinator / proposal-agent / budget-vendor-agent / outreach-agent /
registration-agent / exhibition-agent / marketing-agent / onsite-ops-agent /
postevent-analyst / finance-settlement-agent) MICE(Meeting·Incentive·Convention·Exhibition)
자동화 시스템입니다.

설계 배경과 아키텍처는 [docs/](docs/00-index.md)를 먼저 읽어보세요 — 특히
[docs/01-review-of-idea.md](docs/01-review-of-idea.md)(원본 아이디어 `refs/idea.md` 대비
실제 Hermes Agent CLI가 이미 제공하는 기능과 커스텀 구현이 필요한 부분 구분)를 확인하세요.

> **현재 상태 (2026-07-27)**: 설계 문서(`docs/00~10`)와 실행 가능한 Profile 스캐폴드
> (`.hermes/profiles/<role>/{config.yaml, SOUL.md, USER.md, MEMORY.md, skills/}`)까지
> 작성했습니다. `.hermes/`는 `refs/idea.md` 2단계 트리의 `~/.hermes/`를 그대로 저장소 안으로
> 옮겨온 것입니다. **아직 `docker compose build/up`을 실행하거나 실제 챗 스모크 테스트를
> 돌리지 않았습니다** — `docs/10-usecase-tests.md`의 모든 항목은 미검증(⬜) 상태입니다.
> 이 중 6개 역할(coordinator/proposal-agent/budget-vendor-agent/outreach-agent/
> onsite-ops-agent/postevent-analyst)의 역할 분담·SOUL 원칙·SKILL 절차는 자매 프로젝트
> [`HermesMICEAgents`](../HermesMICEAgents)에서 이미 별도로 검증된 내용을 실제 Hermes Agent
> CLI 컨벤션(Profile/SOUL.md/SKILL.md)으로 재구성한 것이고, 나머지 4개 역할
> (registration-agent/exhibition-agent/marketing-agent/finance-settlement-agent)은
> MICE 기획사 실무 관점에서 이 저장소가 신규 설계한 것입니다(등록·전시·모객 마케팅·사후
> 정산은 원래 6개 역할에 없던 기능 영역) — 자세한 대응 관계는
> [docs/01-review-of-idea.md](docs/01-review-of-idea.md) 참고.

## 디렉터리 구조

```
refs/idea.md          원본 설계 아이디어 (보존, 수정하지 않음)
docs/                 설계 문서 세트 (00~10, 09=운영가이드, 10=유스케이스 테스트)
docker-compose.yml    Windows Docker Compose 배포 (docs/08-docker-deployment.md 참고)
Dockerfile            base 이미지 + Playwright/Chromium (proposal-agent/postevent-analyst의 browser 툴셋용)
.hermes/              idea.md 2단계 트리(~/.hermes/)를 그대로 옮긴 실행 가능한 Profile 소스
├── config.yaml       메인 Hermes Agent 설정 (기본 모델 등)
├── .env.example       OPENAI_API_KEY 템플릿 (.env는 커밋 대상 아님)
├── profiles/         각 <role>/{config.yaml, SOUL.md, USER.md, MEMORY.md, skills/*}
└── workspace/        proposals/ budget/ outreach/ registration/ exhibition/ marketing/
                      reports/ finance/ — 산출물 골격만 커밋(.gitkeep)
```

## 로컬 배포 방법

`.hermes/`는 `refs/idea.md`의 `~/.hermes/` 트리와 1:1로 대응하므로, 두 가지 방법으로 실행할 수
있습니다 (자세한 내용은 [docs/03-hermes-agent-integration.md](docs/03-hermes-agent-integration.md)):

**방법 A — `HERMES_HOME`을 이 저장소로 직접 지정** (가장 간단, 개발 중 권장):

```bash
export HERMES_HOME="$(pwd)/.hermes"
hermes -p coordinator chat
```

**방법 B — Docker Compose** (Windows에서 별도 로컬 `hermes` 설치 없이 운영, 권장):

```bash
cp .hermes/.env.example .hermes/.env   # OPENAI_API_KEY 채우기
# 10개 프로필 각각에도 같은 키 복사 — 필수 (top-level .env는 프로필에 상속되지 않음)
for name in coordinator proposal-agent budget-vendor-agent outreach-agent registration-agent exhibition-agent marketing-agent onsite-ops-agent postevent-analyst finance-settlement-agent; do
  grep "^OPENAI_API_KEY=" .hermes/.env > ".hermes/profiles/$name/.env"
done

docker compose build hermes   # Dockerfile 기반: browser 툴셋용 Chromium/Playwright 포함
docker compose up -d
docker compose exec -it hermes hermes -p coordinator chat
```

`e:/work/Hermes/` 아래 다른 형제 Hermes 프로젝트와 포트/컨테이너명이 겹치지 않도록 조사해
구성했습니다(게이트웨이 `8648`, 대시보드 `127.0.0.1:9125`, 컨테이너명 `hermes-triagent-mice*`
— 기존 `HermesMICEAgents`의 `hermes-mice*`/`8642`/`9119`와는 별개입니다). 조사 근거와 운영
명령어 전체는 [docs/08-docker-deployment.md](docs/08-docker-deployment.md), 챗 사용법은
[docs/09-users-guide.md](docs/09-users-guide.md) 참고.

기본 모델은 OpenAI `gpt-5-mini`(`provider: openai-api`, `OPENAI_API_KEY` 환경변수 필요)입니다.

사용 시작은 대화 진입점인 `coordinator` 프로필로 합니다:

```bash
hermes -p coordinator chat
> "2026년 10월 서울에서 참가자 500명 규모 AI 거버넌스 컨퍼런스를 기획해야 해."
```

## 사용 전 체크리스트

- `.hermes/profiles/*/USER.md`의 "(예시)" 표시가 남은 항목을 실제 회사/기획자 정보로 채웠는지 확인
- `hermes tools enable ...`로 각 프로필에 필요한 툴셋을 켰는지 확인
  ([docs/03-hermes-agent-integration.md](docs/03-hermes-agent-integration.md)의 매핑표 참고)
- `hermes gateway setup`으로 Telegram/Slack 등 승인 채널을 실제로 연결했는지 확인
  ([docs/06-hitl-approval-design.md](docs/06-hitl-approval-design.md) 참고)

## 알려진 제약 ([docs/07-roadmap.md](docs/07-roadmap.md), [docs/10-usecase-tests.md](docs/10-usecase-tests.md) 참고)

- Cvent REST API, CRM(HubSpot/Salesforce), Firecrawl, 등록 플랫폼/결제 PG, 광고 플랫폼 API
  전용 연동은 아직 없습니다 — 각 프로필이 웹 리서치·수동 조사 결과만으로 초안까지 작성하고,
  실제 시스템 반영은 수동 처리를 안내합니다.
- HITL 승인 게이트는 총 7개입니다(예산 확정·최초 발송·우회 아젠다 적용·참가자 결제/환불·
  전시 부스 계약·유료 캠페인 집행·사후 정산 확정) — [docs/06-hitl-approval-design.md](docs/06-hitl-approval-design.md)
  참고.
- `coordinator`가 다른 프로필에 작업을 위임하는 실제 메커니즘은 `delegate_task`가 아니라
  `terminal`로 `/opt/hermes/bin/hermes -p <role> chat -q "..."`를 동기 호출하는 방식으로
  **설계 단계에서부터 확정**했습니다(TriAgent_Planner에서 `delegate_task`가 대상 프로필을
  전혀 로드하지 않는 버그를 실측했던 시행착오를 반복하지 않기 위함, `docs/02-architecture.md`
  참고) — 다만 이 저장소에서는 아직 실제로 구동해 검증하지는 않았습니다.
- 모든 유스케이스(`docs/10-usecase-tests.md`)는 아직 미검증(⬜) 상태입니다. `docker compose
  build/up` 및 프로필별 첫 구동은 다음 단계로 남아 있습니다.
