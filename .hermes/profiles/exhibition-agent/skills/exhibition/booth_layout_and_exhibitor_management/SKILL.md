---
name: booth-layout-and-exhibitor-management
description: "전시 부스 배치도를 설계하고 전시업체 계약 현황·스폰서 혜택 이행을 관리하며, 계약 확정은 승인 대기 상태로 유지한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, exhibition, booth, exhibitor]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
전시장 도면과 참가 전시업체 정보가 주어졌을 때 부스 배치도를 설계하거나, 전시업체 계약
현황을 관리해야 하는 경우.

## 절차
1. 전시장 도면과 부스 규격(가로/세로, 전기 용량)을 정리하고, `code_execution`으로 배치도
   좌표를 계산해 초안을 만든다.
2. 전시업체별 문의·계약 조건(부스 크기, 위치, 가격)을 `web`/`search`로 보완 조사하고
   계약 현황 시트로 정리한다. 출처 불명 단가는 포함하지 않는다.
3. `outreach-agent`의 스폰서 계약 산출물을 대조해, 계약된 부스 위치·로고 노출 등 혜택이
   배치도에 반영됐는지 확인한다.
4. 배치도 최종 확정 전 예산 상한, 통로 폭·비상구 동선 등 안전 규정 준수 여부를 점검한다.
5. `workspace/exhibition/<event-name>/`에 배치도와 계약 현황 시트를 저장하고, 계약 확정은
   **승인 대기** 상태로 Coordinator에게 전달한다.

## 반환값
- 배치도·계약 현황 시트 파일 경로
- 안전 규정 점검 결과(통과/미비 항목)
- 스폰서 혜택 이행 확인 결과
