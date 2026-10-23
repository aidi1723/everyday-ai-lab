from PIL import Image, ImageDraw, ImageFont

# Load base image
base = Image.open('public/images/chillfirst-poster.png').convert('RGBA')
w, h = base.size

# Create working image
out = base.copy()
draw = ImageDraw.Draw(out)

# Background color palette
bg_cream = (250, 243, 230, 255)
bg_card = (255, 254, 250, 255)

# Fonts
font_title = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 52)
font_sub = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 20)
font_pill = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 16)
font_qr = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 14)

# 1. Clean Top Header Area (y: 30 to 190)
# Fill top with gradient/solid cream
for y in range(20, 195):
    draw.line([(0, y), (w, y)], fill=(250, 242, 228, 255))

# Draw English Header
title_text = "ChillFirst"
# textbbox
bbox_title = draw.textbbox((0, 0), title_text, font=font_title)
tw = bbox_title[2] - bbox_title[0]
draw.text(((w - tw) // 2, 45), title_text, fill=(45, 25, 20, 255), font=font_title)

sub_text = "Cyber Emotional First-Aid Station"
bbox_sub = draw.textbbox((0, 0), sub_text, font=font_sub)
sw = bbox_sub[2] - bbox_sub[0]
draw.text(((w - sw) // 2, 115), sub_text, fill=(70, 45, 35, 255), font=font_sub)

tag_text = "Zero moralizing. Just airtight counter-tactics."
font_tag = ImageFont.truetype('/System/Library/Fonts/Avenir Next.ttc', 15)
bbox_tag = draw.textbbox((0, 0), tag_text, font=font_tag)
tag_w = bbox_tag[2] - bbox_tag[0]
draw.text(((w - tag_w) // 2, 150), tag_text, fill=(130, 85, 65, 255), font=font_tag)

# 2. Pills Area (y: 620 to 770)
# Clean pills area
for y in range(620, 775):
    draw.line([(0, y), (w, y)], fill=(250, 243, 229, 255))

def draw_pill(d, xy, text, bg_color, text_color, font):
    x0, y0, x1, y1 = xy
    # shadow
    d.rounded_rectangle([x0+1, y0+2, x1+1, y1+2], radius=16, fill=(225, 215, 200, 200))
    # body
    d.rounded_rectangle([x0, y0, x1, y1], radius=16, fill=bg_color)
    # text
    tb = d.textbbox((0, 0), text, font=font)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    tx = (x0 + x1 - tw) // 2
    ty = (y0 + y1 - th) // 2 - 1
    d.text((tx, ty), text, fill=text_color, font=font)

# Pill 1 & 2 (Row 1)
p1_text = "100% On Your Side"
p2_text = "Tactical Comebacks"
p3_text = "432Hz Offline Acoustic Reset"

draw_pill(draw, (45, 645, 260, 685), p1_text, (250, 224, 155, 255), (120, 65, 10, 255), font_pill)
draw_pill(draw, (275, 645, 510, 685), p2_text, (190, 222, 195, 255), (35, 80, 50, 255), font_pill)
draw_pill(draw, (120, 705, 438, 745), p3_text, (200, 225, 245, 255), (30, 85, 130, 255), font_pill)

# 3. Bottom text area (under QR code, y: 955 to 1015)
for y in range(955, 1015):
    # keep inside card boundary if any
    draw.line([(40, y), (518, y)], fill=(255, 254, 250, 255))

qr_line1 = "Scan to Enter · 100% Offline & Private"
qr_line2 = "chill-first.vercel.app"

b1 = draw.textbbox((0, 0), qr_line1, font=font_qr)
w1 = b1[2] - b1[0]
draw.text(((w - w1) // 2, 960), qr_line1, fill=(60, 40, 35, 255), font=font_qr)

font_url = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', 13)
b2 = draw.textbbox((0, 0), qr_line2, font=font_url)
w2 = b2[2] - b2[0]
draw.text(((w - w2) // 2, 982), qr_line2, fill=(160, 110, 75, 255), font=font_url)

out.save('public/images/chillfirst-poster-en.png')
print("Successfully generated public/images/chillfirst-poster-en.png")
