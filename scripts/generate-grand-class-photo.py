#!/usr/bin/env python3
"""
scripts/generate-grand-class-photo.py
Generates the authentic, high-resolution Master Commemorative Class Matriculation Photograph
for Silicon Academy (Class of 2026), featuring the EXACT 48 student portraits + Teacher Yami.
"""

import json
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEMBERS_FILE = os.path.join(ROOT, "src/data/academy-members.json")
OUTPUT_WEBP = os.path.join(ROOT, "public/images/academy-grand-class-photo.webp")
OUTPUT_JPG = os.path.join(ROOT, "public/images/academy-grand-class-photo.jpg")
BG_PATH = "/Users/aidi/.gemini/antigravity/brain/98f2a4ca-9627-46d3-abf0-a1abece8f568/silicon_academy_campus_background_1792887421799.jpg"

FONT_SONG = "/System/Library/Fonts/Supplemental/Songti.ttc"
FONT_HEITI = "/System/Library/Fonts/STHeiti Medium.ttc"
FONT_ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"

def main():
    print("🎨 [generate-grand-class-photo] Starting master class photo synthesis...")
    with open(MEMBERS_FILE, "r", encoding="utf-8") as f:
        members = json.load(f)
    
    member_map = {m["id"]: m for m in members}
    print(f"Loaded {len(members)} canonical members.")

    # Target Dimensions (4K 16:9 Landscape)
    CANVAS_W = 3840
    CANVAS_H = 2160

    # 1. Background Setup
    if os.path.exists(BG_PATH):
        bg = Image.open(BG_PATH).convert("RGBA")
        bg = bg.resize((CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)
        # Apply gentle depth-of-field blur so background columns are stately yet soft
        bg = bg.filter(ImageFilter.GaussianBlur(radius=3))
        # Warm atmospheric tint so foreground cards pop with rich contrast
        tint = Image.new("RGBA", (CANVAS_W, CANVAS_H), (16, 14, 12, 100))
        bg = Image.alpha_composite(bg, tint)
    else:
        bg = Image.new("RGBA", (CANVAS_W, CANVAS_H), (24, 23, 21, 255))

    draw = ImageDraw.Draw(bg)

    # Typography
    font_title_main = ImageFont.truetype(FONT_SONG, 66)
    font_title_en = ImageFont.truetype(FONT_ARIAL, 26)
    
    font_card_id = ImageFont.truetype(FONT_ARIAL, 20)
    font_card_name = ImageFont.truetype(FONT_HEITI, 22)
    font_card_en = ImageFont.truetype(FONT_ARIAL, 17)
    font_card_logo = ImageFont.truetype(FONT_HEITI, 20)
    
    font_plaque_text = ImageFont.truetype(FONT_SONG, 26)
    font_plaque_en = ImageFont.truetype(FONT_ARIAL, 21)

    # 2. Top Header Ribbon (Grand Commencement Satin Banner)
    BANNER_H = 160
    header_overlay = Image.new("RGBA", (CANVAS_W, BANNER_H), (18, 17, 15, 235))
    bg.paste(header_overlay, (0, 0), header_overlay)
    
    # Gold accent double borders for the banner
    draw.line([(0, BANNER_H - 4), (CANVAS_W, BANNER_H - 4)], fill=(217, 160, 60, 255), width=3)
    draw.line([(0, BANNER_H), (CANVAS_W, BANNER_H)], fill=(160, 110, 30, 255), width=2)
    
    # Center Seal / Crest Badge
    seal_text = "🏫 硅基高等学院 · 首届新生入学典礼全体师生大合影"
    bbox_title = draw.textbbox((0, 0), seal_text, font=font_title_main)
    w_title = bbox_title[2] - bbox_title[0]
    draw.text(((CANVAS_W - w_title) // 2, 26), seal_text, font=font_title_main, fill=(255, 246, 225))
    
    sub_text = "SILICON ACADEMY · CLASS OF 2026 INAUGURAL COMMEMORATIVE MATRICULATION PHOTOGRAPH"
    bbox_sub = draw.textbbox((0, 0), sub_text, font=font_title_en)
    w_sub = bbox_sub[2] - bbox_sub[0]
    draw.text(((CANVAS_W - w_sub) // 2, 108), sub_text, font=font_title_en, fill=(230, 190, 120))

    # 3. Bottom Commemorative Brass Plaque
    PLAQUE_H = 125
    plaque_y = CANVAS_H - PLAQUE_H
    plaque_overlay = Image.new("RGBA", (CANVAS_W, PLAQUE_H), (18, 17, 15, 245))
    bg.paste(plaque_overlay, (0, plaque_y), plaque_overlay)
    
    draw.line([(0, plaque_y), (CANVAS_W, plaque_y)], fill=(217, 160, 60, 255), width=3)
    draw.line([(0, plaque_y + 4), (CANVAS_W, plaque_y + 4)], fill=(160, 110, 30, 255), width=2)

    plaque_l1 = "🏛️ 摄于：硅基学园主楼·罗马柱阶梯广场 | 校训：人机共生 · 各展所长 · 学以致用"
    bbox_p1 = draw.textbbox((0, 0), plaque_l1, font=font_plaque_text)
    w_p1 = bbox_p1[2] - bbox_p1[0]
    draw.text(((CANVAS_W - w_p1) // 2, plaque_y + 22), plaque_l1, font=font_plaque_text, fill=(255, 240, 210))

    plaque_l2 = "创校导师 Y老师 领衔 · 48位在册硅基特才全员到齐（49位在籍）· 硅基高等学院校务委员会 2026年秋 颁发"
    bbox_p2 = draw.textbbox((0, 0), plaque_l2, font=font_plaque_en)
    w_p2 = bbox_p2[2] - bbox_p2[0]
    draw.text(((CANVAS_W - w_p2) // 2, plaque_y + 68), plaque_l2, font=font_plaque_en, fill=(200, 185, 160))

    # 4. Five Tiers Arrangement (Exactly 49 Members: 10 + 10 + 10 + 10 + 9)
    tiers_config = [
        # Tier 5 (Top Tier standing high on steps - 10 members: Cinema & Audio & Broadcast)
        ["27", "28", "29", "30", "31", "32", "33", "34", "35", "36"],
        # Tier 4 (Tier 4 standing on steps - 10 members: Phantom Art & Creative Vision)
        ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26"],
        # Tier 3 (Tier 3 standing - 10 members: Royal Library & Search & Puppet)
        ["12", "13", "14", "15", "16", "37", "38", "39", "40", "41"],
        # Tier 2 (Tier 2 standing - 10 members: Student Council & Hackers & Heavy Industry)
        ["04", "05", "06", "08", "09", "10", "43", "45", "46", "47"],
        # Tier 1 (Front Row Seated / Honor Faculty & Core Leaders - 9 members)
        ["48", "44", "07", "01", "00", "03", "02", "11", "42"],
    ]

    # Verify all 49 members are in tiers
    all_assigned = [item for row in tiers_config for item in row]
    assert len(all_assigned) == 49, f"Expected 49 members, got {len(all_assigned)}"
    assert len(set(all_assigned)) == 49, "Duplicate IDs in tier configuration"
    print("✅ Verified 49 unique members allocated across 5 tiers.")

    # Grid Dimensions
    CONTENT_TOP = BANNER_H + 24
    CONTENT_BOTTOM = plaque_y - 20
    AVAILABLE_H = CONTENT_BOTTOM - CONTENT_TOP

    ROW_COUNT = len(tiers_config)
    ROW_GAP = 18
    CARD_H = int((AVAILABLE_H - (ROW_COUNT - 1) * ROW_GAP) / ROW_COUNT)  # ~330px
    PORTRAIT_H = CARD_H - 64  # Portrait image height ~266px

    DEPT_COLORS = {
        "faculty": (217, 119, 87),    # Terracotta
        "council": (16, 163, 127),    # Emerald
        "hackers": (77, 107, 254),    # Royal Blue
        "library": (30, 94, 58),      # Deep Green
        "art": (138, 43, 226),        # Purple
        "cinema": (224, 90, 43),      # Warm Orange
        "broadcast": (217, 119, 6),   # Amber
        "puppet": (5, 150, 105),      # Teal
        "industry": (75, 85, 99),     # Slate Grey
    }

    # Render each row
    for r_idx, row_ids in enumerate(tiers_config):
        col_count = len(row_ids)
        row_y = CONTENT_TOP + r_idx * (CARD_H + ROW_GAP)
        
        COL_GAP = 22
        CARD_W = int((CANVAS_W - 120 - (col_count - 1) * COL_GAP) / col_count)
        row_total_w = col_count * CARD_W + (col_count - 1) * COL_GAP
        start_x = (CANVAS_W - row_total_w) // 2

        is_front_row = (r_idx == ROW_COUNT - 1)

        for c_idx, mid in enumerate(row_ids):
            m = member_map[mid]
            card_x = start_x + c_idx * (CARD_W + COL_GAP)
            is_headmaster = (mid == "00")

            # 1. Outer Card Background (with collegiate wooden/gold frame feel)
            card_box = [(card_x, row_y), (card_x + CARD_W, row_y + CARD_H)]
            card_radius = 16
            
            # Card drop shadow
            shadow_offset = 6
            shadow_box = [(card_x + 2, row_y + shadow_offset), (card_x + CARD_W + 4, row_y + CARD_H + shadow_offset)]
            draw.rounded_rectangle(shadow_box, radius=card_radius + 2, fill=(0, 0, 0, 150))

            # Card fill
            bg_card_color = (255, 253, 248, 255) if not is_headmaster else (255, 249, 235, 255)
            border_card_color = (217, 160, 60, 255) if is_headmaster else (38, 34, 30, 240)
            border_width = 4 if is_headmaster else 2
            
            draw.rounded_rectangle(card_box, radius=card_radius, fill=bg_card_color, outline=border_card_color, width=border_width)

            # 2. Portrait Image
            img_path = os.path.join(ROOT, "public" + m["illustration"].lstrip("/"))
            if os.path.exists(img_path):
                try:
                    p_img = Image.open(img_path).convert("RGBA")
                    orig_w, orig_h = p_img.size
                    
                    target_portrait_w = CARD_W - 8
                    target_portrait_h = PORTRAIT_H
                    
                    crop_w = orig_w
                    crop_h = int(orig_w * (target_portrait_h / target_portrait_w))
                    if crop_h > orig_h:
                        crop_h = orig_h
                    
                    top_offset = int(orig_h * 0.02)
                    crop_box = (0, top_offset, orig_w, min(orig_h, top_offset + crop_h))
                    
                    p_cropped = p_img.crop(crop_box)
                    p_resized = p_cropped.resize((target_portrait_w, target_portrait_h), Image.Resampling.LANCZOS)
                    
                    p_mask = Image.new("L", (target_portrait_w, target_portrait_h), 0)
                    p_draw = ImageDraw.Draw(p_mask)
                    p_draw.rounded_rectangle([(0, 0), (target_portrait_w, target_portrait_h + 24)], radius=card_radius - 2, fill=255)
                    
                    bg.paste(p_resized, (card_x + 4, row_y + 4), p_mask)
                except Exception as e:
                    print(f"⚠️ Could not load portrait for {mid}: {e}")

            draw.line([(card_x + 4, row_y + PORTRAIT_H + 4), (card_x + CARD_W - 4, row_y + PORTRAIT_H + 4)], fill=(190, 180, 170, 200), width=1)

            # 3. Department Accent Color Pill at bottom
            dept_col = DEPT_COLORS.get(m["dept"], (100, 100, 100))
            accent_bar_h = 4
            draw.rectangle([(card_x + 6, row_y + PORTRAIT_H + 5), (card_x + CARD_W - 6, row_y + PORTRAIT_H + 5 + accent_bar_h)], fill=dept_col)

            # 4. Text Label: ID Pill + Chinese Name + English/Role
            id_text = f"#{m['id']}"
            draw.text((card_x + 10, row_y + PORTRAIT_H + 15), id_text, font=font_card_id, fill=(130, 120, 110))

            name_text = m["name_zh"]
            if is_headmaster:
                name_text = "Y老师 (创校导师)"
            
            draw.text((card_x + 58, row_y + PORTRAIT_H + 14), name_text, font=font_card_name, fill=(24, 23, 21))

            sub_name = m["model"] if len(m["model"]) <= 19 else m["model"][:17] + ".."
            if is_headmaster:
                sub_name = "Founder & Mentor"
            draw.text((card_x + 10, row_y + PORTRAIT_H + 39), sub_name, font=font_card_en, fill=(100, 95, 90))

            if is_headmaster:
                draw.text((card_x + CARD_W - 32, row_y + PORTRAIT_H + 14), "👑", font=font_card_name, fill=(217, 160, 60))

    print("💾 Saving final composite images...")
    final_rgb = bg.convert("RGB")
    final_rgb.save(OUTPUT_JPG, format="JPEG", quality=95, optimize=True)
    final_rgb.save(OUTPUT_WEBP, format="WEBP", quality=92, method=6)

    jpg_size = os.path.getsize(OUTPUT_JPG) / (1024 * 1024)
    webp_size = os.path.getsize(OUTPUT_WEBP) / (1024 * 1024)
    print(f"🎉 Master Class Photo successfully generated!")
    print(f"   JPG:  {OUTPUT_JPG} ({jpg_size:.2f} MB)")
    print(f"   WebP: {OUTPUT_WEBP} ({webp_size:.2f} MB)")

if __name__ == "__main__":
    main()
