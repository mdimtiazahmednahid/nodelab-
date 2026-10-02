import json

log_path = '/Users/MacBookPro/.gemini/antigravity-ide/brain/51e618f7-ba6f-4974-8be8-86727fb4487c/.system_generated/logs/transcript_full.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('source') == 'SYSTEM' and data.get('type') == 'TOOL_RESPONSE':
            content = data.get('content', '')
            if 'Showing lines ' in content and 'File Path: `file:///Users/MacBookPro/Downloads/nodelab/src/App.tsx`' in content:
                print("FOUND VIEW FILE in step", data.get('step_index'), content[:100].replace('\n', ' '))
