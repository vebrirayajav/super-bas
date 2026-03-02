#!/usr/bin/env python3
"""
Apply Harley-Davidson automotive theme to BAS web app.
Transforms purple/pink/cyan palette → black/orange/chrome.
"""
import re
import sys

def apply_theme(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_len = len(content)

    # ================================================================
    # STEP 1: Protect data URIs (base64 images) from modification
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
    # STEP 2: Protect CSS selector patterns (backslash-escaped brackets)
    # These reference React-generated Tailwind classes — MUST stay original
    # Pattern: \[\#hexcode\] or \[#hexcode\] (with leading backslash)
    # ================================================================
    selectors = {}
    sel_idx = [0]
    def protect_sel(m):
        key = f'__CSS{sel_idx[0]:05d}__'
        selectors[key] = m.group(0)
        sel_idx[0] += 1
        return key
    # Match \[\#XXXXXX\] or \[#XXXXXX\] — must have \[ at start
    content = re.sub(r'\\\[\\?#[0-9a-fA-F]{3,8}\\\]', protect_sel, content)

    # ================================================================
    # STEP 3: Replace HEX color codes
    # ================================================================
    hex_map = [
        # === DARK BACKGROUNDS (purple → black/charcoal) ===
        ('#10002b', '#0d0d0d'),
        ('#0a0015', '#080808'),
        ('#0a0020', '#0a0a0a'),
        ('#1a0b2e', '#111111'),
        ('#1a0a3e', '#141414'),
        ('#0d0025', '#0a0a0a'),
        ('#240046', '#1a1a1a'),
        ('#3c096c', '#252525'),
        ('#5a189a', '#333333'),
        ('#7209b7', '#444444'),
        ('#7b2cbf', '#4a4a4a'),

        # === MAIN ACCENTS (purple/cyan/pink → Harley orange family) ===
        ('#7c3aed', '#FF6B00'),   # main purple → Harley orange
        ('#4cc9f0', '#FF8C00'),   # cyan → dark orange
        ('#f72585', '#FF6600'),   # pink → Harley orange
        ('#4361ee', '#E65100'),   # blue → deep orange
        ('#6366f1', '#F57C00'),   # indigo → Material orange-700
        ('#8b5cf6', '#FF8F00'),   # violet → amber-800
        ('#a855f7', '#FFA000'),   # light violet → amber-700
        ('#a78bfa', '#FFB300'),   # lavender → amber-600
        ('#c084fc', '#FFC107'),   # light purple → amber-500
        ('#818cf8', '#FF9800'),   # light indigo → orange-500
        ('#c77dff', '#FFB74D'),   # text color → amber-300
        ('#b5179e', '#E65100'),   # magenta → deep orange

        # === DEEPER VARIANTS (used in gradients, light mode) ===
        ('#4f46e5', '#E65100'),   # indigo-600 → deep orange
        ('#4338ca', '#BF360C'),   # indigo-700 → deep orange dark
        ('#312e81', '#3E2723'),   # indigo-900 → brown-900
        ('#1e1b4b', '#1C1917'),   # indigo-950 → stone-900
        ('#a5b4fc', '#FFB74D'),   # indigo-300 → amber-300

        # === LIGHT MODE PINK/VIOLET → ORANGE ===
        ('#ec4899', '#F57C00'),   # pink-500 → orange-700
        ('#db2777', '#E65100'),   # pink-700 → deep orange
        ('#9333ea', '#BF360C'),   # purple-600 → deep orange dark

        # === LIGHT MODE BG TINTS (cool → warm) ===
        ('#eef2ff', '#FFF3E0'),   # indigo-50 → orange-50
        ('#e0e7ff', '#FFE0B2'),   # indigo-100 → orange-100
        ('#c7d2fe', '#FFCC80'),   # indigo-200 → orange-200
        ('#f5f3ff', '#FFF8E1'),   # violet-50 → amber-50
        ('#ede9fe', '#FFF3E0'),   # violet-100 → orange-50
        ('#ddd6fe', '#FFE0B2'),   # violet-200 → orange-100
        ('#f0f4ff', '#FFFDE7'),   # cool white → warm white
        ('#e8ecf8', '#FFF8E1'),   # cool white → warm white
        ('#f0f2f8', '#FFF8E1'),   # cool white → warm white
        ('#f0f0ff', '#FFFBE6'),   # cool white → warm white

        # === LIGHT MODE BLUE/SKY → ORANGE ===
        ('#0ea5e9', '#FF8C00'),   # sky-500 → orange
        ('#0284c7', '#E65100'),   # sky-700 → deep orange
        ('#2563eb', '#E65100'),   # blue-600 → deep orange
        ('#1d4ed8', '#BF360C'),   # blue-700 → deep orange dark
        ('#1e40af', '#BF360C'),   # blue-800 → deep orange dark

        # === LIGHT MODE LIGHT ACCENT BGS ===
        ('#bae6fd', '#FFE0B2'),   # sky-200 → orange-100
        ('#e0f2fe', '#FFF3E0'),   # sky-100 → orange-50
        ('#fbcfe8', '#FFE0B2'),   # pink-100 → orange-100
        ('#fce7f3', '#FFF3E0'),   # pink-50 → orange-50
    ]

    for old_hex, new_hex in hex_map:
        content = re.sub(re.escape(old_hex), new_hex, content, flags=re.IGNORECASE)

    # ================================================================
    # STEP 4: Replace RGBA color values
    # ================================================================
    rgba_map = [
        # Accent conversions
        ('124,58,237',  '255,107,0'),    # purple → orange
        ('76,201,240',  '255,140,0'),    # cyan → orange
        ('247,37,133',  '255,102,0'),    # pink → orange
        ('67,97,238',   '230,81,0'),     # blue → deep orange
        ('99,102,241',  '245,124,0'),    # indigo → orange
        ('139,92,246',  '255,143,0'),    # violet → amber
        ('168,85,247',  '255,160,0'),    # light violet → amber
        ('79,70,229',   '230,81,0'),     # indigo-600 → deep orange
        ('236,72,153',  '245,124,0'),    # pink → orange
        # Background conversions
        ('16,0,43',     '13,13,13'),     # deep purple bg → black
        ('10,0,21',     '8,8,8'),        # darker bg → black
        ('26,11,46',    '18,18,18'),     # variant → dark gray
        ('36,0,70',     '26,26,26'),     # variant → dark gray
        ('60,9,108',    '37,37,37'),     # variant → gray
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

    print(f'  Applied to: {filepath}')
    print(f'  Protected {len(selectors)} CSS selectors, {len(data_uris)} data URIs')
    print(f'  File size: {original_len} → {len(content)} bytes')

def add_tailwind_overrides(filepath):
    """Add CSS override block for React-generated Tailwind classes."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    overrides = r'''
      /* ===== HARLEY-DAVIDSON — TAILWIND CLASS OVERRIDES ===== */
      /* These override React-generated Tailwind arbitrary value classes */

      /* Dark backgrounds */
      .bg-\[\#10002b\] { background-color: #0d0d0d !important; }
      .bg-\[\#1a0b2e\] { background-color: #111111 !important; }
      .bg-\[\#240046\] { background-color: #1a1a1a !important; }
      .bg-\[\#3c096c\] { background-color: #252525 !important; }
      .bg-\[\#5a189a\] { background-color: #333333 !important; }
      .bg-\[\#7209b7\] { background-color: #444444 !important; }
      .bg-\[\#7b2cbf\] { background-color: #4a4a4a !important; }

      /* Accent backgrounds */
      .bg-\[\#f72585\] { background-color: #FF6600 !important; }
      .bg-\[\#4361ee\] { background-color: #E65100 !important; }
      .bg-\[\#4cc9f0\] { background-color: #FF8C00 !important; }
      .bg-\[\#b5179e\] { background-color: #E65100 !important; }

      /* Text colors */
      .text-\[\#4cc9f0\] { color: #FF8C00 !important; }
      .text-\[\#f72585\] { color: #FF6600 !important; }
      .text-\[\#c77dff\] { color: #FFB74D !important; }
      .text-\[\#4361ee\] { color: #E65100 !important; }
      .text-\[\#10002b\] { color: #1C1917 !important; }

      /* Border colors */
      .border-\[\#4cc9f0\] { border-color: #FF8C00 !important; }
      .border-\[\#f72585\] { border-color: #FF6600 !important; }
      .border-\[\#4361ee\] { border-color: #E65100 !important; }
      .border-\[\#7209b7\] { border-color: #444444 !important; }
      .border-\[\#ef233c\] { border-color: #ef4444 !important; }
      .border-\[\#ff9e00\] { border-color: #FF8C00 !important; }

      /* Gradient stops — welcome card gets dark metallic orange */
      .from-\[\#240046\] { --tw-gradient-from: #1a0800 !important; }
      .from-\[\#3c096c\] { --tw-gradient-from: #2d1400 !important; }
      .from-\[\#10002b\] { --tw-gradient-from: #0d0d0d !important; }
      .from-\[\#4cc9f0\] { --tw-gradient-from: #FF8C00 !important; }
      .from-\[\#f72585\] { --tw-gradient-from: #FF6600 !important; }
      .from-\[\#4361ee\] { --tw-gradient-from: #E65100 !important; }
      .from-\[\#ff9e00\] { --tw-gradient-from: #FF6B00 !important; }

      .via-\[\#10002b\] { --tw-gradient-via: #0d0d0d !important; }
      .via-\[\#3c096c\] { --tw-gradient-via: #3d1c00 !important; }

      .to-\[\#10002b\] { --tw-gradient-to: #0d0d0d !important; }
      .to-\[\#240046\] { --tw-gradient-to: #1a1a1a !important; }
      .to-\[\#3c096c\] { --tw-gradient-to: #252525 !important; }
      .to-\[\#5a189a\] { --tw-gradient-to: #7c3300 !important; }
      .to-\[\#7209b7\] { --tw-gradient-to: #8B4513 !important; }
      .to-\[\#f72585\] { --tw-gradient-to: #FF6600 !important; }
      .to-\[\#ff6d00\] { --tw-gradient-to: #FF6B00 !important; }

      /* Shadows */
      .shadow-\[\#240046\] { --tw-shadow-color: rgba(0,0,0,0.3) !important; }
      .shadow-\[\#f72585\] { --tw-shadow-color: rgba(255,102,0,0.15) !important; }
      .shadow-\[\#ef233c\] { --tw-shadow-color: rgba(239,68,68,0.15) !important; }
      .shadow-purple-900 { --tw-shadow-color: rgba(0,0,0,0.15) !important; }

      /* Semi-transparent backgrounds */
      .bg-\[\#10002b\]\/50 { background-color: rgba(13,13,13,0.5) !important; }
      .bg-\[\#240046\]\/30 { background-color: rgba(26,26,26,0.3) !important; }
      .bg-\[\#240046\]\/40 { background-color: rgba(26,26,26,0.4) !important; }
      .bg-\[\#4cc9f0\]\/5 { background-color: rgba(255,140,0,0.05) !important; }
      .bg-\[\#4cc9f0\]\/10 { background-color: rgba(255,140,0,0.1) !important; }
      .bg-\[\#4cc9f0\]\/20 { background-color: rgba(255,140,0,0.2) !important; }
      .bg-\[\#f72585\]\/5 { background-color: rgba(255,102,0,0.05) !important; }
      .bg-\[\#f72585\]\/10 { background-color: rgba(255,102,0,0.1) !important; }
      .bg-\[\#f72585\]\/20 { background-color: rgba(255,102,0,0.2) !important; }
      .bg-\[\#4361ee\]\/5 { background-color: rgba(230,81,0,0.05) !important; }
      .bg-\[\#4361ee\]\/10 { background-color: rgba(230,81,0,0.1) !important; }
      .bg-\[\#4361ee\]\/20 { background-color: rgba(230,81,0,0.2) !important; }
      .bg-\[\#7209b7\]\/10 { background-color: rgba(68,68,68,0.1) !important; }
      .bg-\[\#ef233c\]\/10 { background-color: rgba(239,68,68,0.1) !important; }
      .bg-\[\#ef233c\]\/20 { background-color: rgba(239,68,68,0.2) !important; }

      /* Hover backgrounds */
      .hover\:bg-\[\#4cc9f0\]:hover { background-color: #FF9800 !important; }
      .hover\:bg-\[\#f72585\]:hover { background-color: #FF7700 !important; }
      .hover\:bg-\[\#4361ee\]:hover { background-color: #BF360C !important; }
      .hover\:bg-\[\#b5179e\]:hover { background-color: #BF360C !important; }
      .hover\:bg-\[\#4361ee\]\/20:hover,
      .hover\:bg-\[\#4361ee\]\/30:hover { background-color: rgba(230,81,0,0.15) !important; }
      .hover\:bg-\[\#7209b7\]\/20:hover { background-color: rgba(68,68,68,0.15) !important; }
      .hover\:bg-\[\#f72585\]\/10:hover,
      .hover\:bg-\[\#f72585\]\/20:hover { background-color: rgba(255,102,0,0.12) !important; }
      .hover\:bg-\[\#4cc9f0\]\/20:hover { background-color: rgba(255,140,0,0.15) !important; }

      /* Hover text */
      .hover\:text-\[\#4cc9f0\]:hover { color: #FFB300 !important; }
      .hover\:text-\[\#f72585\]:hover { color: #FF8800 !important; }
      .hover\:text-\[\#00f5d4\]:hover { color: #059669 !important; }
      .hover\:text-\[\#ff9e00\]:hover { color: #FF8C00 !important; }
      .hover\:text-\[\#10002b\]:hover { color: #1C1917 !important; }

      /* Hover borders */
      .hover\:border-\[\#4cc9f0\]\/20:hover,
      .hover\:border-\[\#4cc9f0\]\/30:hover,
      .hover\:border-\[\#4cc9f0\]\/40:hover { border-color: rgba(255,140,0,0.4) !important; }
      .hover\:border-\[\#f72585\]\/20:hover { border-color: rgba(255,102,0,0.35) !important; }
      .hover\:border-\[\#ff9e00\]\/50:hover { border-color: rgba(255,140,0,0.5) !important; }
      .hover\:border-\[\#4361ee\]:hover { border-color: #E65100 !important; }
      .hover\:border-indigo-500\/30:hover { border-color: rgba(245,124,0,0.3) !important; }

      /* Hover gradient */
      .hover\:from-\[\#4cc9f0\]\/5:hover { --tw-gradient-from: rgba(255,140,0,0.05) !important; }
      .hover\:to-\[\#f72585\]\/5:hover { --tw-gradient-to: rgba(255,102,0,0.05) !important; }

      /* Group hover backgrounds */
      .group:hover .group-hover\:bg-\[\#4cc9f0\] { background-color: #FF8C00 !important; }
      .group:hover .group-hover\:bg-\[\#4cc9f0\]\/20 { background-color: rgba(255,140,0,0.2) !important; }
      .group:hover .group-hover\:bg-\[\#4361ee\] { background-color: #E65100 !important; }
      .group:hover .group-hover\:bg-\[\#4361ee\]\/20 { background-color: rgba(230,81,0,0.2) !important; }
      .group:hover .group-hover\:bg-\[\#f72585\]\/20 { background-color: rgba(255,102,0,0.2) !important; }
      .group:hover .group-hover\:bg-\[\#7209b7\]\/20 { background-color: rgba(68,68,68,0.2) !important; }

      /* Group hover text */
      .group:hover .group-hover\:text-\[\#4cc9f0\] { color: #FF8C00 !important; }
      .group:hover .group-hover\:text-\[\#f72585\] { color: #FF6600 !important; }
      .group:hover .group-hover\:text-\[\#10002b\] { color: #0d0d0d !important; }

      /* Group hover border */
      .group:hover .group-hover\:border-\[\#4361ee\] { border-color: #E65100 !important; }

      /* Additional Tailwind utilities */
      .border-indigo-500 { border-color: #F57C00 !important; }
      .bg-indigo-500 { background-color: #F57C00 !important; }
      .text-indigo-300 { color: #FFB74D !important; }
      .text-indigo-400 { color: #FF9800 !important; }
      .hover\:text-indigo-300:hover { color: #FFB74D !important; }
      .hover\:text-indigo-400:hover { color: #FF9800 !important; }
      .hover\:bg-indigo-500\/40:hover { background-color: rgba(245,124,0,0.15) !important; }

      /* Shadow glow overrides */
      [class*="shadow-\[0_0_15px"] { box-shadow: 0 0 15px rgba(255,102,0,0.4) !important; }
      [class*="shadow-\[0_0_8px"] { box-shadow: 0 0 8px rgba(255,140,0,0.3) !important; }

'''

    content = content.replace('    </style>', overrides + '    </style>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Added Tailwind overrides to: {filepath}')

if __name__ == '__main__':
    files = sys.argv[1:] if len(sys.argv) > 1 else []
    for f in files:
        print(f'\n🏍️  Applying Harley-Davidson theme...')
        apply_theme(f)
        if 'index.html' in f:
            add_tailwind_overrides(f)
    print('\n✅ Done!')
