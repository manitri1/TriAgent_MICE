---
name: attendee-registration-management
description: "참가자 등록 접수를 정리하고 결제 상태를 확인하며, 명찰·초청장 발급 데이터를 승인 대기 상태로 준비한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, registration, attendee, payment]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 등록이 시작된 뒤 참가자 명단·결제 현황을 정리하거나, 명찰/초청장 발급 데이터를
준비해야 할 때.

## 절차
1. 등록 폼/링크로 접수된 참가자 정보(이름, 소속, 카테고리, 결제 상태)를
   `code_execution`으로 정리해 참가자 DB(스프레드시트)로 관리한다.
2. 결제 상태를 확인하고 미결제자 리마인드 목록을 만든다. 실제 결제(PG) 확정/환불 처리는
   **승인 대기** 상태로 Coordinator에게 전달한다(직접 확정하지 않는다).
3. 명찰·초청장 발급용 데이터(이름/소속/카테고리)를 인쇄·발송 포맷으로 정리한다.
4. 등록 현황(총 등록자, 카테고리별 분포, 결제 완료율)을 요약해 `workspace/registration/
   <event-name>/`에 저장한다.
5. 참가자 개인정보(연락처, 결제 정보)는 비식별화하거나 별도 보안 영역에만 남기고, 다른
   행사 데이터와 섞지 않는다.

## 반환값
- 참가자 DB·등록 현황 파일 경로
- 결제/환불 승인 대기 항목 목록
- 명찰·초청장 발급 데이터 준비 여부
