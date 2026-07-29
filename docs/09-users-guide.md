# 09. 사용자 가이드 — 운영 및 트러블슈팅

> 이 문서는 `docker compose build/up`을 아직 실행하지 않은 상태에서 설계 단계에 작성됐습니다.
> 실제로 배포해 관찰한 내용이 아니라 `TriAgent_Planner`/`HermesMICEAgents`에서 검증된 내용을
> 바탕으로 한 예상 절차입니다 — 실행 후 실측 결과로 갱신해야 합니다.

## 0. 사전 준비

- Docker Desktop이 실행 중이어야 한다.
- `.hermes/.env`(`OPENAI_API_KEY`)와 10개 `.hermes/profiles/<role>/.env`가 채워져 있어야 한다
  — top-level `.env`는 프로필에 상속되지 않는다.
- `.hermes/profiles/*/USER.md`의 "(예시)" 표시를 실제 회사/기획자 정보로 교체했는지 확인한다.

## 1. 최초 배포

```bash
cp .hermes/.env.example .hermes/.env
# OPENAI_API_KEY= 채우기
for name in coordinator proposal-agent budget-vendor-agent outreach-agent registration-agent exhibition-agent marketing-agent onsite-ops-agent postevent-analyst finance-settlement-agent; do
  grep "^OPENAI_API_KEY=" .hermes/.env > ".hermes/profiles/$name/.env"
done
docker compose build hermes
docker compose up -d
```

## 2. 정상 동작 확인

```bash
docker compose ps                       # hermes, dashboard 두 컨테이너가 Up 상태인지
docker compose exec hermes hermes doctor  # "Profiles" 섹션에 10개 모두 떠야 정상
```

## 3. 프로필별 대화 진입점

프로필 이름은 10개 중 하나: `coordinator` / `proposal-agent` / `budget-vendor-agent` /
`outreach-agent` / `registration-agent` / `exhibition-agent` / `marketing-agent` /
`onsite-ops-agent` / `postevent-analyst` / `finance-settlement-agent`

```bash
# 한 번 질문하고 답만 받기 (스크립트/자동화, 로그 남기기 좋음)
docker compose exec hermes hermes chat --profile proposal-agent -q "요청 내용"

# 대화형 세션 (자신의 실제 터미널에서 -it 필요)
docker compose exec -it hermes hermes chat --profile coordinator
```

## 4. `-p` 없이 실행하면?

`-p`/`--profile`을 지정하지 않으면 top-level `.hermes/config.yaml`의 기본 모델로 프로필 없이
동작합니다 — 이 경우 10개 역할의 SOUL.md/USER.md/MEMORY.md/skills가 전혀 로드되지 않으므로,
반드시 `--profile <role>`을 명시해야 합니다.

## 5. 흔한 함정

**함정 1 — top-level `.env`만 채우고 프로필별 `.env`를 빠뜨림**
목적: `OPENAI_API_KEY`를 한 번만 설정하면 될 것 같지만, 프로필은 격리된 홈 디렉터리를 쓴다.
실행 방법: `.hermes/.env`만 채우고 `docker compose exec hermes hermes chat --profile
proposal-agent -q "..."` 실행.
결과: 인증 오류로 실패할 수 있다.
조치: 1절의 `for name in ...` 루프로 10개 프로필 모두에 키를 복사한다.

**함정 2 — `delegate_task`로 위임을 시도**
목적: `coordinator`가 하위 프로필에 작업을 넘기려 함.
실행 방법: `delegate_task` 툴 사용.
결과: 대상 프로필의 SOUL/USER/MEMORY/skills가 로드되지 않은 채 범용 서브에이전트가 응답한다
(`TriAgent_Planner`에서 실측 확인된 버그).
조치: `terminal(command='/opt/hermes/bin/hermes -p <role> chat -q "..."')` 동기 호출로
대체한다([02-architecture.md](02-architecture.md)).

**함정 3 — `outreach-agent`가 승인 없이 발송을 시도하는지 안 시켜봄**
목적: HITL 게이트가 실제로 걸리는지 확인.
실행 방법: `docs/10-usecase-tests.md`의 승인 게이트 테스트 프롬프트로 직접 검증.
결과: (아직 실측 전)
조치: 배포 후 반드시 "승인 없이 지금 보내줘" 류의 프롬프트로 게이트가 걸리는지 확인한다.

## 6. 관리 명령어 요약

| 목적 | 명령어 |
|---|---|
| 컨테이너 기동 | `docker compose up -d` |
| 상태 확인 | `docker compose ps` |
| 헬스체크 | `docker compose exec hermes hermes doctor` |
| 재빌드(이미지 갱신 시) | `docker compose build hermes` |
| 중지 | `docker compose down` |
| 로그 확인 | `docker compose logs -f hermes` |

## 7. 트러블슈팅 빠른 참고

| 증상 | 원인 | 해결 |
|---|---|---|
| `hermes doctor`에서 프로필이 10개 미만으로 표시 | `.hermes/profiles/` 마운트 경로 오류 또는 프로필 디렉터리 누락 | `docker-compose.yml`의 `./.hermes:/opt/data` bind mount 경로 확인 |
| 챗 응답이 역할과 무관하게 일반적 | `--profile` 플래그 누락 | 4절 참고, 반드시 `--profile <role>` 지정 |
| 인증 오류 | 프로필별 `.env`에 `OPENAI_API_KEY` 없음 | 함정 1 참고 |
| 위임한 하위 프로필이 응답하지 않음 | `delegate_task` 사용 | 함정 2 참고 |
| 포트 충돌로 컨테이너 기동 실패 | 다른 형제 프로젝트와 포트 겹침 | [08-docker-deployment.md](08-docker-deployment.md) 점유 현황 재확인, `docker ps`로 실측 |
