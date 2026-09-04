#!/usr/bin/env python3
"""
marketing_sync.py

간단한 마케팅 파일 동기화 스크립트(템플릿)
- 사용법: event_meta.yaml 을 같은 폴더에 두고 실행하면 marketing/ 내의 .md 파일에 있는 {{event_title}} {{event_datetime}} {{event_venue}} 토큰을 대체합니다.
- 파이썬 3 기본 라이브러리만 사용.
"""
import re
import yaml
from pathlib import Path

META_FILE = Path("event_meta.yaml")
MARKETING_DIR = Path("marketing")
TOKENS = ["event_title","event_datetime","event_venue"]

def load_meta(path):
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def sync_file(path, meta):
    text = path.read_text(encoding="utf-8")
    for t in TOKENS:
        text = text.replace("{{%s}}"%t, str(meta.get(t, "")))
    path.write_text(text, encoding="utf-8")
    print("Updated:", path)

def main():
    if not META_FILE.exists():
        print("Missing event_meta.yaml in cwd. Create one with keys: ", TOKENS)
        return
    meta = load_meta(META_FILE)
    for md in MARKETING_DIR.glob("*.md"):
        sync_file(md, meta)

if __name__ == '__main__':
    main()
