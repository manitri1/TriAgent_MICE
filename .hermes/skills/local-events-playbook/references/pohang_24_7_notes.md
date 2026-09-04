포항_24_7 — 실무 요약 / 참조 노트

목적
- 포항_24_7(포항 MICE Academy)은 지역 관광지 발굴 아이디어를 접수·선별해 현장 발표(2026-11-03)와 후속지원으로 연결하는 파일럿 행사입니다.

프로젝트 기준(한 줄 요약)
- 모든 팀 문서는 inputs/ 폴더의 기준 제출본(행사계획서 PDF)을 ‘단일 출처(canonical)’로 따른다.
- 마케팅/포스터/SNS 등은 metadata(또는 strategy 문서)에서 title/date/venue를 파싱해 동기화한다.

권장 폴더·파일 패턴
- inputs/2026_포항MICE_행사계획서_제출본.pdf  (canonical)
- inputs/event_meta.yaml  (자동 동기화용 메타데이터)
- marketing/poster_copy.md, marketing/sns_posts.md, marketing/canva_prompt.txt
- outputs/ (인쇄·배포 산출물)

자동 동기화 규칙(요약)
1) 기준 메타(event_meta.yaml 혹은 행사계획서에서 파싱): event_title, event_datetime(ISO), event_venue, contact_email, registration_deadline
2) 마케팅 파일 상단에 {{event_title}}, {{event_datetime}}, {{event_venue}} 토큰을 넣어두고 스크립트로 치환한다.
3) 스크립트는 UTF-8, CRLF/ LF 모두 안전하게 처리한다.

WSL ↔ Windows 전달(권장 워크플로우)
- 직접 /mnt/e 등 외부 드라이브로 쓰기 시 권한 오류 발생 가능. 안전한 방법:
  1) WSL 내부에 tar.gz 생성: /opt/data/pohang_24_7_project_package.tar.gz
  2) Windows에서 파일 탐색기에서 경로 열기: \\wsl$\{배포명}\opt\data\pohang_24_7_project_package.tar.gz → 복사
- 또는 대상이 /mnt/c/Users/<User>/Downloads 등이라면 (사용자 제공 경로) 복사를 시도할 수 있다.

Google Form 생성 가이드
- 폼 필드 사전(templates/google_form_csv_template.csv)을 사용해 Google Form을 수동 또는 Apps Script로 생성.
- 폼에는 저작권·초상권 동의 체크박스를 필수로 넣는다.
- 접수 마감(예: 2026-10-20)과 제출물 포맷(PDF/PPT/영상)을 명시.

마케팅 동기화 위험·해결(팁)
- 위험: 날짜 표기 혼선(한국시간 표기), 폰트 미설치로 디자인 깨짐
  - 해결: event_datetime은 ISO(YYYY-MM-DD HH:MM)로 통일, poster에는 대체 폰트 명시(예: Malgun Gothic)
- 위험: QR 링크·단축링크 변동
  - 해결: 링크는 단축URL 서비스(bit.ly)에서 고정 생성 후 마케팅 파일에 반영.

운영 체크리스트(핵심)
- PM: canonical 문서 위치·버전 관리 확인
- Marketing: poster_copy.md, sns_posts.md 동기화 후 시안 생성(SVG/PNG)
- Ops: AV 장비 목록·예비부품 확보
- Finance: 예산 항목 확정·지급 프로세스

참고: 이 파일은 로컬 세션에서 얻은 실무적 교훈(WSL→Windows 권한 우회, meta-driven 마케팅 sync, Google Form 템플릿)만을 담습니다. 환경의 영구적 제약을 스킬 규칙으로 고착시키지 마십시오.
