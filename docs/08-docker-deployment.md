# 08. Docker 배포 — 포트/볼륨 조사와 운영 명령어

## 조사 방법론

`e:/work/Hermes/` 아래 모든 형제 프로젝트의 `docker-compose.yml`을 정적으로 스캔하고,
실행 중인 컨테이너를 `docker ps`로 교차 확인했습니다(컴포즈 파일이 없어도 살아있는
컨테이너가 있을 수 있기 때문 — 실제로 `HermesWikiDocSummery`가 이런 경우였습니다).
이 방법론은 `TriAgent_Planner`의 `docs/08-docker-deployment.md`와 동일합니다.

## 조사 시점(2026-07-27) 점유 현황

| 프로젝트 | 호스트 포트 | 컨테이너명 | 볼륨 전략 |
|---|---|---|---|
| HermesPPTAutoAgent | 8000 | (unnamed) | named volume |
| HermesMICEAgents | 8642, 9119 | `hermes-mice`, `hermes-mice-dashboard` | bind mount `./hermes-data` |
| HermesSMBStaff | 8643, 127.0.0.1:9120 | `hermes-smb`, `hermes-smb-dashboard` | bind mount `./hermes-data` |
| HermesIRAgents | (비활성, 주석 처리됨) | `hermes-iragents` | bind mount `./.hermes` |
| HermesWikiDocSummery | 127.0.0.1:9129(실측, 컴포즈 파일 없음) | `hermes-wikidocs`, `hermes-wikidocs-dashboard` | 미확인 |
| HermesContentsMarketingAgent | `network_mode: host`로 8642/9119 직접 점유 + 127.0.0.1:8765 | (unnamed) | bind mount `./hermes-data` |
| HermesLandAssetAgent | 8742, 9219 | `hermes-realestate`, `hermes-policy-db` | bind mount + named volume(Postgres) |
| TriAgent_Planner | 8644, 127.0.0.1:9121 | `hermes-triplanner`, `hermes-triplanner-dashboard` | bind mount `./.hermes` |
| TriAgent_ContentCreator | 8647, 127.0.0.1:9124 | `hermes-contentcreator`, `hermes-contentcreator-dashboard` | bind mount `./.hermes` |

점유된 전체 호스트 포트: `8000, 8642, 8643, 8644, 8647, 8742, 8765, 9119, 9120, 9121, 9124,
9129, 9219` (Hermes 계열 외 non-Hermes 서비스: n8n-lab=4100, supabase_*=54321-54327 — 별도
스택이라 충돌 검토 대상 아님).

## `TriAgent_MICE` 선택 값

- **게이트웨이:** 호스트 `8648` → 컨테이너 `8642`
- **대시보드:** 호스트 `127.0.0.1:9125` → 컨테이너 `9119`
- **컨테이너명:** `hermes-triagent-mice`, `hermes-triagent-mice-dashboard`

> ⚠️ **이름 혼동 주의:** `TriAgent_MICE`는 기존 `HermesMICEAgents`(포트 8642/9119, 컨테이너명
> `hermes-mice*`)와 **이름이 비슷한 완전히 별개의 프로젝트**입니다. 컨테이너명을
> `hermes-mice*`로 짓지 않고 `hermes-triagent-mice*`로 명시적으로 구분한 것은 이 혼동을
> 방지하기 위함입니다. `docker ps`로 두 프로젝트를 동시에 볼 때 컨테이너명으로 구별하세요.

- Compose 프로젝트명: 최상단 `name: hermes-triagent-mice`로 고정(폴더명 기반 기본값 모호성
  방지).
- 볼륨: named volume이 아니라 `./.hermes:/opt/data` bind mount — 데이터가 Docker Desktop의
  내부 VM 디스크가 아니라 이 저장소가 위치한 드라이브(E:)에 남습니다.
- 이미지: base 이미지를 그대로 쓰지 않고 `./Dockerfile`로 빌드 — `proposal-agent`/
  `postevent-analyst`의 `browser` 툴셋(Playwright/Chromium)을 이미지 레이어에 포함해
  컨테이너를 재생성해도 유지되게 합니다. base 이미지가 갱신되면 `docker compose build
  hermes`로 재빌드가 필요합니다. `dashboard`는 browser를 쓰지 않으므로 base 이미지를 그대로
  사용합니다.

## 운영 명령어

```bash
# 최초 배포 (10개 프로필 전체)
cp .hermes/.env.example .hermes/.env   # OPENAI_API_KEY 채우기
for name in coordinator proposal-agent budget-vendor-agent outreach-agent registration-agent exhibition-agent marketing-agent onsite-ops-agent postevent-analyst finance-settlement-agent; do
  grep "^OPENAI_API_KEY=" .hermes/.env > ".hermes/profiles/$name/.env"
done

docker compose build hermes
docker compose up -d
docker compose ps
docker compose exec hermes hermes doctor

# 챗
docker compose exec hermes hermes chat --profile coordinator -q "..."
docker compose exec -it hermes hermes chat --profile coordinator

# 중지
docker compose down
```

## 검증 완료 / 아직 검증하지 않은 것

- ✅ 포트·컨테이너명이 다른 형제 프로젝트와 겹치지 않음을 정적 스캔 + `docker ps` 교차
  확인으로 검증했습니다.
- ⬜ 이 저장소에서 실제 `docker compose build`/`up`을 실행하지는 않았습니다 — 다음 단계로
  남아 있습니다([07-roadmap.md](07-roadmap.md) 5·6번).
