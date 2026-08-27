import os
import io
import base64
from PIL import Image, ImageDraw

base_dir = 'f:/vr-lawyer/vr-digital-frontend/public'
src_path = 'f:/vr-lawyer/Screenshot 2026-08-25 022116.png'
img = Image.open(src_path).convert("RGBA")
width, height = img.size

# Flood fill outer background only
img_transparent = img.copy()
pixels = img_transparent.load()

# Find outer background color from corners
corner_colors = [pixels[0,0], pixels[width-1, 0], pixels[0, height-1], pixels[width-1, height-1]]
print("Corner colors:", corner_colors)

# Queue for BFS flood fill
visited = set()
queue = []

def is_background_white(p):
    r, g, b, a = p
    return r >= 220 and g >= 220 and b >= 220

# Add all border pixels that are near-white to the queue
for x in range(width):
    if is_background_white(pixels[x, 0]):
        queue.append((x, 0))
    if is_background_white(pixels[x, height-1]):
        queue.append((x, height-1))

for y in range(height):
    if is_background_white(pixels[0, y]):
        queue.append((0, y))
    if is_background_white(pixels[width-1, y]):
        queue.append((width-1, y))

# Perform BFS flood fill
while queue:
    x, y = queue.pop(0)
    if (x, y) in visited:
        continue
    visited.add((x, y))
    
    # Set to transparent
    pixels[x, y] = (0, 0, 0, 0)
    
    for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
            if is_background_white(pixels[nx, ny]):
                queue.append((nx, ny))

print("Flood fill completed. Visited background pixels:", len(visited))

# Save proper transparent logo
img_transparent.save(os.path.join(base_dir, 'wakeelhub-logo-transparent.png'))
img_transparent.save(os.path.join(base_dir, 'image.png'))
img.save(os.path.join(base_dir, 'wakeelhub-logo.png'))

# Crop logo top part for icons (scales + pen nib rounded rectangle)
# Find bounding box of the top rounded rectangle badge
# The top badge starts near y=0 and goes down to where the text begins.
# Let's crop the badge area
badge_crop = img_transparent.crop((20, 20, width-20, int(height * 0.65)))

# Create clean square icon
bw, bh = badge_crop.size
max_dim = max(bw, bh) + 40
square_icon = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
square_icon.paste(badge_crop, ((max_dim - bw) // 2, (max_dim - bh) // 2))

# Create circular versions
mask = Image.new('L', (max_dim, max_dim), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, max_dim, max_dim), fill=255)

circle_trans = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
circle_trans.paste(square_icon, (0, 0), mask=mask)

circle_white = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 255))
circle_white.paste(square_icon, (0, 0), mask=mask)

circle_trans.save(os.path.join(base_dir, 'wakeelhub-social-circle-transparent.png'))
circle_trans.save(os.path.join(base_dir, 'wakeelhubsocial-circle-transparent.png'))
circle_white.save(os.path.join(base_dir, 'wakeelhub-social-circle.png'))

# Update SVGs
buffered = io.BytesIO()
img_transparent.save(buffered, format="PNG")
img_str = base64.b64encode(buffered.getvalue()).decode()
vite_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">
  <image href="data:image/png;base64,{img_str}" width="{width}" height="{height}" />
</svg>'''
with open(os.path.join(base_dir, 'vite.svg'), 'w', encoding='utf-8') as f:
    f.write(vite_svg)

buffered = io.BytesIO()
circle_trans.save(buffered, format="PNG")
icon_str = base64.b64encode(buffered.getvalue()).decode()
icon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {max_dim} {max_dim}">
  <image href="data:image/png;base64,{icon_str}" width="{max_dim}" height="{max_dim}" />
</svg>'''
with open(os.path.join(base_dir, 'wakeelhub-icon.svg'), 'w', encoding='utf-8') as f:
    f.write(icon_svg)

print("Proper flood fill script executed successfully!")
