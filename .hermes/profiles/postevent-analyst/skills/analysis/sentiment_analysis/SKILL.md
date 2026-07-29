---
name: sentiment-analysis
description: "행사 후 설문·SNS 피드백을 카테고리별로 감성 분석해, 표본 한계와 개인정보 비노출을 지킨 보고서를 컴파일한다"
version: 1.0.0
author: TriAgent_MICE
license: MIT
tags: [mice, postevent, sentiment, feedback, nlp]
platforms: [Linux, macOS, Windows]
---

## 사용 시점
행사 종료 후 설문 응답과 SNS 피드백을 분석해 개선 방향을 도출해야 할 때.

## 절차
1. 설문 원시 데이터와 `web`/`search`로 수집한 SNS(해시태그 등) 피드백을 함께 모은다. 응답
   수·수집 기간을 기록해 둔다.
2. 부스 운영, 강연 만족도, 식음료 등 카테고리별로 코멘트를 분류한다.
3. `code_execution`으로 카테고리별 감성(긍정/중립/부정) 분포를 산출하고, 부정 여론이 높은
   영역을 구체적으로 짚는다. 표본이 작거나 편향돼 있으면 명시하고 단정적 결론을 피한다.
4. 부정 피드백 작성자를 특정할 수 있는 개인정보(이름, 계정명 등)를 제거한다.
5. `workspace/reports/<event-name>/`에 정형화된 마크다운 보고서로 컴파일한다. 이전 행사
   데이터와 섞지 않는다.

## 반환값
- 보고서 파일 경로
- 응답 수·수집 기간, 표본 한계 서술 여부
- 개인정보 비식별화 여부
