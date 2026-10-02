import json

log_path = '/Users/MacBookPro/.gemini/antigravity-ide/brain/51e618f7-ba6f-4974-8be8-86727fb4487c/.system_generated/logs/transcript_full.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'CODE_ACTION':
                content = data.get('content', '')
                if 'function WaterFilter' in content:
                    with open('diff_waterfilter.txt', 'w') as out:
                        out.write(content)
                if 'function ClickIndicator' in content:
                    with open('diff_click.txt', 'w') as out:
                        out.write(content)
        except: pass
