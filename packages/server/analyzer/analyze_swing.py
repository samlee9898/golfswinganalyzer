import sys
import json
import os

video_path = sys.argv[1]

if not os.path.exists(video_path):
    print(json.dumps({
        "valid": False,
        "feedback": ["Video file not found."]
    }))

result = {
    "valid": True,
    "feedback": [
        "Video received successfully.",
        "Analysis pipeline is connected.",
        "Real swing analysis will be added next."
    ]
}

print(json.dumps(result))

sys.exit(0)
