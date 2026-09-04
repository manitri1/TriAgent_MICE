# 13. VPS Docker 운영 + Discord 연동 + VSCode 개발 루프 — 범용 마이그레이션 플레이북

이 문서는 **TriAgent_MICE를 구체적 사례로 삼아**, "로컬에서 개발한 챗봇/에이전트 앱을 VPS에서
Docker로 상시 운영하고, 메시징 플랫폼(Discord 등)에 연동하고, 이후에도 VSCode로 계속
개발한다"는 마이그레이션을 다른 유사 앱에도 재사용할 수 있도록 정리한 것입니다.

- VPS 최초 프로비저닝의 더 상세한 단계별 설명은 [12장](12-hostinger-vps-deployment.md)을,
  포트/컨테이너명 설계 근거는 [08장](08-docker-deployment.md)을 참고하세요. 이 문서는 그
  내용을 요약하고, **Discord 연동 복구/설정**과 **VSCode 개발 워크플로우**라는 두 개의 새
  섹션을 더해 하나의 엔드투엔드 플레이북으로 묶습니다.
- 각 단계는 **일반 원칙**(다른 앱에도 그대로 적용되는 부분)과 **이 앱 구체적 절차**(TriAgent_MICE
  기준 실제 명령어)로 나눠 씁니다. 다른 앱에 적용할 때는 일반 원칙만 남기고 구체적 절차 부분만
  자신의 앱에 맞게 바꾸면 됩니다.

## 표기 규칙 — 어느 터미널에서 실행하는가

이 문서의 모든 명령어 블록 위에는 아래 세 가지 중 하나의 라벨을 붙입니다. 같은 단계 안에서도
터미널이 바뀌는 지점(로컬에서 push 후 VPS로 넘어가는 등)이 자주 있으니 라벨을 꼭 확인하세요.

| 라벨 | 의미 | 이 앱에서의 예 |
|---|---|---|
| 🖥️ 로컬 | Windows의 VSCode 통합 터미널 또는 Git Bash/PowerShell | `e:\work\Hermes\TriAgent_MICE`에서 편집·git 작업·로컬 테스트 |
| 🌐 VPS SSH 세션 | `ssh root@<VPS_IP>`로 접속한 뒤의 셸 | VPS 호스트에서 `git pull`, `docker compose` 실행 |
| 📦 컨테이너 내부 | VPS SSH 세션에서 `docker compose exec ...`로 들어간 컨테이너 셸(또는 그 앞에 붙는 exec 명령 자체) | `hermes gateway setup`, `hermes doctor` |

## 0. 개요 — 다른 앱에 적용하기 위한 변수표

다른 유사 앱(예: 다른 Hermes Agent 프로필 세트, 또는 완전히 다른 챗봇/에이전트 프레임워크)에
이 플레이북을 적용할 때 바뀌는 값은 아래 정도입니다. 나머지 절차(SSH 준비, 방화벽, git 배포
루프)는 거의 그대로 재사용됩니다.

| 항목 | 이 앱(TriAgent_MICE)의 값 | 다른 앱에서 확인할 것 |
|---|---|---|
| 베이스 이미지 | `nousresearch/hermes-agent:latest` | 앱이 쓰는 공식/커스텀 베이스 이미지 |
| 게이트웨이 포트 (호스트:컨테이너) | `8648:8642` | 형제 프로젝트와 충돌하지 않는 호스트 포트 |
| 대시보드/관리 UI 포트 | `127.0.0.1:9125:9119` | 관리 UI가 있는지, 외부 노출이 필요한지 |
| 런타임 상태 디렉터리 | `.hermes/` (`HERMES_HOME`, bind mount `/opt/data`) | 앱의 상태/DB/캐시가 어느 디렉터리에 모이는지 |
| 컨테이너 이관 방식 | 로컬 컨테이너를 옮기지 않고 VPS에서 새로 build/up (상태는 위 bind mount로만 이관) | 앱의 상태가 컨테이너 밖에 있는지 — 없다면 이관 전 상태 저장 방식부터 설계 필요 |
| 시작 커맨드 | `["gateway", "run"]` | 앱의 상시 실행 진입점 |
| 메시징 플랫폼 | Discord (`DISCORD_BOT_TOKEN`) | Slack/Telegram/WhatsApp 등, 토큰 발급 방식 |
| 프로필/멀티 인스턴스 여부 | 10개 profile, 각각 별도 `.env` 필요 | 앱이 단일 프로세스인지 다중 역할 구조인지 |

