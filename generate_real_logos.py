import os
import io
import base64
from PIL import Image, ImageDraw

logo_src = r'C:\Users\dell\.gemini\antigravity-ide\brain\bfa4b62f-dceb-43ac-862c-8df4ea0c5949\wakeelhub_logo_1787760925545.jpg'
circle_src = r'C:\Users\dell\.gemini\antigravity-ide\brain\bfa4b62f-dceb-43ac-862c-8df4ea0c5949\wakeelhub_social_circle_1787760952744.jpg'
dest_dir = r'f:\vr-lawyer\vr-digital-frontend\public'

img = Image.open(logo_src).convert("RGBA")
w, h = img.size

# Flood fill outer background to make it transparent
pixels = img.load()
visited = set()
queue = []

def is_bg(p):
    r, g, b, a = p
    return r >= 235 and g >= 235 and b >= 235

for x in range(w):
    if is_bg(pixels[x, 0]):
        queue.append((x, 0))
    if is_bg(pixels[x, h-1]):
        queue.append((x, h-1))

for y in range(h):
    if is_bg(pixels[0, y]):
        queue.append((0, y))
    if is_bg(pixels[w-1, y]):
        queue.append((w-1, y))

while queue:
    cx, cy = queue.pop(0)
    if (cx, cy) in visited:
        continue
    visited.add((cx, cy))
    pixels[cx, cy] = (0, 0, 0, 0)
    for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
        nx, ny = cx + dx, cy + dy
        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
            if is_bg(pixels[nx, ny]):
                queue.append((nx, ny))

print("Logo background removed. Visited:", len(visited))

# Process Social Circle
c_img = Image.open(circle_src).convert("RGBA")
cw, ch = c_img.size
cpixels = c_img.load()
c_visited = set()
c_queue = []

for x in range(cw):
    if is_bg(cpixels[x, 0]):
        c_queue.append((x, 0))
    if is_bg(cpixels[x, ch-1]):
        c_queue.append((x, ch-1))

for y in range(ch):
    if is_bg(cpixels[0, y]):
        c_queue.append((0, y))
    if is_bg(cpixels[cw-1, y]):
        c_queue.append((cw-1, y))

while c_queue:
    cx, cy = c_queue.pop(0)
    if (cx, cy) in c_visited:
        continue
    c_visited.add((cx, cy))
    cpixels[cx, cy] = (0, 0, 0, 0)
    for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
        nx, ny = cx + dx, cy + dy
        if 0 <= nx < cw and 0 <= ny < ch and (nx, ny) not in c_visited:
            if is_bg(cpixels[nx, ny]):
                c_queue.append((nx, ny))

print("Circle background removed.")

# Save all PNG variants
img.save(os.path.join(dest_dir, 'wakeelhub-logo-transparent.png'))
img.save(os.path.join(dest_dir, 'wakeelhub-logo-tranparent.png'))
img.save(os.path.join(dest_dir, 'image.png'))

Image.open(logo_src).save(os.path.join(dest_dir, 'wakeelhub-logo.png'))

c_img.save(os.path.join(dest_dir, 'wakeelhub-social-circle-transparent.png'))
c_img.save(os.path.join(dest_dir, 'wakeelhubsocial-circle-transparent.png'))
Image.open(circle_src).save(os.path.join(dest_dir, 'wakeelhub-social-circle.png'))

# Save SVGs
buffered = io.BytesIO()
img.save(buffered, format="PNG")
logo_b64 = base64.b64encode(buffered.getvalue()).decode()

with open(os.path.join(dest_dir, 'vite.svg'), 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
  <image href="data:image/png;base64,{logo_b64}" width="{w}" height="{h}" />
</svg>''')

buffered_c = io.BytesIO()
c_img.save(buffered_c, format="PNG")
circle_b64 = base64.b64encode(buffered_c.getvalue()).decode()

with open(os.path.join(dest_dir, 'wakeelhub-icon.svg'), 'w', encoding='utf-8') as f:
    f.write(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cw} {ch}">
  <image href="data:image/png;base64,{circle_b64}" width="{cw}" height="{ch}" />
</svg>''')

print("All logo files successfully generated and saved!")
