# 12. Hostinger VPS(hPanel) 배포 — 로컬 Windows에서 상시 운영 서버로 이관

로컬 Windows 개발 머신(`e:/work/Hermes/TriAgent_MICE`)에서 검증해 온 인스턴스를
**Hostinger VPS**(hPanel, `hpanel.hostinger.com/vps/<VPS_ID>`)로 옮겨 Docker로 상시
운영하기 위한 절차입니다. [08장](08-docker-deployment.md)에서 만든 `Dockerfile` /
`docker-compose.yml`을 그대로 재사용하며, 새 코드를 작성하지 않습니다.

> 이 저장소는 자체 애플리케이션 코드가 아니라 Nous Research의 사전 빌드 이미지
> `nousresearch/hermes-agent:latest` 위에 10개 Profile을 얹은 설정/데이터 레포입니다
> ([03장](03-hermes-agent-integration.md)). VPS에서도 마찬가지로 이 이미지를 그대로
> 가져와 쓰고, `Dockerfile`은 `proposal-agent`/`postevent-analyst`의 browser 툴셋
> (Playwright/Chromium)을 이미지 레이어에 굽는 용도로만 사용합니다.

## 전제 조건

- GitHub 저장소가 **public**입니다(`github.com/manitri1/TriAgent_MICE`) — VPS에서
  `git clone` 시 별도 인증이 필요 없습니다. git으로 추적되는 실제 용량은 ~68KB +
  `profiles/coordinator/bin/tirith` 바이너리(~22MB) 뿐입니다.
- `.hermes/`의 실제 런타임 데이터(대화 기록 `state.db`, 메모리, `workspace/` 산출물,
  `kanban.db`/`projects.db`, 각 Profile의 `.env` 등)는 `.gitignore`로 제외되어 있어
  **git clone만으로는 이관되지 않습니다.** 별도로 `rsync`가 필요합니다(아래 4단계).
- 대시보드는 도메인 없이 **SSH 로컬 포트포워딩으로만** 접근하는 것을 전제로 합니다.
  공개 도메인/HTTPS가 필요해지면 Caddy/Nginx 리버스 프록시를 별도로 추가해야 합니다.

## 1. VPS 준비 (hPanel)

hPanel → VPS → **Manage → OS & Panel → Operating System**에서 "Docker" 템플릿
(Ubuntu 24.04 + Docker 사전 설치)이 적용돼 있는지 확인합니다. 재설치가 필요하면 약
10분이 걸리고 기존 데이터가 초기화되므로 신중히 진행합니다.

Playwright/Chromium을 포함해 빌드하므로 **RAM 2GB 이상**을 권장하고, 디스크는
이미지 + 런타임 데이터를 감안해 여유(10GB+)를 둡니다(로컬 `.hermes/` 기준 현재
182MB).

## 2. SSH 접속

```bash
# 로컬(Git Bash)에서 키가 없으면 생성
ssh-keygen -t ed25519 -C "hermes-triagent-mice"
```

생성한 공개키를 hPanel **Advanced → SSH**에 등록한 뒤 접속을 확인합니다.

```bash
ssh root@<VPS_IP>
apt update && apt upgrade -y
```

## 3. Docker 설치 확인

Docker 템플릿을 썼다면 이미 설치돼 있으므로 버전만 확인합니다.

```bash
docker --version
docker compose version
```

템플릿을 쓰지 않았다면 공식 절차로 수동 설치합니다(Docker GPG 키 등록 → apt 저장소
추가 → `docker-ce docker-ce-cli containerd.io` 설치 → `systemctl enable docker`).

## 4. 방화벽 (hPanel Security → Firewall)

- 인바운드로 **22(SSH)** 만 허용합니다.
- 게이트웨이(호스트 8648)는 Discord 등으로 **아웃바운드** 연결하는 구조라 인바운드를
  열 필요가 없습니다.
- 대시보드(호스트 9119)도 외부에 노출하지 않고, `docker-compose.yml`의 기존
  `127.0.0.1:9125:9119` 매핑을 그대로 유지합니다(6단계 SSH 터널로만 접근).

## 5. 로컬 인스턴스 정지 (이관 전 필수)

로컬과 VPS 양쪽에서 같은 Discord 봇 토큰으로 동시에 게이트웨이가 뜨면 채널
연결이 충돌합니다. VPS를 띄우기 전에 로컬을 먼저 정지합니다.

```bash
docker compose down   # 로컬에서 compose로 띄운 경우
```

정지 후 `.hermes/gateway_state.json` / `gateway.pid` / `gateway.lock`이 남아 있어도
무방합니다 — VPS에서 재기동하면 정리됩니다.

