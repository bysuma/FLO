"""Generate Latin webfont subsets; originals remain available for other scripts.
Run with Python fonttools[woff] installed: python3 scripts/generate-fonts.py
"""
from pathlib import Path
from fontTools import subset

root = Path(__file__).resolve().parent.parent / 'public' / 'fonts'
for source in root.glob('*.woff2'):
    if '.latin.' in source.name:
        continue
    subset.main([
        str(source),
        f'--output-file={source.with_suffix(".latin.woff2")}',
        '--flavor=woff2',
        '--unicodes=U+0000-00FF,U+2000-206F,U+2122',
    ])
