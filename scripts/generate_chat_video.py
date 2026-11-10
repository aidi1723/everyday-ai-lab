#!/usr/bin/env python3
"""
Generate WeChat/WhatsApp-style sequential chat animation video (1080x1920 9:16).
Simulates incoming messages person by person with avatars, typing indicators, and sound effects.
"""

import os
import sys
import json
import base64
import math
import struct
import wave
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FFMPEG_BIN = "/opt/homebrew/bin/ffmpeg"

def load_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    chat_file = os.path.join(base_dir, "src/data/academy-clubs-chat.json")
    members_file = os.path.join(base_dir, "src/data/academy-members.json")

    with open(chat_file, "r", encoding="utf-8") as f:
        chat_data = json.load(f)
    with open(members_file, "r", encoding="utf-8") as f:
        members_data = json.load(f)

    members_map = {str(m["id"]).zfill(2): m for m in members_data}
    return chat_data, members_map, base_dir

def get_avatar_b64(base_dir, illust_path):
    if not illust_path:
        return ""
    full_path = os.path.join(base_dir, "public", illust_path.lstrip("/"))
    if not os.path.exists(full_path):
        return ""
    with open(full_path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    mime = "image/webp" if full_path.endswith(".webp") else "image/jpeg"
    return f"data:{mime};base64,{data}"

def synthesize_audio(durations, output_wav):
    """
    Synthesize an AAC-compatible WAV audio track with keyboard ticks during typing
    and a cheerful pop chime when each message lands.
    """
    sr = 44100
    total_seconds = sum(d["duration"] for d in durations)
    total_samples = int(sr * total_seconds)
    audio = [0.0] * total_samples

    # Sound generators
    def add_pop(start_time):
        start_idx = int(start_time * sr)
        pop_len = int(sr * 0.18)
        for i in range(pop_len):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / sr
            # Two-tone chime (high A5 to E6 harmony)
            freq1 = 880.0
            freq2 = 1318.5
            decay = math.exp(-t * 22) * 0.35
            val = decay * (0.6 * math.sin(2 * math.pi * freq1 * t) + 0.4 * math.sin(2 * math.pi * freq2 * t))
            audio[idx] += val

    def add_click(click_time):
        start_idx = int(click_time * sr)
        click_len = int(sr * 0.025)
        for i in range(click_len):
            idx = start_idx + i
            if idx >= total_samples:
                break
            t = i / sr
            decay = math.exp(-t * 140) * 0.12
            val = decay * math.sin(2 * math.pi * 1400 * t)
            audio[idx] += val

    cur_time = 0.0
    for item in durations:
        step_type = item["type"]
        dur = item["duration"]
        if step_type == "typing":
            # Add a couple of subtle typing clicks
            clicks = [0.15, 0.45, 0.75, 0.95]
            for c in clicks:
                if c < dur:
                    add_click(cur_time + c)
        elif step_type == "message":
            add_pop(cur_time + 0.05)
        cur_time += dur

    # Convert to 16-bit PCM
    pcm_samples = []
    for s in audio:
        clamped = max(-1.0, min(1.0, s))
        pcm_samples.append(int(clamped * 32767))

    with wave.open(output_wav, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(struct.pack(f"<{len(pcm_samples)}h", *pcm_samples))

def generate_video_for_topic(topic_id, output_mp4, topic_custom_title=None):
    chat_data, members_map, base_dir = load_data()
    
    # Locate topic
    main_channel = chat_data["channels"][0]
    topic = next((t for t in main_channel["topics"] if t["id"] == topic_id), None)
    if not topic:
        raise ValueError(f"Topic {topic_id} not found in channel main!")

    topic_tag = topic.get("tag", "班级讨论")
    replies = topic.get("replies", [])
    if not replies:
        raise ValueError(f"Topic {topic_id} has no replies!")

    print(f"\n==========================================")
    print(f"Generating video for: {topic_id} ({topic_tag})")
    print(f"Total messages: {len(replies)}")
    print(f"Output target: {output_mp4}")
    print(f"==========================================")

    # Preload avatars as base64
    avatars_b64 = {}
    for r in replies:
        mid = str(r["senderId"]).zfill(2)
        if mid not in avatars_b64:
            m = members_map.get(mid, {})
            avatars_b64[mid] = get_avatar_b64(base_dir, m.get("illustration"))

    work_dir = f"/tmp/chat_video_{topic_id}"
    frames_dir = os.path.join(work_dir, "frames")
    html_dir = os.path.join(work_dir, "html")
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs(html_dir, exist_ok=True)

    # Build sequence of steps:
    # Step 0: Initial empty view (holds for 1.2s)
    # For message i:
    #   Step (i_typing): Shows typing indicator for sender of message i
    #   Step (i_msg): Shows message i delivered
    steps = []
    steps.append({
        "step_idx": 0,
        "type": "initial",
        "visible_count": 0,
        "typing_sender": None,
        "duration": 1.2
    })

    clock_minutes = 2
    for i, r in enumerate(replies):
        mid = str(r["senderId"]).zfill(2)
        m = members_map.get(mid, {})
        text = r.get("text_zh", "")
        # Compute reading duration: 3.5s base + 0.015s per char, max 5.5s
        read_dur = round(min(5.5, max(3.5, 3.2 + len(text) * 0.012)), 2)
        if i == len(replies) - 1:
            read_dur = 4.8  # Hold finale longer

        # 1. Typing step
        steps.append({
            "step_idx": len(steps),
            "type": "typing",
            "visible_count": i,
            "typing_sender": mid,
            "time_str": f"10:{clock_minutes:02d}",
            "duration": 1.1
        })

        # 2. Delivered message step
        steps.append({
            "step_idx": len(steps),
            "type": "message",
            "visible_count": i + 1,
            "typing_sender": None,
            "time_str": f"10:{clock_minutes:02d}",
            "duration": read_dur
        })

        if (i + 1) % 2 == 0:
            clock_minutes += 1

    # Final hold step
    steps.append({
        "step_idx": len(steps),
        "type": "finale",
        "visible_count": len(replies),
        "typing_sender": None,
        "time_str": f"10:{clock_minutes:02d}",
        "duration": 3.0
    })

    # Render HTML for each step
    def render_html_for_step(step_data):
        step_idx = step_data["step_idx"]
        visible_cnt = step_data["visible_count"]
        typing_sender = step_data["typing_sender"]
        
        msgs_html = []
        
        # Initial greeting / notification
        msgs_html.append("""
          <div class="time-stamp"><span>10:02 · 硅基高三(AI)班群聊</span></div>
        """)

        for j in range(visible_cnt):
            r = replies[j]
            mid = str(r["senderId"]).zfill(2)
            m = members_map.get(mid, {})
            name = m.get("name_zh", f"同学#{mid}")
            title = m.get("title_zh", "")
            logo = m.get("logo", "")
            avatar_url = avatars_b64.get(mid, "")
            text = r.get("text_zh", "")
            is_teacher = (mid == "00")
            
            badge_bg = "#FEF3C7" if is_teacher else "#E2E8F0"
            badge_color = "#92400E" if is_teacher else "#334155"
            bubble_class = "bubble teacher" if is_teacher else "bubble"

            time_label = f"10:{2 + j//2:02d}"

            msgs_html.append(f"""
            <div class="msg-row" id="msg-{j}">
              <img class="avatar" src="{avatar_url}" alt="{name}" />
              <div class="content-box">
                <div class="sender-meta">
                  <span class="sender-name">{name}</span>
                  <span class="sender-badge" style="background:{badge_bg};color:{badge_color};">
                    {logo} #{mid} · {title}
                  </span>
                </div>
                <div class="{bubble_class}">
                  {text}
                  <div class="bubble-time">{time_label}</div>
                </div>
              </div>
            </div>
            """)

        # Typing indicator if active
        if typing_sender:
            m = members_map.get(typing_sender, {})
            name = m.get("name_zh", f"同学#{typing_sender}")
            title = m.get("title_zh", "")
            logo = m.get("logo", "")
            avatar_url = avatars_b64.get(typing_sender, "")
            
            msgs_html.append(f"""
            <div class="msg-row typing-row" id="typing-box">
              <img class="avatar" src="{avatar_url}" alt="{name}" />
              <div class="content-box">
                <div class="sender-meta">
                  <span class="sender-name">{name}</span>
                  <span class="sender-badge" style="background:#E2E8F0;color:#334155;">
                    {logo} #{typing_sender} · {title}
                  </span>
                </div>
                <div class="typing-bubble">
                  <div class="dot d1"></div>
                  <div class="dot d2"></div>
                  <div class="dot d3"></div>
                  <span class="typing-label">正在输入中...</span>
                </div>
              </div>
            </div>
            """)

        all_msgs = "\n".join(msgs_html)

        html_content = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  width: 540px;
  height: 960px;
  background: #EDEDED;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
}}