## 6. 코드 배포 (git clone)

```bash
# VPS에서
git clone https://github.com/manitri1/TriAgent_MICE.git /opt/hermes-triagent-mice
```

이 시점의 `.hermes/`에는 git에 커밋된 최소 파일(Profile 설정 등)만 있고 실제
런타임 상태는 없습니다 — 다음 단계에서 채웁니다.

## 7. 런타임 데이터 이관 (rsync)

로컬 Windows에서 Git Bash로 실행합니다(VPS까지 약 182MB 전송).

```bash
rsync -avz --delete \
  ./.hermes/ root@<VPS_IP>:/opt/hermes-triagent-mice/.hermes/
```

`.hermes/.env`와 10개 `profiles/*/.env`는 git에 없으므로 이 rsync로 함께
전송됩니다 — VPS에서 별도로 다시 채울 필요가 없습니다. 전송 후 권한을
확인합니다.

```bash
# VPS에서
chmod 600 /opt/hermes-triagent-mice/.hermes/.env
chmod 600 /opt/hermes-triagent-mice/.hermes/profiles/*/.env
```

rsync는 SSH 위로 암호화되어 전송되지만, 완료 후 로컬과 VPS의 `.env`가 완전히
동일한 키를 갖게 된다는 점을 인지합니다.

## 8. 빌드 및 기동

```bash
cd /opt/hermes-triagent-mice
docker compose build   # Dockerfile의 chromium/playwright 설치로 수 분 소요
docker compose up -d
docker compose ps
docker compose logs -f hermes
```

`docker-compose.yml`에는 이미 두 서비스 모두 `restart: unless-stopped`가
설정돼 있어 VPS 재부팅 시에도 별도 조치 없이 자동 기동됩니다.

## 9. 헬스체크 / Discord 재연결 확인

```bash
docker compose exec hermes hermes doctor
```

로그에서 Discord 채널이 다시 `connected` 상태가 되는지 확인하고, 실제
Discord 채널에서 봇에게 메시지를 보내 응답과 함께 기존 대화 기록/메모리가
유지되는지 확인합니다.

## 10. 대시보드 접근 (SSH 터널)

```bash
# 필요할 때만 로컬에서
ssh -L 9125:127.0.0.1:9125 root@<VPS_IP>
```

터널이 연결된 동안 브라우저에서 `http://127.0.0.1:9125`로 접속합니다.

> ⚠️ 호스트 포트가 `127.0.0.1`로 제한돼 있어도 컨테이너 **내부**는
> `--host 0.0.0.0`으로 바인딩되므로([08장](08-docker-deployment.md) 참고,
> `docker-compose.yml`의 `dashboard` 서비스 주석 참고) Hermes Agent가 자동으로
> Basic Auth를 요구합니다. `HERMES_DASHBOARD_BASIC_AUTH_USERNAME/PASSWORD/SECRET`는
> 이미 로컬 `.hermes/.env`에 설정돼 있고 7단계 rsync로 함께 전송되므로 접속 시
> 해당 계정으로 로그인하면 됩니다.

## 11. 재부팅 내구성 테스트

VPS를 한 번 재부팅한 뒤 `docker compose ps`로 두 서비스가 자동으로 다시
기동됐는지 확인합니다.

## 12. 운영 — 백업과 업데이트

- `.hermes/`(특히 `state.db`, `workspace/`, `kanban.db`, `projects.db`)를 정기적으로
  백업합니다 — hPanel VPS 스냅샷 기능을 쓰거나, cron으로 로컬/별도 스토리지에
  rsync 백업 잡을 구성합니다.
- 코드/Profile 변경 사항을 반영할 때:

  ```bash
  cd /opt/hermes-triagent-mice
  git pull
  docker compose build
  docker compose up -d
  ```

  런타임 데이터(`state.db`, `workspace/` 등)는 `.hermes/` bind mount에 남아
  있으므로 유지됩니다.

## 검증 체크리스트

- ⬜ `docker compose ps` — `hermes`, `dashboard` 두 서비스 모두 `Up`.
- ⬜ `docker compose logs hermes` — 에러 없이 게이트웨이 기동, Discord 채널
  연결 로그 확인.
- ⬜ Discord에서 봇에게 메시지 → 응답 확인, 기존 대화 기록/메모리 유지 확인.
- ⬜ SSH 터널로 대시보드 접속 → Basic Auth 로그인 → 프로젝트/컨테이너 상태
  정상 표시 확인.
- ⬜ VPS 재부팅 1회 → 자동 복구 확인.
