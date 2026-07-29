---
name: postevent-financial-settlement
description: "사전 예산 대비 실제 집행을 대조하고 협력업체 대금 지급 내역을 정리해, 출처가 명시된 최종 정산 보고서를 승인 대기 상태로 작성한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, finance, settlement, postevent]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 종료 후 사전 예산안과 실제 집행 내역(인보이스, 영수증)을 정산해야 할 때.

## 절차
1. `budget-vendor-agent`의 사전 예산안과 실제 청구·집행 내역을 수집해 항목별로 대조한다.
2. `code_execution`으로 예산 대비 실제 집행 차이(초과/절감)를 계산한다.
3. 협력업체별 대금 지급 내역을 정리하고, 미지급·분쟁 항목을 표시한다.
4. `exhibition-agent`/`budget-vendor-agent`의 계약 데이터와 실제 청구액이 일치하는지
   교차 검증한다. 모든 금액에 출처(계약서, 인보이스 번호, 확인 일자)를 남긴다.
5. 최종 정산 보고서(매출-비용-순이익)를 `workspace/finance/<event-name>/`에 저장하고,
   상단에 **"기획자 승인 대기 중"**임을 명시한다 — 대금 지급은 직접 확정하지 않는다.

## 반환값
- 정산 보고서 파일 경로
- 예산 대비 실제 집행 차이 요약
- 미지급/분쟁 항목 목록, 승인 대기 여부