/* iOS Status Bar */
.status-bar {{
  height: 44px;
  background: #EDEDED;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 700;
  color: #111;
}}
.island {{
  width: 110px;
  height: 26px;
  background: #000;
  border-radius: 13px;
}}

/* App Navigation Bar */
.nav-bar {{
  height: 52px;
  background: #EDEDED;
  border-bottom: 1px solid #D8D8D8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}}
.back-btn {{
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  color: #111;
  font-weight: 500;
}}
.title-box {{
  text-align: center;
}}
.title-box h1 {{
  font-size: 16.5px;
  font-weight: 800;
  color: #111;
  letter-spacing: -0.3px;
}}
.title-box p {{
  font-size: 11px;
  color: #666;
  font-weight: 500;
}}
.nav-actions {{
  font-size: 20px;
  letter-spacing: 2px;
  color: #333;
}}

/* Pinned Banner */
.pinned-banner {{
  background: #FEF3C7;
  border-bottom: 1px solid #FCD34D;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #92400E;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  line-height: 1.4;
}}
.pinned-tag {{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}}

/* Chat Area */
.chat-container {{
  flex: 1;
  overflow-y: scroll;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}}
.chat-container::-webkit-scrollbar {{
  display: none;
}}

.time-stamp {{
  text-align: center;
  font-size: 11px;
  color: #8E8E93;
  margin: 2px 0 6px 0;
}}
.time-stamp span {{
  background: rgba(0,0,0,0.06);
  padding: 2px 8px;
  border-radius: 4px;
}}

/* Message Row */
.msg-row {{
  display: flex;
  align-items: flex-start;
  gap: 10px;
}}
.avatar {{
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(0,0,0,0.08);
  box-shadow: 0 2px 5px rgba(0,0,0,0.08);
  flex-shrink: 0;
  background: #E5E7EB;
}}
.content-box {{
  max-width: 410px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}}
.sender-meta {{
  display: flex;
  align-items: center;
  gap: 6px;
}}
.sender-name {{
  font-size: 13px;
  font-weight: 800;
  color: #374151;
}}
.sender-badge {{
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: -0.2px;
}}

/* Bubble Styling */
.bubble {{
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 4px 16px 16px 16px;
  padding: 11px 14px;
  font-size: 14.5px;
  line-height: 1.58;
  color: #1F2937;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  word-break: break-word;
  position: relative;
}}
.bubble.teacher {{
  background: #FFFBEB;
  border: 1.5px solid #F59E0B;
  color: #78350F;
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.22);
}}
.bubble-time {{
  font-size: 10px;
  color: #9CA3AF;
  text-align: right;
  margin-top: 4px;
}}

/* Typing Indicator */
.typing-bubble {{
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 4px 16px 16px 16px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}}
.dot {{
  width: 6px;
  height: 6px;
  background: #9CA3AF;
  border-radius: 50%;
}}
.d1 {{ background: #4B5563; }}
.d2 {{ background: #9CA3AF; }}
.d3 {{ background: #D1D5DB; }}
.typing-label {{
  font-size: 12px;
  color: #6B7280;
  margin-left: 6px;
  font-weight: 500;
}}

/* Bottom Input Bar */
.input-bar {{
  height: 56px;
  background: #F7F7F7;
  border-top: 1px solid #D8D8D8;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
}}
.input-icon {{
  font-size: 22px;
  color: #666;
}}
.input-field {{
  flex: 1;
  background: #FFFFFF;
  height: 38px;
  border-radius: 8px;
  border: 1px solid #DFDFDF;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #9CA3AF;
  font-size: 13.5px;
}}
.home-bar {{
  height: 16px;
  background: #F7F7F7;
  display: flex;
  justify-content: center;
  align-items: center;
}}
.home-pill {{
  width: 140px;
  height: 4.5px;
  background: #000;
  border-radius: 3px;
}}
</style>
</head>
<body>

<div class="status-bar">
  <span>10:24</span>
  <div class="island"></div>
  <span>5G 📶 100%</span>
</div>

<div class="nav-bar">
  <div class="back-btn">‹ <span>微信 (128)</span></div>
  <div class="title-box">
    <h1>高三(AI)班 · 官方大群 (49)</h1>
    <p>48位同学实时在线 · 班主任 Y老师 统领</p>
  </div>
  <div class="nav-actions">···</div>
</div>

<div class="pinned-banner">
  <span>📌</span>
  <span class="pinned-tag">{topic_tag}</span>
</div>

<div class="chat-container" id="chat">
  {all_msgs}
</div>

<div class="input-bar">
  <div class="input-icon">🎙️</div>
  <div class="input-field">发消息或输入提示词召唤同学...</div>
  <div class="input-icon">😊</div>
  <div class="input-icon">⊕</div>
</div>
<div class="home-bar">
  <div class="home-pill"></div>
</div>

<script>
window.onload = function() {{
  const c = document.getElementById('chat');
  if (c) {{
    c.scrollTop = c.scrollHeight;
  }}
  const lastTarget = document.querySelector('.typing-row, .msg-row:last-child');
  if (lastTarget) {{
    lastTarget.scrollIntoView({{ block: 'end', behavior: 'instant' }});
  }}
}};
</script>
</body>
</html>
"""
        step_html_path = os.path.join(html_dir, f"step_{step_idx:03d}.html")
        with open(step_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        return step_html_path

    # Generate all HTML files
    print(f"Generating {len(steps)} HTML frames...")
    html_files = [render_html_for_step(s) for s in steps]

    # Capture screenshots in parallel
    print(f"Capturing screenshots via Headless Chrome (parallel workers=4)...")
    def capture_frame(idx):
        html_p = html_files[idx]
        out_png = os.path.join(frames_dir, f"frame_{idx:03d}.png")
        cmd = [
            CHROME_BIN,
            "--headless",
            f"--screenshot={out_png}",
            "--window-size=540,960",
            "--force-device-scale-factor=2",
            "--hide-scrollbars",
            html_p
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return out_png

    with ThreadPoolExecutor(max_workers=4) as pool:
        png_files = list(pool.map(capture_frame, range(len(steps))))

    print(f"All {len(png_files)} frames captured at 1080x1920!")

    # Synthesize audio
    print(f"Synthesizing dynamic audio track with sound cues...")
    wav_path = os.path.join(work_dir, "audio.wav")
    synthesize_audio(steps, wav_path)

    # Write concat manifest for ffmpeg
    manifest_path = os.path.join(work_dir, "manifest.txt")
    with open(manifest_path, "w", encoding="utf-8") as f:
        for idx, s in enumerate(steps):
            f.write(f"file '{png_files[idx]}'\n")
            f.write(f"duration {s['duration']}\n")
        # ffmpeg concat demuxer requires the last file to be specified again
        f.write(f"file '{png_files[-1]}'\n")

    # Encode with ffmpeg
    print(f"Assembling video via ffmpeg...")
    os.makedirs(os.path.dirname(os.path.abspath(output_mp4)), exist_ok=True)
    ffmpeg_cmd = [
        FFMPEG_BIN,
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", manifest_path,
        "-i", wav_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-shortest",
        output_mp4
    ]
    subprocess.run(ffmpeg_cmd, check=True)
    print(f"✅ Video created successfully: {output_mp4}")
    
    # Check output size
    size_mb = os.path.getsize(output_mp4) / (1024 * 1024)
    print(f"File size: {size_mb:.2f} MB")
    return output_mp4

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    if len(sys.argv) > 1:
        target_topic = sys.argv[1]
        if len(sys.argv) > 2:
            out_file = os.path.join(base_dir, sys.argv[2])
        else:
            out_file = os.path.join(base_dir, f"public/videos/{target_topic.replace('m_t_', '')}-chat.mp4")
        generate_video_for_topic(target_topic, out_file)
    else:
        # Default batch
        out1 = os.path.join(base_dir, "public/videos/asi-ban-chat.mp4")
        generate_video_for_topic("m_t_asi_ban", out1)

        out2 = os.path.join(base_dir, "public/videos/class-photo-chat.mp4")
        generate_video_for_topic("m_t_photo", out2)

        out3 = os.path.join(base_dir, "public/videos/jensen-gossip-chat.mp4")
        generate_video_for_topic("m_t_jensen_gossip", out3)
