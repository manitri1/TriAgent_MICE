# Pohang MICE Academy 2026 — 웹사이트 설계 및 운영 계획

목표: 포항 지역 콘텐츠 발굴 콘테스트(2026-11-03)를 지원하는 공식 웹사이트 설계와 운영 계획을 수립한다. 사이트는 참가자 모집·자료 제출·일정 안내·심사 결과 게시·후속 홍보(사진·영상) 역할을 수행하며, 운영팀이 관리·정산·분석하기 쉬운 구조여야 한다.

대상 사용자
- 1차: 포항 지역 대학생(공모 주요 타깃)
- 2차: 지역 일반인(관심 있는 시민·관광 관계자)
- 운영자: 기획팀(PM), 홍보담당, 운영담당, 심사담당, 미디어담당

핵심 요구사항(우선순위)
1. 참가자 접수폼(파일 업로드 포함) — 필수
2. 행사 안내(일정·장소·식순) 및 FAQ — 필수
3. 심사 기준·심사위원 정보 공개 — 필수
4. 제출작 보관(심사용) 및 심사 집계(관리자 전용) — 필수
5. 행사 당일 라이브·결과(심사 결과, 사진·영상 업로드) — 중
6. 홍보용 랜딩(포스터·CTA·QR) 및 SNS 연동 — 필수
7. 관리자 대시보드(접수현황·참가자 목록·예산 소모 현황 링크) — 필수
8. 간단한 CMS(콘텐츠 수정) — 중
9. 접근성과 보안(SSL, 개인정보 암호화) — 필수

주요 기능(사용자 관점)
- 홈: 행사 요약, CTA(참가신청), 날짜·장소, 핵심 KPI(남은 접수기간)
- 참가신청 페이지: 입력폼(팀명/대표/연락처/이메일/발표주제/요약/첨부파일) + 동의 체크박스(촬영·저작권) + 제출 확인 이메일
- 참가자 마이페이지(선택): 제출 내역 확인/수정(마감 전)
- 일정/프로그램: 식순(최종본), 발표자 목록(확정 시)
- 심사 안내: 심사 기준, 심사위원 프로필, 심사 방식 설명
- 소식/보도: 보도자료·공지·사후 보고서·사진 갤러리·하이라이트 영상
- 관리자 대시보드(비공개): 접수 csv export, 파일 다운로드, 심사표 입력·집계, 참가자 통계, 이메일 발송(일괄)
- 문의/FAQ: 문의 폼 및 연락처

관리자 워크플로우(간단)
1. 마케팅팀이 랜딩페이지 업데이트(CMS) → SNS 링크 배포
2. 참가자가 접수폼 제출 → 자동 확인 이메일 발송
3. 운영팀이 접수DB 확인 → 예선/본선 선정(관리자판에서 상태 변경)
4. 심사위원이 심사표 입력(관리자전용 양식) → 점수집계 자동화
5. 수상 결과 게시·사후 콘텐츠 업로드

데이터 설계(주요 테이블)
- participants(id, team_name, rep_name, email, phone, members, affiliation, submission_id, status (submitted/selected/withdrawn), created_at)
- submissions(id, participant_id, title, abstract, file_path, slug, created_at)
- judges(id, name, affiliation, bio, contact)
- scores(id, submission_id, judge_id, creativity, feasibility, locality, presentation, total, comments, created_at)
- admins(id, name, role, email, password_hash)
- logs(events) — 접수·변경·다운로드 로그

비즈니스 규칙
- 접수 마감 후 수정 불가(단, 운영자가 상태 변경 시 허용)
- 파일 최대 10MB, 허용 형식: pdf, pptx, mp4(영상), jpg/png(이미지)
- 개인정보 저장: 암호화된 DB 필드, 관리자 접근 제한

기술 스택(권장, 빠른 구축 기준)
- 프론트엔드: React (CRA/Vite) 또는 Next.js(SSR 가능)
- 백엔드: Node.js (Express) 또는 Python (FastAPI)
- DB: PostgreSQL (관계형) + 파일은 S3 호환 스토리지(또는 로컬 uploads/)
- 파일 스토리지: AWS S3 또는 MinIO(자체 호스팅)
- 인증: JWT 기반 관리자 로그인, 이메일 확인(접수자)
- 호스팅: Vercel/Netlify(프론트) + Render/Heroku/DigitalOcean(App Backend) 또는 전체를 AWS(EC2/Elastic Beanstalk)
- 배포: CI/CD 파이프라인(GitHub Actions)
- 도메인/SSL: Let’s Encrypt 자동 발급
- 모니터링: Sentry(에러), Google Analytics/GA4(트래픽), Plausible(프라이버시)