## 1단계 — 로컬 저장소 점검 (사전 준비)

**일반 원칙**: 배포 전에 "git으로 추적되는 코드/설정"과 "git에 올리면 안 되는 런타임 상태(비밀키,
DB, 캐시)"를 명확히 분리해 둡니다. 이 분리가 이후 모든 단계(clone은 코드만, rsync는 상태만)의
전제가 됩니다.

**이 앱 구체적으로**:

| 추적 대상(git) | 제외 대상(.gitignore) |
|---|---|
| `.hermes/config.yaml`, `profiles/<role>/{config.yaml, SOUL.md, USER.md, MEMORY.md, skills/}`, `.hermes/.env.example`, `Dockerfile`, `docker-compose.yml` | `.hermes/.env`, `profiles/<role>/.env`, `state.db`, `kanban.db`/`projects.db`, `workspace/` 산출물, `gateway.pid`/`gateway.lock`, 각종 캐시 JSON |

```bash
# 🖥️ 로컬
git status              # 커밋 대상에 .env·state.db 등이 섞이지 않았는지 확인
cat .gitignore | grep -E "\.env$|state\.db|workspace"
```

## 2단계 — VPS 프로비저닝 (Hostinger hPanel)

**일반 원칙**: 어떤 VPS 업체를 쓰든 필요한 것은 동일합니다 — SSH 접근, Docker 런타임, 앱이
요구하는 최소 CPU/RAM/디스크, 인바운드 방화벽 최소화(대부분의 챗봇은 아웃바운드 연결만
필요하므로 SSH 포트 외에는 열 필요가 없음).

**이 앱 구체적으로** ([12장](12-hostinger-vps-deployment.md) 1~4단계 요약):

1. hPanel → VPS → Manage → OS & Panel → Operating System에서 **Docker 템플릿(Ubuntu 24.04 +
   Docker 사전 설치)** 적용 여부 확인. Playwright/Chromium 빌드를 감안해 **RAM 2GB 이상**, 디스크
   10GB 이상 권장.

   ```bash
   # 🖥️ 로컬 (Git Bash) — SSH 키가 없으면 생성
   ssh-keygen -t ed25519 -C "hermes-triagent-mice"
   ```

   생성한 공개키를 hPanel **Advanced → SSH**에 등록한 뒤:

   ```bash
   # 🖥️ 로컬
   ssh root@<VPS_IP>
   ```

   ```bash
   # 🌐 VPS SSH 세션
   apt update && apt upgrade -y
   docker --version
   docker compose version
   ```

2. hPanel **Security → Firewall**: 인바운드 **22(SSH)만 허용**. 게이트웨이(8648)와 대시보드(9119)는
   아웃바운드 전용/로컬 전용 구조라 인바운드를 열 필요가 없습니다.

## 3단계 — 최초 배포 및 실행 검증

**일반 원칙**: 코드는 `git clone`으로, 런타임 상태는 `rsync`로 별도 이관합니다. 이 저장소는
`docker compose build/up`이 한 번도 실행·검증된 적이 없으므로(README에 명시), 최초 배포 시
빌드 로그·재시작 루프·포트 충돌 여부를 반드시 확인합니다.

> 🆕 **컨테이너는 로컬 것을 옮기는 게 아니라 VPS에서 완전히 새로 만듭니다.** Docker에서
> 컨테이너는 언제든 버리고 다시 만들 수 있는 "일회용"으로 취급하고, 실제로 보존해야 하는 상태는
> 컨테이너 밖(호스트의 bind mount/volume)에 둡니다. 이 앱은 `docker-compose.yml`의
> `volumes: ./.hermes:/opt/data`가 그 역할을 합니다 — 대화 기록(`state.db`)·메모리·
> `workspace/` 산출물이 전부 컨테이너가 아니라 이 폴더에 있으므로, VPS에서 `docker compose
> build`로 이미지를 새로 굽고 `up -d`로 컨테이너를 새로 띄워도 4단계에서 `rsync`로 옮겨 둔
> `.hermes/`가 그대로 마운트되어 데이터는 유지됩니다. 로컬 컨테이너는 (Discord 토큰 충돌
> 방지를 위해) `docker compose down`으로 **정지만** 하면 되고, 삭제하거나 이미지를 지울
> 필요는 없습니다 — 나중에 로컬에서 다시 개발/테스트할 때 그대로 재사용합니다. 다른 앱에
> 적용할 때도 "상태가 컨테이너 밖 어디에 있는가"만 확인하면 이 원칙은 그대로 적용됩니다.

