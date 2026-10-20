import os
import shutil
import subprocess
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
WIDTH, HEIGHT = 1080, 1080
FPS = 15
TOTAL_FRAMES = 115

# Color Palette
BG_CREAM = "#FAF8F5"
TEXT_CHARCOAL = "#1E1E1E"
ACCENT_ORANGE = "#D97757"
ACCENT_GREEN = "#2C5E43"
CARD_BG = "#FFFFFF"
BORDER_COLOR = "#1E1E1E"
MUTED_TEXT = "#5C5852"
TAG_BG = "#EFECE6"

# Fonts
FONT_ZH_BOLD = "/System/Library/Fonts/Hiragino Sans GB.ttc"
FONT_ZH_MED = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_EN = "/System/Library/Fonts/HelveticaNeue.ttc"
FONT_SERIF = "/System/Library/Fonts/Times.ttc"

def get_font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size, index=index)
    except:
        return ImageFont.load_default()

font_title_lg = get_font(FONT_ZH_BOLD, 74)
font_title_md = get_font(FONT_ZH_BOLD, 52)
font_sub_serif = get_font(FONT_SERIF, 44)
font_body_bold = get_font(FONT_ZH_BOLD, 32)
font_body = get_font(FONT_ZH_MED, 28)
font_en_sub = get_font(FONT_EN, 24)
font_badge = get_font(FONT_EN, 20)
font_small = get_font(FONT_ZH_MED, 22)
font_tag = get_font(FONT_ZH_BOLD, 19)

# Load Images
base_dir = "/Volumes/MacSSD/项目开发/ai博客/public/images"
logo_img = Image.open(f"{base_dir}/logo.jpeg").convert("RGBA")
p1_img = Image.open(f"{base_dir}/pillar-1-life-labs.jpeg").convert("RGBA")
p2_img = Image.open(f"{base_dir}/pillar-2-workflows.jpeg").convert("RGBA")
p3_img = Image.open(f"{base_dir}/pillar-3-habit-shifts.jpeg").convert("RGBA")
p4_img = Image.open(f"{base_dir}/pillar-4-my-stack.jpeg").convert("RGBA")

frames_dir = "/tmp/everyday_ai_frames"
os.makedirs(frames_dir, exist_ok=True)

