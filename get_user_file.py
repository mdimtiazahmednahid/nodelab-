import json

log_path = '/Users/MacBookPro/.gemini/antigravity-ide/brain/51e618f7-ba6f-4974-8be8-86727fb4487c/.system_generated/logs/transcript_full.jsonl'
with open(log_path, 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('source') == 'USER_EXPLICIT' or data.get('source') == 'USER_IMPLICIT':
            content = data.get('content', '')
            if 'function NewtonCradle' in content:
                print("FOUND FULL FILE in step", data.get('step_index'))
                with open('recovered_initial.tsx', 'w') as out:
                    out.write(content)
                break
