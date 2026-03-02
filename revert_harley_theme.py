#!/usr/bin/env python3
"""
Revert Harley-Davidson theme back to original purple/pink/cyan theme.
Exact inverse of apply_harley_theme.py
"""
import re
import sys

def revert_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)

    # ================================================================
    # STEP 1: Protect data URIs
    # ================================================================
    data_uris = {}
    uri_idx = [0]
    def protect_uri(m):
        key = f'__URI{uri_idx[0]:05d}__'
        data_uris[key] = m.group(0)
        uri_idx[0] += 1
        return key
    content = re.sub(r"data:image/[^'\";\s]+", protect_uri, content)

    # ================================================================
    # STEP 2: Protect CSS selector patterns
    # ================================================================
    selectors = {}
    sel_idx = [0]
    def protect_sel(m):
        key = f'__CSS{sel_idx[0]:05d}__'
        selectors[key] = m.group(0)
        sel_idx[0] += 1
        return key
    content = re.sub(r'\\\[\\?#[0-9a-fA-F]{3,8}\\\]', protect_sel, content)

    # ================================================================
    # STEP 3: Reverse HEX color codes (Harley → Original)
    # ================================================================
    hex_map = [
        # === DARK BACKGROUNDS (black/charcoal → purple) ===
        # Order matters: more specific first, then general
        ('#080808', '#0a0015'),
        ('#0a0a0a', '#0d0025'),  # used for both #0a0020 and #0d0025
        ('#111111', '#1a0b2e'),
        ('#141414', '#1a0a3e'),
        ('#0d0d0d', '#10002b'),
        ('#1a1a1a', '#240046'),
        ('#252525', '#3c096c'),
        ('#333333', '#5a189a'),
        ('#444444', '#7209b7'),
        ('#4a4a4a', '#7b2cbf'),

        # === MAIN ACCENTS (Harley orange → original) ===
        # Must go specific→general to avoid double-replacing
        ('#FF6B00', '#7c3aed'),   # Harley orange → main purple
        ('#FF8C00', '#4cc9f0'),   # dark orange → cyan
        ('#FF6600', '#f72585'),   # Harley orange → pink
        ('#E65100', '#4361ee'),   # deep orange → blue
        ('#F57C00', '#6366f1'),   # orange-700 → indigo
        ('#FF8F00', '#8b5cf6'),   # amber-800 → violet
        ('#FFA000', '#a855f7'),   # amber-700 → light violet
        ('#FFB300', '#a78bfa'),   # amber-600 → lavender
        ('#FFC107', '#c084fc'),   # amber-500 → light purple
        ('#FF9800', '#818cf8'),   # orange-500 → light indigo
        ('#FFB74D', '#c77dff'),   # amber-300 → text color

        # === DEEPER VARIANTS ===
        ('#BF360C', '#4338ca'),   # deep orange dark → indigo-700
        ('#3E2723', '#312e81'),   # brown-900 → indigo-900
        ('#1C1917', '#1e1b4b'),   # stone-900 → indigo-950

        # === LIGHT MODE PINK/VIOLET ===
        # These were mapped FROM distinct values TO distinct values

        # === LIGHT MODE BG TINTS (warm → cool) ===
        ('#FFF3E0', '#eef2ff'),   # orange-50 → indigo-50
        ('#FFE0B2', '#e0e7ff'),   # orange-100 → indigo-100
        ('#FFCC80', '#c7d2fe'),   # orange-200 → indigo-200
        ('#FFF8E1', '#f5f3ff'),   # amber-50 → violet-50
        ('#FFFDE7', '#f0f4ff'),   # warm white → cool white
        ('#FFFBE6', '#f0f0ff'),   # warm white → cool white
    ]

    for old_hex, new_hex in hex_map:
        content = re.sub(re.escape(old_hex), new_hex, content, flags=re.IGNORECASE)

    # ================================================================
    # STEP 4: Reverse RGBA color values
    # ================================================================
    rgba_map = [
        ('255,107,0',   '124,58,237'),    # orange → purple
        ('255,140,0',   '76,201,240'),    # orange → cyan
        ('255,102,0',   '247,37,133'),    # orange → pink
        ('230,81,0',    '67,97,238'),     # deep orange → blue
        ('245,124,0',   '99,102,241'),    # orange → indigo
        ('255,143,0',   '139,92,246'),    # amber → violet
        ('255,160,0',   '168,85,247'),    # amber → light violet
        # Background conversions
        ('13,13,13',    '16,0,43'),       # black → deep purple
        ('8,8,8',       '10,0,21'),       # black → darker
        ('18,18,18',    '26,11,46'),      # gray → variant
        ('26,26,26',    '36,0,70'),       # gray → variant
        ('37,37,37',    '60,9,108'),      # gray → variant
    ]

    for old_rgb, new_rgb in rgba_map:
        content = content.replace(old_rgb, new_rgb)

    # ================================================================
    # STEP 5: Restore protected patterns
    # ================================================================
    for key, val in selectors.items():
        content = content.replace(key, val)
    for key, val in data_uris.items():
        content = content.replace(key, val)

    # ================================================================
    # STEP 6: Write result
    # ================================================================
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'  Reverted: {filepath}')
    print(f'  Protected {len(selectors)} CSS selectors, {len(data_uris)} data URIs')
    print(f'  File size: {original_len} → {len(content)} bytes')

def remove_harley_overrides(filepath):
    """Remove the Harley-Davidson Tailwind class override block from index.html."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the entire Harley Tailwind override block
    pattern = r'\n\s*/\* ===== HARLEY-DAVIDSON — TAILWIND CLASS OVERRIDES =====.*?(?=\n\s*</style>)'
    content = re.sub(pattern, '', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Removed Harley overrides from: {filepath}')

if __name__ == '__main__':
    files = sys.argv[1:] if len(sys.argv) > 1 else []
    for f in files:
        print(f'\n🔄 Reverting Harley-Davidson theme...')
        revert_theme(f)
        if 'index.html' in f:
            remove_harley_overrides(f)
    print('\n✅ Done!')