**이 앱 구체적으로** ([12장](12-hostinger-vps-deployment.md) 5~10단계 요약):

```bash
# 🖥️ 로컬 — 이관 전 로컬 인스턴스 정지 (동일 Discord 토큰 동시 연결 충돌 방지)
docker compose down
```

```bash
# 🌐 VPS SSH 세션 — 코드 clone (public repo라 별도 인증 불필요)
git clone https://github.com/manitri1/TriAgent_MICE.git /opt/hermes-triagent-mice
```

```bash
# 🖥️ 로컬 (Git Bash) — 런타임 데이터 이관 (.env, state.db, workspace/ 등 ~182MB)
rsync -avz --delete \
  ./.hermes/ root@<VPS_IP>:/opt/hermes-triagent-mice/.hermes/
```

```bash
# 🌐 VPS SSH 세션 — 권한 정리
chmod 600 /opt/hermes-triagent-mice/.hermes/.env
chmod 600 /opt/hermes-triagent-mice/.hermes/profiles/*/.env
```

```bash
# 🌐 VPS SSH 세션 — 빌드 및 기동
cd /opt/hermes-triagent-mice
docker compose build   # Dockerfile의 chromium/playwright 설치로 수 분 소요
docker compose up -d
docker compose ps      # hermes, dashboard 둘 다 Up 상태인지 확인
```

**최초 배포 검증 체크리스트 (신규 — 이 저장소는 build/up 미검증 상태였으므로 특히 주의)**:

```bash
# 🌐 VPS SSH 세션
docker compose logs -f hermes      # 빌드/기동 에러, 재시작 루프(Restarting) 여부 확인
docker compose ps                  # STATUS가 계속 "Restarting"이면 volume 권한/포트 충돌 의심
docker compose exec hermes ls -la /opt/data   # bind mount(.hermes/)가 제대로 보이는지 확인
```

- `Restarting` 반복 → `docker compose logs hermes`에서 스택트레이스 확인 (권한 문제면 7단계
  `chmod` 재확인, 포트 충돌이면 `docker-compose.yml`의 `8648`/`9125`를 다른 값으로 변경).
- 볼륨 마운트 문제 → `docker compose exec hermes cat /opt/data/config.yaml`로 파일이 실제로
  보이는지 확인.

## 4단계 — Discord 연동 설정/복구 (신규)

**일반 원칙**: Discord/Slack/Telegram 같은 봇 플랫폼은 대부분 **아웃바운드 연결만** 필요하므로
서버 방화벽에 인바운드 포트를 열 필요가 없습니다. 봇 토큰은 코드가 아니라 컨테이너별 `.env`
(또는 시크릿 매니저)로 주입하고, 멀티 프로필/멀티 프로세스 구조라면 각 프로세스에 토큰을
개별 배포해야 하는지 확인합니다.

**이 앱 구체적으로**:

현재 `.hermes/gateway_state.json`에는 Discord 플랫폼이 `"state": "retrying", "error_message":
"failed to reconnect"`로 기록되어 있습니다 — 과거에 한 번 설정되었지만 지금은 재연결에
실패한 상태입니다. 아래 순서로 설정/복구합니다.