접근성/보안/개인정보
- HTTPS 필수(모든 엔드포인트)
- 개인정보 최소수집 원칙(필요 항목만 수집)
- 파일 업로드 바이러스 검사 권장(서드파티 API)
- 관리자 패스워드 해시(Scrypt/Argon2 권장), 2FA 옵션
- 개인정보 보관기간(행사 종료 후 1년 보관, 이후 삭제 또는 보관 정책 명시)

운영·지원 계획
- 역할(인력)
  - 웹총괄(1명, PM): 요구수집·우선순위·대외(도메인/호스팅) 담당
  - 프론트엔드 개발(1명) / 백엔드 개발(1명) — 소규모 개발팀
  - 운영(1명): 접수 관리·심사 조정·리허설 지원
  - 콘텐츠/마케팅(1명): 콘텐츠 업데이트·SNS 연동
  - 미디어(1명): 사진·영상 업로드 및 편집물 관리
- SLA / 운영시간
  - 이벤트 전: 주2회 배포·주간 점검
  - 이벤트 D-7~D+1: 매일 점검(리허설·백업 확인)
  - 이벤트 당일: 실시간 대응(운영 채널: 슬랙/전화)
- 백업 계획
  - DB 일일 스냅샷(자동), 파일 스토리지 버전 관리
  - 긴급 복구 매뉴얼(포인트 복구 절차)

콘텐츠/SEO/분석
- SEO: 메타 타이틀, 메타 설명, OG 태그(페이스북/카카오/인스타 링크 카드), 구조화 데이터(JSON-LD 이벤트)
- SNS 카드: OG 이미지(1200x630), 트윗 카드
- 분석: 접수경로(UTM) 추적, 가입전환 퍼널, 주별/일별 접수 리포트

타임라인(예정)
- D-90: 기획 확정, 요구사항(목록) 마감
- D-70: 기본 디자인(와이어), 도메인·호스팅 확보
- D-50: 프론트·백엔드 기본 기능(접수폼, CMS) 개발 시작
- D-30: 내부 테스트(리허설 접수), 디자인·콘텐츠 반영
- D-14: 베타 오픈(홍보 시작), 결제(필요 시)·예산 확정
- D-7: 리허설(사이트 운영·접수 검증) — 비상 시 복구 절차 점검
- D-day: 실시간 모니터링, 현장용 관리자 화면 준비
- D+14: 데이터 정리(접수자 DB), 결과 보고서, 콘텐츠 아카이빙

작업 분해(우선 8개 태스크)
- W1: 도메인·호스팅 셋업(작업: 도메인 등록, DNS, SSL) — Owner: Web PM
- W2: DB 모델 및 파일 스토리지 설계(Owner: Backend)
- W3: 접수폼 UI+파일 업로드 완성(Owner: Frontend)
- W4: 관리자 대시보드(접수조회·CSV export) (Owner: Backend+Frontend)
- W5: 콘텐츠 페이지(홈/일정/FAQ) 템플릿 작성(Owner: Marketing)
- W6: 이메일(확인·알림) 템플릿 및 발송 연동(Owner: Backend)
- W7: 테스트 시나리오 및 리허설 수행(Owner: Operations)
- W8: 분석(GA/UTM) 및 이벤트 트래킹 설정(Owner: Marketing)

예상 예산(개략)
- 도메인(1년): 10~30 USD
- 호스팅(소형 앱): 월 10~50 USD (Render/Heroku/DO) 또는 AWS 매니지드 비용
- 파일 스토리지(S3): 행사를 위한 소량 트래픽 기준 5~30 USD
- 개발(외주 기준): 소규모(프론트+백엔드) 1인월~2인월치 계약(약 3,000~8,000 USD, 범위에 따라 달라짐)
- 추가(이메일 발송, CDN, 모니터링): 월 10~100 USD

검증/테스트 체크리스트
- [ ] HTTPS 적용 완전 확인
- [ ] 파일 업로드/다운로드(대용량 10MB) 테스트
- [ ] 이메일(접수 확인) 발송·수신 테스트
- [ ] 관리자 CSV export, 일괄메일 발송 테스트
- [ ] 심사표 입력→집계 정확성 검증
- [ ] 트래픽 급증 시(예: SNS 바이럴) 기본 동작 확인

문서(프로젝트용 저장 위치)
- 제안서(프로그램·참가안내): /opt/data/workspace/pohang-mice-academy-2026/proposals/
- 마케팅 자료: /opt/data/workspace/pohang-mice-academy-2026/marketing/
- 설계 문서(이 파일): /opt/data/workspace/pohang-mice-academy-2026/web_plan.md

---

도움이 필요하시면 제가 바로 초기 템플릿(접수폼 HTML/React 컴포넌트 + 간단한 Express API 샘플) 을 생성해 드리겠습니다. 원하시면 어떤 스택으로 개발할지(Next.js + Vercel / React + Node + DigitalOcean 등) 알려주세요.