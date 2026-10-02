import json
log_path = '/Users/MacBookPro/.gemini/antigravity-ide/brain/51e618f7-ba6f-4974-8be8-86727fb4487c/.system_generated/logs/transcript_full.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') == 114:
            print(data.get('content'))
