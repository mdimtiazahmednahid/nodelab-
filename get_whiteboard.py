import json

log_path = '/Users/MacBookPro/.gemini/antigravity-ide/brain/51e618f7-ba6f-4974-8be8-86727fb4487c/.system_generated/logs/transcript_full.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT' or data.get('type') == 'TOOL_RESPONSE' or data.get('type') == 'CODE_ACTION':
                content = data.get('content', '')
                if 'function Whiteboard(' in content and 'missionActive' in content:
                    print("Found in step:", data.get('step_index'))
                    with open('whiteboard_log.txt', 'w') as out:
                        out.write(content)
        except:
            pass
