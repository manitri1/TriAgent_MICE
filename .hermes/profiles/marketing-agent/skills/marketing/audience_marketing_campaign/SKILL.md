---
name: audience-marketing-campaign
description: "타깃 참가자군을 분석해 채널별 홍보 콘텐츠를 작성하고, 유료/대량 캠페인은 승인 대기 상태로 준비하며 성과를 추적한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, marketing, audience, campaign]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 참가자 모객을 위해 SNS/랜딩페이지/이메일 캠페인을 기획·집행해야 할 때.

## 절차
1. `web`/`search`로 타깃 참가자군(업계, 관심사, 지역)을 분석한다.
2. 채널별(SNS, 이메일, 랜딩페이지) 홍보 콘텐츠 초안을 작성하고, `registration-agent`가
   관리하는 등록 링크를 연동한다. 확정되지 않은 사실(연사, 참가자 수 등)은 과장하지 않는다.
3. 유료 광고 집행이나 대량 이메일 발송은 **승인 대기** 상태로 Coordinator에게 전달한다 —
   승인 없이 스스로 집행하지 않는다.
4. 캠페인 실행 후 `code_execution`으로 성과(도달, 클릭, 등록 전환)를 집계한다.
5. `workspace/marketing/<event-name>/`에 콘텐츠 초안과 성과 리포트를 저장한다.

## 반환값
- 홍보 콘텐츠·성과 리포트 파일 경로
- 유료 광고/대량 캠페인 승인 대기 여부
- 등록 전환 성과 요약(채널별)
