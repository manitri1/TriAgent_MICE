# nousresearch/hermes-agent:latest에 browser 툴셋(Playwright/Chromium)을 얹은 커스텀 이미지.
#
# 배경: proposal-agent(행사지/숙박 동향 조사)와 postevent-analyst(SNS 피드백 수집)가 browser
# 툴셋으로 웹 리서치를 하려면 컨테이너 안에 Chromium/Playwright가 있어야 하는데, 베이스
# 이미지에는 없다. `docker compose exec`로 실행 중인 컨테이너에 직접 설치하면 컨테이너
# 재생성(`docker compose down`/`up`) 시 사라지는 휘발성 문제가 있어(TriAgent_Planner에서 겪은
# 문제), 이미지 레이어에 굽는 방식으로 처음부터 채택한다. Node/npm은 베이스 이미지에 이미
# v22가 있으므로 별도 재설치하지 않는다(재설치 시 Hermes Agent 런타임이 깨질 위험이 있음).
FROM nousresearch/hermes-agent:latest

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        chromium \
        libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxss1 libasound2 \
        libx11-xcb1 libxcb1 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g playwright --no-fund && \
    npx playwright install chromium