def draw_pill(draw, x, y, text, bg_color, text_color, font, prefix=""):
    display_text = f"• {text}" if prefix == "•" else text
    bbox = font.getbbox(display_text)
    w = bbox[2] - bbox[0] + 36
    h = 38
    draw.rounded_rectangle([x - w//2, y, x + w//2, y + h], radius=19, fill=bg_color)
    draw.text((x, y + 6), display_text, font=font, fill=text_color, anchor="mt")
    return h

def draw_card(draw, box, fill=CARD_BG, border=BORDER_COLOR, radius=20, shadow_offset=(6,6)):
    x0, y0, x1, y1 = box
    if shadow_offset:
        sx, sy = shadow_offset
        draw.rounded_rectangle([x0+sx, y0+sy, x1+sx, y1+sy], radius=radius, fill=border)
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius, fill=fill, outline=border, width=3)

for frame_idx in range(TOTAL_FRAMES):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_CREAM)
    draw = ImageDraw.Draw(img)

    # Frame border & decorative corner dots
    draw.rounded_rectangle([25, 25, WIDTH - 25, HEIGHT - 25], radius=24, outline=BORDER_COLOR, width=4)
    draw.ellipse([45, 45, 53, 53], fill=ACCENT_ORANGE)
    draw.ellipse([WIDTH - 53, 45, WIDTH - 45, 53], fill=ACCENT_GREEN)
    draw.ellipse([45, HEIGHT - 53, 53, HEIGHT - 45], fill=ACCENT_GREEN)
    draw.ellipse([WIDTH - 53, HEIGHT - 53, WIDTH - 45, HEIGHT - 45], fill=ACCENT_ORANGE)

    # SCENE 1: Brand Intro (Frames 0 to 38)
    if frame_idx < 39:
        progress = min(1.0, frame_idx / 15.0)
        
        # Badge
        draw_pill(draw, WIDTH//2, 80, "HUMAN-CENTRIC AI COLUMN", ACCENT_GREEN, "#FAF8F5", font_badge)

        # Logo
        logo_size = int(190 + 10 * progress)
        logo_resized = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        lx = WIDTH//2 - logo_size//2
        ly = 160
        # Logo frame
        draw_card(draw, [lx-6, ly-6, lx+logo_size+6, ly+logo_size+6], fill="#FAF8F5", border=BORDER_COLOR, radius=32, shadow_offset=(5,5))
        img.paste(logo_resized, (lx, ly))

        # Title
        draw.text((WIDTH//2 - 130, 410), "日常AI", font=font_title_lg, fill=TEXT_CHARCOAL, anchor="ma")
        draw.text((WIDTH//2 + 130, 428), "Everyday AI Lab", font=font_sub_serif, fill=ACCENT_ORANGE, anchor="ma")

        # Divider
        draw.line([WIDTH//2 - 200, 520, WIDTH//2 + 200, 520], fill="#E0D9CD", width=2)
        draw.rectangle([WIDTH//2 - 6, 514, WIDTH//2 + 6, 526], fill=ACCENT_ORANGE)

        # Slogan Box
        draw_card(draw, [100, 560, WIDTH-100, 770], fill=CARD_BG, border=BORDER_COLOR, radius=24, shadow_offset=(6,6))
        draw.text((WIDTH//2, 605), "只聊生活中的 AI，记录普通人的日常实践。", font=font_body_bold, fill=TEXT_CHARCOAL, anchor="mt")
        draw.text((WIDTH//2, 665), "Only about AI in real life.", font=font_sub_serif, fill=ACCENT_ORANGE, anchor="mt")
        draw.text((WIDTH//2, 715), "Practical experiments for everyday humans.", font=font_en_sub, fill=MUTED_TEXT, anchor="mt")

        # Sub-badges
        draw.text((WIDTH//2, 830), "不聊跑分参数 · 只解柴米油盐 · 人人可抄作业", font=font_body, fill=ACCENT_GREEN, anchor="mt")
        draw.text((WIDTH//2, 885), "Weekly Field Notes · Zero Hype", font=font_en_sub, fill=MUTED_TEXT, anchor="mt")

        # Footer
        draw.text((WIDTH//2, 980), "0500005.xyz  |  X: @edailab  |  YouTube: @edai_lab", font=font_badge, fill=MUTED_TEXT, anchor="mt")

    # SCENE 2: Four Pillar Labs (Frames 39 to 76)
    elif frame_idx < 77:
        draw_pill(draw, WIDTH//2, 70, "FOUR PILLAR LABS · 四大固定栏目", ACCENT_ORANGE, "#FAF8F5", font_body_bold)
        draw.text((WIDTH//2, 125), "用严谨实验精神，解构具体的日常琐碎", font=font_title_md, fill=TEXT_CHARCOAL, anchor="mt")

        cards_data = [
            (100, 215, 520, 545, p1_img, "LAB 01", "生活实验", "Life Labs", "剩菜改造 / 家庭管理 / 健康理财"),
            (560, 215, 980, 545, p2_img, "LAB 02", "日常工作流", "Workflows", "零代码提效 / 15分钟搞定方案"),
            (100, 575, 520, 905, p3_img, "LAB 03", "习惯进化", "Habit Shifts", "从搜答案到学会提问与审美把关"),
            (560, 575, 980, 905, p4_img, "LAB 04", "实用工具箱", "My Stack", "整理亲测留存的高频日常提示词"),
        ]

        for x0, y0, x1, y1, thumb_img, tag, title, en_title, desc in cards_data:
            draw_card(draw, [x0, y0, x1, y1], fill=CARD_BG, border=BORDER_COLOR, radius=20, shadow_offset=(5,5))
            
            # Thumbnail image (top half of card)
            th_w = x1 - x0 - 16
            th_h = 160
            resized_th = thumb_img.resize((th_w, th_h), Image.Resampling.LANCZOS)
            img.paste(resized_th, (x0 + 8, y0 + 8))
            draw.rectangle([x0+8, y0+8, x1-8, y0+8+th_h], outline=BORDER_COLOR, width=2)

            # Info (bottom half)
            draw.text((x0 + 20, y0 + 180), tag, font=font_tag, fill=ACCENT_ORANGE)
            draw.text((x0 + 20, y0 + 210), title, font=font_body_bold, fill=TEXT_CHARCOAL)
            draw.text((x0 + 180, y0 + 218), en_title, font=font_en_sub, fill=ACCENT_GREEN)
            draw.text((x0 + 20, y0 + 265), desc, font=font_small, fill=MUTED_TEXT)

        draw.text((WIDTH//2, 975), "每周 1 期真实实验报告 · 开放复现", font=font_body, fill=ACCENT_GREEN, anchor="mt")

    # SCENE 3: Issue #00 Announcement & Multi-channel Launch (Frames 77 to 114)
    else:
        draw_pill(draw, WIDTH//2, 70, "ISSUE #00 正式开张 · 创刊号首发", ACCENT_GREEN, "#FAF8F5", font_body_bold)
        
        # Featured Article Card
        draw_card(draw, [90, 135, WIDTH-90, 560], fill=CARD_BG, border=BORDER_COLOR, radius=24, shadow_offset=(7,7))
        draw.text((130, 165), "创刊宣言 / MANIFESTO", font=font_tag, fill=ACCENT_ORANGE)
        draw.text((WIDTH-130, 165), "2026.10 正式发布", font=font_badge, fill=MUTED_TEXT, anchor="rt")
        
        draw.text((WIDTH//2, 215), "你好，这里是《日常AI》", font=font_title_md, fill=TEXT_CHARCOAL, anchor="mt")
        draw.text((WIDTH//2, 285), "为什么我不关心大模型参数，只关心今晚吃什么？", font=font_body_bold, fill=ACCENT_ORANGE, anchor="mt")
        
        draw.line([130, 350, WIDTH-130, 350], fill="#EAE5DC", width=2)
        
        draw.text((130, 375), "• 冰箱剩菜 14 分钟破局：酸奶腌冻鸡片秒变嫩肉，番茄焖米饭", font=font_body, fill=TEXT_CHARCOAL)
        draw.text((130, 425), "• 告别参数崇拜：从“搜答案”到“抛情境”，让 AI 成为厨房室友", font=font_body, fill=TEXT_CHARCOAL)
        draw.text((130, 475), "• 随文附赠【万能日常提问模板】，复制即可直接抄作业", font=font_body, fill=ACCENT_GREEN)

        # Platform Matrix Card
        draw_card(draw, [90, 595, WIDTH-90, 935], fill="#F7F3EE", border=BORDER_COLOR, radius=24, shadow_offset=(7,7))
        draw.text((WIDTH//2, 625), "全网统一大本营与关注矩阵", font=font_title_md, fill=TEXT_CHARCOAL, anchor="mt")

        channels = [
            ("独立主站 (Web)", "0500005.xyz", "中英双语 / 完整长文与模板"),
            ("X (Twitter)", "@edailab", "核心提炼 / 视觉图文卡串联"),
            ("YouTube 频道", "@edai_lab", "60秒实操演示与习惯复盘"),
            ("WhatsApp", "+1 (502) 430-1078", "读者沟通 / 选题反馈与合作"),
        ]

        cy = 700
        for name, handle, note in channels:
            draw.text((140, cy), name, font=font_body_bold, fill=TEXT_CHARCOAL)
            draw.text((450, cy), handle, font=font_body_bold, fill=ACCENT_ORANGE)
            draw.text((700, cy + 4), note, font=font_small, fill=MUTED_TEXT)
            cy += 52

        draw.text((WIDTH//2, 980), "Welcome to Everyday AI Lab · Only about AI in real life.", font=font_en_sub, fill=MUTED_TEXT, anchor="mt")

    # Save frame
    frame_path = f"{frames_dir}/frame_{frame_idx:04d}.png"
    img.save(frame_path)

print(f"Generated {TOTAL_FRAMES} frames successfully!")
