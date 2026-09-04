# Kanban card template

- title: [short descriptive title]
- owner: [agent or person, e.g. proposal-agent]
- priority: [low|medium|high]
- due: [YYYY-MM-DD or relative, e.g. D+7]
- workspace: [/opt/data/workspace/<project>]
- outputs:
  - path: outputs/<filename.md>
    format: markdown
    required_sections: ["목적","대상","근거링크"]
- verification:
  - checker: [coordinator or role]
  - steps:
    - read_file outputs/<filename.md>
    - confirm section headers
    - confirm >=3 external links if claims made
- HITL: [none | budget | outreach | speaker]
- notes: [optional instructions or constraints]

# Example
- title: proposal: 인포(요약1p + 체크리스트)
- owner: proposal-agent
- priority: high
- due: 2026-09-05
- workspace: /opt/data/workspace/마이스_네트워킹데이
- outputs:
  - path: outputs/proposal_info_1p_20260903_proposal-agent.md
    format: markdown
    required_sections: ["목적","대상","프로그램 일정","근거링크"]
- verification:
  - checker: coordinator
  - steps: [read_file, check_sections, confirm_links]
- HITL: outreach
- notes: do NOT send outreach emails until coordinator approval
