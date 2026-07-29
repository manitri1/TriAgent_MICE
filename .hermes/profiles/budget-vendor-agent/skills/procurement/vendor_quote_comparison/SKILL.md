---
name: vendor-quote-comparison
description: "벤더 견적을 수집·비교하고, 출처가 명시된 예산안(승인 대기 상태)을 작성한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, budget, vendor, procurement]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
참가 규모·예산 상한·후보 지역이 주어졌을 때 컨벤션 센터·숙박·케이터링 벤더 견적을 비교하고
예산안을 작성해야 하는 경우.

## 절차
1. 참가 규모·예산 상한·선호 등급·지역 조건을 표로 정리해 비교 기준을 고정한다.
2. `web`/`search`로 후보 벤더별 견적을 수집한다. 각 항목에 반드시 출처(벤더명, 조회 시점)를
   기록한다 — 출처 불명 수치는 포함하지 않는다.
3. `code_execution`으로 벤더별 단가 비교 시트를 만든다. 예산 상한 초과 항목은 명확히
   표시한다.
4. 예산안 초안 상단에 **"기획자 승인 대기 중"**임을 명시한다 — "확정"·"최종" 표현을 쓰지
   않는다.
5. `workspace/budget/<event-name>/`에 비교 시트와 예산안을 저장한다. 계약 체결·결제는 직접
   실행하지 않는다.

## 반환값
- 비교 시트·예산안 파일 경로
- 예산 상한 초과 여부와 초과 항목
- 견적 데이터가 실제 벤더 시스템에 반영됐는지 재확인한 방법(Active Verification 지원용)
