# 03. Hermes Agent CLI 연동 — 프로필 생성과 툴셋 매핑

## 프로필 생성/배포 방법

세 가지 방법이 있습니다 (자세한 실행 절차는 [README.md](../README.md)와
[09-users-guide.md](09-users-guide.md) 참고):

**A. `HERMES_HOME`을 이 저장소로 직접 지정** (개발 중 권장)

```bash
export HERMES_HOME="$(pwd)/.hermes"
hermes -p coordinator chat
```

**B. 실제 `~/.hermes`로 복사** (기존 `~/.hermes` 설정을 건드리지 않고 배포하고 싶을 때)

```bash
for name in coordinator proposal-agent budget-vendor-agent outreach-agent registration-agent exhibition-agent marketing-agent onsite-ops-agent postevent-analyst finance-settlement-agent; do
  mkdir -p "$HERMES_HOME/profiles/$name/skills"
  cp ".hermes/profiles/$name/config.yaml" "$HERMES_HOME/profiles/$name/config.yaml"
  cp ".hermes/profiles/$name/SOUL.md" "$HERMES_HOME/profiles/$name/SOUL.md"
  cp ".hermes/profiles/$name/USER.md" "$HERMES_HOME/profiles/$name/USER.md"
  cp ".hermes/profiles/$name/MEMORY.md" "$HERMES_HOME/profiles/$name/MEMORY.md"
  cp -r ".hermes/profiles/$name/skills/." "$HERMES_HOME/profiles/$name/skills/"
done
cp ".hermes/config.yaml" "$HERMES_HOME/config.yaml"
```

**C. Docker Compose** (Windows에서 별도 로컬 `hermes` 설치 없이 운영, 권장 —
[08-docker-deployment.md](08-docker-deployment.md) 참고)

각 방법 모두 실제 Hermes CLI(`hermes profile create <name>`으로 프로필 생성 후 생성된
디렉터리를 이 저장소의 파일로 덮어쓰는 방식도 가능)와 호환됩니다.

## 프로필별 필요 툴셋

각 프로필에는 역할에 필요한 툴셋만 켭니다(`hermes tools enable <toolset> --profile <role>`).
"이미 있음" 항목은 [01-review-of-idea.md](01-review-of-idea.md)에서 확인한 Hermes 내장
기능입니다.

| 프로필 | 필요 툴셋 | 이유 |
|---|---|---|
| `coordinator` | `terminal`, `kanban`, `clarify`, `messaging`, `file`(읽기 전용 용도) | 하위 프로필 위임(terminal), 진행 트래킹(kanban), HITL 승인 대화(clarify/messaging), Active Verification(file). **`delegation`/`delegate_task`는 켜지 않습니다** — [02장](02-architecture.md) 참고 |
| `proposal-agent` | `web`, `search`, `browser`, `file` | RFP 분석, 타깃/현지 리서치, 제안서·아젠다 마크다운 작성 |
| `budget-vendor-agent` | `web`, `search`, `code_execution`, `file` | 벤더 견적 조사, 비교 시트/예산안 생성(샌드박스 파이썬으로 표 생성) |
| `outreach-agent` | `web`, `search`, `file` | 타깃 스카우팅, 메일 초안 작성(발송은 승인 후 `coordinator` 경유 — 이 프로필 자체는 `messaging` 미부여) |
| `onsite-ops-agent` | `messaging`, `terminal`, `file` | 현장 메신저 알림, 통신/장비 상태 재확인(ping 등), 상황 보고 기록 |
| `postevent-analyst` | `web`, `search`, `code_execution`, `file` | SNS 피드백 수집, NLP 감성분석(샌드박스 파이썬), 보고서 작성 |
| `registration-agent` | `web`, `code_execution`, `file` | 등록 데이터 집계, 참가자 DB 관리, 결제 상태 확인(발송은 `messaging` 없이 파일 산출물로만) |
| `exhibition-agent` | `web`, `search`, `code_execution`, `file` | 부스 배치도 좌표 계산, 전시업체 조사, 계약 현황 시트 |
| `marketing-agent` | `web`, `search`, `code_execution`, `file` | 타깃 분석, 홍보 콘텐츠 작성, 캠페인 성과 집계 |
| `finance-settlement-agent` | `web`, `code_execution`, `file` | 정산 계산, 예산 대비 실제 집행 대조 |

## 게이트웨이 설정

```bash
hermes gateway setup     # Telegram/Slack 등 채널 연결
hermes gateway run       # 게이트웨이 데몬 실행 (docker-compose.yml의 hermes 서비스가 이미 실행)
```

`coordinator`의 HITL 승인 알림은 이 게이트웨이를 통해 발송됩니다 —
[06-hitl-approval-design.md](06-hitl-approval-design.md) 참고.

## idea.md 기억 구조 → 실제 Hermes 경로 매핑

| `refs/idea.md`의 개념 | 실제 Hermes Agent 경로 |
|---|---|
| Profile (USER.md/SOUL.md) | `profiles/<role>/USER.md`, `profiles/<role>/SOUL.md` |
| Memory (MEMORY.md) | `profiles/<role>/MEMORY.md` (Hermes 네이티브, 에이전트가 자동 관리) |
| Skill (skills/) | `profiles/<role>/skills/<category>/<skill-name>/SKILL.md` |
| Workspace | `workspace/{proposals,budget,outreach,reports}/<event-name>/` — Hermes 표준 경로는 아니며, 프로젝트 관례로 SOUL.md/SKILL.md에서 상대경로로 지시 |
| Config | `config.yaml`(top-level 모델 기본값) + `profiles/<role>/config.yaml`(프로필별 오버라이드) |

top-level `.env`는 프로필에 상속되지 않으므로, 각 `profiles/<role>/.env`에도 반드시
`OPENAI_API_KEY`를 복사해야 합니다(README.md 배포 스크립트에 이미 반영).
