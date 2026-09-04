포항 MICE Academy (포항 지역 콘텐츠 발굴 콘테스트) — 세션 가이드 (예비 참조)

목적
- 이 참조는 event-planning 스킬을 사용하는 에이전트가 "포항_24_7" 프로젝트에서 빠르게 작동하도록 돕는 세션-특화 가이드입니다. 사용자(조직자)는 한국어를 선호하며, 편집 가능한 산출물(Markdown, DOCX, PPTX)과 Canva 프롬프트를 원합니다. 모든 산출물은 /opt/data 작업공간에 저장합니다.

핵심 텍스트(표준 카피)
- 행사명: 포항 지역 콘텐츠 발굴 콘테스트 (포항 마이스아카데미)
- 일시/장소: 2026-11-03 18:00, 파랑뜰 2층
- 기획의도: 지역 관광자원 발굴 및 지역 홍보 강화, 지역민·청년의 창의 아이디어 발굴 및 후속지원 연계

필수 체크리스트(홍보·시스템 담당)
1. 도메인/호스팅 결정(권장: Netlify/GitHub Pages) — DNS·SSL 설정 기록
2. 랜딩페이지(정적): index.html + styles.css, 상단 카피는 위 표준 카피 사용
3. 접수: Google Forms 임베드(또는 명확한 CTA) — 필수 필드 정의 및 reCAPTCHA 고려
4. 트래킹: GA4 + GTM 설치, UTM 템플릿 제공
5. 캠페인 링크: bit.ly 단축 URL, QR 이미지(assets/qr.png)
6. 백업: 구글시트 자동 백업 + 주간 CSV 추출
7. QA: 브라우저·모바일 테스트, 파일 업로드 테스트, 접근성(alt 텍스트) 확인

파일 및 저장 경로(권장)
- 랜딩 소스: /opt/data/workspace/포항_24_7/website/
- 디자인 에셋: /opt/data/workspace/포항_24_7/website/assets/
- 폼 스펙: /opt/data/workspace/포항_24_7/website/specs.md
- 마케팅 산출물: /opt/data/workspace/포항_24_7/marketing/
- 주간 리포트: /opt/data/workspace/포항_24_7/reports/marketing_weekly_YYYYMMDD.xlsx

빠른 템플릿(복사용)
- 랜딩 상단 헤드라인(한국어): "포항 지역 콘텐츠 발굴 콘테스트 — 포항의 이야기를 찾습니다"
- OG description: "2026-11-03 18:00 · 파랑뜰 2층. 지역 관광자원 발굴을 위한 아이디어 공모전. 참가 신청은 아래 폼을 통해 진행하세요."

사용 지침
- 언어: 모든 공개 문서는 한국어로 작성. 편집 가능한 파일을 우선 제공(DOCX/PPTX/Markdown). Canva 프롬프트 포함.
- 파일명 규칙: name_v{version}_YYYYMMDD.ext (예: poster_A3_v1_20260820.pdf)
- 배포: 산출물 생성 후 반드시 /inputs, /outputs, /docs 폴더 중 적절한 위치에 저장하고 README에 요약 일지 추가.

참고: 고객(사용자)은 빠른 실행을 선호합니다. "A: 정적 랜딩 + Google Forms" 방식이 기본 권장안입니다. 확장 필요 시 Netlify Forms/Firebase 연동을 고려하세요.