1. **Discord 봇 준비**: [Discord Developer Portal](https://discord.com/developers/applications)에서
   봇 토큰을 확인/재발급하고(Bot → Reset Token), **Message Content Intent**를 반드시 켭니다
   (꺼져 있으면 봇이 메시지를 받고도 무시하는 대표적 원인).

2. **토큰 배포** — `.hermes/.env.example` 기준, 루트 `.env`는 프로필에 자동 상속되지 않으므로
   필요한 각 `profiles/<role>/.env`에도 동일 키를 복사해야 합니다.

   ```bash
   # 🌐 VPS SSH 세션 (또는 🖥️ 로컬에서 채운 뒤 3단계 rsync로 전송해도 됨)
   vi /opt/hermes-triagent-mice/.hermes/.env
   # DISCORD_BOT_TOKEN=<발급받은 토큰> 입력
   ```

3. **게이트웨이 재설정**:

   ```bash
   # 📦 컨테이너 내부 (VPS SSH 세션에서 실행)
   docker compose exec hermes hermes gateway setup
   ```

4. **연결 상태 확인**:

   ```bash
   # 🌐 VPS SSH 세션
   cat .hermes/gateway_state.json | grep -A3 discord
   cat .hermes/channel_directory.json
   docker compose logs -f hermes | grep -i discord
   ```

5. **"retrying/failed to reconnect" 진단 순서** (현재 이 앱이 처한 상태에 대한 구체적 체크리스트):
   1. 토큰 유효성 — Developer Portal에서 토큰이 최근에 재발급/만료되지 않았는지 확인
   2. **Message Content Intent**가 켜져 있는지 재확인 (가장 흔한 원인)
   3. 컨테이너의 아웃바운드 네트워크 — `docker compose exec hermes curl -sI https://discord.com`으로
      외부 연결 자체가 되는지 확인
   4. `docker compose logs -f hermes`에서 구체적 에러 메시지(401=토큰 오류, 4014=Intent 누락 등)
      확인
   5. 위 조치 후 `hermes gateway setup`을 다시 실행

6. **로컬과 VPS 동시 기동 금지**: 같은 `DISCORD_BOT_TOKEN`으로 로컬과 VPS 게이트웨이가 동시에
   뜨면 채널 연결이 충돌합니다. VPS를 운영 중이면 로컬에서는 게이트웨이를 켜지 마세요(5단계
   참고).

## 5단계 — VSCode 로컬 개발 + Git 배포 루프 (신규)

**일반 원칙**: 운영 중인 VPS 컨테이너 안의 파일을 직접 수정하지 않습니다. 모든 변경은
"로컬에서 편집·테스트 → git commit/push → VPS에서 git pull·재기동" 순서로만 전파합니다. 이렇게
하면 운영 환경이 항상 git 이력과 일치하고, 문제가 생기면 git으로 되돌릴 수 있습니다.

**이 앱 구체적 워크플로우**:

1. **로컬 개발 환경**: VSCode로 `e:\work\Hermes\TriAgent_MICE`를 엽니다. Profile(`SOUL.md`,
   `USER.md`, `skills/`), `Dockerfile`, `docker-compose.yml`을 편집합니다. 권장 확장: Docker,
   YAML, Markdown lint 정도면 충분합니다(이 저장소엔 별도 언어 런타임 코드가 없습니다).

2. **로컬 테스트** — 두 가지 방법이 있습니다(README "로컬 배포 방법" 참고):

   ```bash
   # 🖥️ 로컬 — 방법 A: HERMES_HOME을 직접 지정해 개별 프로필만 빠르게 테스트
   export HERMES_HOME="$(pwd)/.hermes"
   hermes -p coordinator chat
   ```

   ```bash
   # 🖥️ 로컬 — 방법 B: Docker Compose로 컨테이너 그대로 재현
   docker compose build hermes
   docker compose up -d
   docker compose exec -it hermes hermes -p coordinator chat
   ```

   > ⚠️ 로컬에서 게이트웨이(`gateway run`)까지 켜면 VPS와 같은 `DISCORD_BOT_TOKEN`이 동시에
   > 연결을 시도해 충돌합니다. 로컬 테스트는 위처럼 `hermes -p <role> chat`으로 개별 프로필만
   > 직접 호출하고, 게이트웨이/Discord 연동 테스트가 꼭 필요하면 별도의 개발용 봇 토큰을 로컬
   > `.env`에 따로 채워 쓰세요.

3. **커밋 전 확인**:

   ```bash
   # 🖥️ 로컬
   git status   # .env, state.db, workspace/ 산출물 등이 스테이징되지 않았는지 확인
   git add <바뀐 profile/설정 파일>
   git commit -m "..."
   git push
   ```

4. **VPS 반영**:

   ```bash
   # 🌐 VPS SSH 세션
   cd /opt/hermes-triagent-mice
   git pull
   docker compose build
   docker compose up -d
   docker compose logs -f hermes   # 정상 기동 확인
   ```

   런타임 데이터(`state.db`, `workspace/` 등)는 `.hermes/` bind mount에 남아 있으므로 배포로
   지워지지 않습니다.

5. **(선택) 배포 스크립트**: 4번 단계를 매번 손으로 치기 번거로우면 VPS에 짧은 스크립트를 하나
   둘 수 있습니다.

   ```bash
   # 🌐 VPS SSH 세션 — /opt/hermes-triagent-mice/deploy.sh (선택 사항, 아직 없음)
   #!/bin/bash
   set -e
   cd /opt/hermes-triagent-mice
   git pull
   docker compose build
   docker compose up -d
   docker compose ps
   ```

6. **롤백**: 배포 후 문제가 생기면 이전 커밋으로 되돌리고 다시 배포합니다.

   ```bash
   # 🖥️ 로컬 — 되돌릴 커밋 확인 후
   git revert <문제_커밋_SHA>
   git push
   ```

   ```bash
   # 🌐 VPS SSH 세션
   git pull
   docker compose build && docker compose up -d
   ```

7. **(선택) VSCode Remote-SSH는 "관찰 전용"으로만**: VPS의 로그나 `gateway_state.json`을 VSCode
   에디터로 바로 열어보고 싶다면 Remote-SSH 확장으로 접속할 수 있습니다. 단, 이 창에서 운영
   중인 파일을 **직접 편집하지 않는다**는 원칙을 지키세요 — 편집은 항상 로컬 저장소에서 하고
   git으로 전파합니다. 그렇지 않으면 VPS 상태와 git 이력이 어긋나기 시작합니다.

## 6단계 — 운영 유지보수

**일반 원칙**: 정기 백업, 업데이트 절차, 최소한의 모니터링(로그/헬스체크)을 정해 둡니다.

**이 앱 구체적으로** ([12장](12-hostinger-vps-deployment.md) 10~12단계 요약):

```bash
# 🖥️ 로컬 — 대시보드 접근 (SSH 로컬 포트포워딩, 필요할 때만)
ssh -L 9125:127.0.0.1:9125 root@<VPS_IP>
# 터널이 연결된 동안 브라우저에서 http://127.0.0.1:9125 접속
# (HERMES_DASHBOARD_BASIC_AUTH_USERNAME/PASSWORD로 로그인)
```

```bash
# 🌐 VPS SSH 세션 — 재부팅 후 자동 복구 확인
reboot
# 재접속 후
docker compose ps   # 두 서비스 모두 Up 이어야 함 (restart: unless-stopped 설정됨)
```

- **백업**: `.hermes/`(특히 `state.db`, `workspace/`, `kanban.db`/`projects.db`)를 hPanel VPS
  스냅샷 또는 cron `rsync`로 정기 백업합니다.
- **업데이트**: 5단계의 git 배포 루프를 그대로 사용합니다.
- **모니터링**: `docker compose logs`와 `.hermes/gateway_state.json`을 주기적으로 확인하는
  정도로 시작하고, 필요해지면 Uptime Kuma 등 별도 모니터링 도구를 추가로 검토합니다.
- **CI/CD**: 현재 이 저장소에는 CI/CD가 없습니다(`.github/workflows/` 없음). 팀 규모가 커지면
  "push 시 `docker build`만 검증하는" 가벼운 GitHub Actions 워크플로우를 추가하는 것을 향후
  개선 과제로 고려할 수 있습니다(필수 아님).

## 부록 — 다른 유사 앱에 적용하기 위한 체크리스트

| 단계 | 이 앱(TriAgent_MICE)에서 한 일 | 다른 앱에서 확인할 것 |
|---|---|---|
| 사전 준비 | 코드(git)와 런타임 상태(`.hermes/`, gitignore)를 분리 | 앱의 상태/비밀키가 코드와 분리돼 있는가 |
| VPS 프로비저닝 | Hostinger hPanel Docker 템플릿, SSH 키 등록, 인바운드는 22만 허용 | VPS 업체 무관하게 동일하게 적용 가능 |
| 최초 배포 | `git clone` + `rsync`로 상태 이관 + `docker compose build/up` | 앱의 상태 이관 방식(rsync/DB 덤프/S3 등) |
| 실행 검증 | 재시작 루프/볼륨 권한/포트 충돌 체크리스트 | build/up이 처음이라면 반드시 이 체크리스트로 검증 |
| 메시징 연동 | Discord 봇 토큰 + `hermes gateway setup`, Message Content Intent | 플랫폼별 토큰 발급/필수 설정값이 다름 |
| 개발 워크플로우 | 로컬 VSCode 개발 → git push → VPS git pull + rebuild | 운영 컨테이너 직접 수정 금지 원칙은 항상 동일 |
| 운영 유지보수 | SSH 터널 대시보드, 재부팅 테스트, 정기 백업 | 앱마다 관리 UI 유무·백업 대상 디렉터리만 다름 |
