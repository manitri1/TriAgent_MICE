간단 배포 가이드 — 정적 페이지 + Google Forms 임베드 (권장)

1) 준비물
- index.html, styles.css, assets/ (로고, og-image.png, qr.png) 파일
- Google Forms URL (없다면 Registration_Form_GoogleForms.md의 필드를 사용해 폼을 수동 생성)

2) index.html에 Google Forms 연결하기
- Google Forms  응답 화면의 공유(임베드) > <iframe> src 값을 복사하여 index.html의 iframe 주석을 대체하세요.
- 또는 버튼 링크(FORM_URL)를 실제 폼 URL로 바꾸세요.

3) QR, 짧은 URL 생성
- bit.ly 등에서 단축 URL 생성(예: bit.ly/pohangmice_reg)
- QR 생성기(qr-code-generator.com 등)에서 QR.png 다운로드 후 assets/qr.png로 추가

4) 메타/분석 설정
- OG 이미지(/assets/og-image.png) 교체
- Google Analytics 4(GA4) / Google Tag Manager 설정: GA4 측정 ID를 head에 스크립트로 추가
- UTM 템플릿 예: ?utm_source=instagram&utm_medium=post&utm_campaign=pohang_mice_2026

5) 간단 배포 (Netlify/GitHub Pages)
- Git을 초기화한 뒤(또는 기존 repo에 커밋)
  git init
  git add .
  git commit -m "Add landing page for Pohang MICE contest"
- Netlify: 새 사이트 생성 > Git 리포지토리 연결 > 기본 빌드 설정 사용 (빌드 명령 없음)
- GitHub Pages: GitHub에 push 후 Repository Settings > Pages에서 브랜치 선택

6) 파일 업로드(발표자료) 요구사항
- Google Forms로 파일 업로드 받으려면 Google 계정 소유자(Forms 소유자)가 Google Drive에 업로드 권한을 허용해야 합니다.
- 업로드 용량/형식 제한(예: PDF/PPT/JPG 각각 10MB 권장)
- 대용량 파일이 예상되면 Firebase Storage 또는 S3로 업로드하는 방안을 검토하세요.

7) 테스트 체크리스트
- [ ] 데스크탑(Chrome/Edge/Firefox) 로딩 확인
- [ ] 모바일(iOS/Android) 레이아웃 확인
- [ ] 폼 제출(파일 업로드 포함) 테스트
- [ ] OG(페이스북/카카오톡) 공유 미리보기 확인
- [ ] QR 스캔 후 정상 이동 확인

8) 교체 항목(배포 전)
- index.html: FORM_URL -> 실 URL 변경
- assets/og-image.png, assets/qr.png, logo 교체
- README: 배포한 URL 기입

문제가 발생하면 제가 배포 단계(예: Netlify에 연결)까지 도와드릴 수 있습니다. 원하시면 지금 바로 Git repo 초기화 + Netlify 배포 스크립트(설정 안내)를 생성해 드릴게요.