"""Generate web-sized copies on macOS; retain original photos for archival use."""
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[1]
for folder, sizes in [('headshots', [('portraits', 240)]), ('hoco-hoc-winners', [('gallery', 1600), ('thumbnails', 600)])]:
    for source in sorted((root / 'public' / folder).iterdir()):
        if source.suffix.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        for output, size in sizes:
            target = root / 'public' / 'optimized' / output / (source.stem + '.jpg')
            target.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', '-Z', str(size), str(source), '--out', str(target)], check=True, stdout=subprocess.DEVNULL)
print('Web-sized photo copies generated in public/optimized.')
