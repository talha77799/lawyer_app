from pathlib import Path
import cairosvg
base = Path('public')
src = base / 'vite.svg'
text = src.read_text(encoding='utf-8')
text = text.replace('<rect width="1200" height="1200" fill="#f0eee8"/>\n\n', '')
out_svg = base / 'wakeelhub-logo-transparent.svg'
out_png = base / 'wakeelhub-logo-transparent.png'
out_svg.write_text(text, encoding='utf-8')
cairosvg.svg2png(url=str(out_svg), write_to=str(out_png), output_width=2000, output_height=2000)
print('created', out_svg)
print('created', out_png)
