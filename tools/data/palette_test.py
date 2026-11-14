"""Color prototype for the 3D terrain (Phase 3B, before implementing).

Samples palettes from real Mars images (processed / enhanced color, as published by
NASA) and renders the same flat low-poly landscape with each palette, next to the
current one, so the team can choose without rework.

Usage: python3 -P -E tools/data/palette_test.py assets-src <out.jpg> <out.json>
"""
import json
import sys

from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None

# image file, region (fractions) for sky and for ground, label
SOURCES = [
    ("A", "PIA24921 · Jezero delta panorama (enhanced color)", "01-PIA24921.jpg", (0.60, 0.12, 0.95, 0.20), (0.55, 0.45, 0.97, 0.78)),
    ("B", "PIA24802 · Kodiak (enhanced color)", "07-PIA24802.tif", (0.10, 0.02, 0.90, 0.20), (0.05, 0.55, 0.95, 0.98)),
    ("C", "PIA24925 · delta front, Skinner Ridge (enhanced color)", "08-PIA24925.jpg", (0.02, 0.02, 0.20, 0.12), (0.02, 0.20, 0.23, 0.55)),
    ("D", "PIA23727 · Jezero, calibrated natural color", "11-PIA23727.jpg", (0.30, 0.02, 0.70, 0.25), (0.05, 0.55, 0.95, 0.98)),
]
# Same photo as A, with a stronger (allowed) saturation and contrast filter.
BOOSTED = ("E", "PIA24921 · same as A, saturation ×1.7 (filter)", "A", 1.7)
CURRENT = {"sky": "#d9a066", "ground": ["#a8492a", "#c06a3e", "#d98a55", "#e0a070", "#8a3a1e"]}


def hexc(rgb):
    return "#%02x%02x%02x" % tuple(int(v) for v in rgb[:3])


def region(im, box):
    w, h = im.size
    l, t, r, b = box
    return im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))


def palette(img, n):
    small = img.convert("RGB").copy()
    small.thumbnail((400, 400))
    q = small.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    cols = [tuple(pal[i * 3 : i * 3 + 3]) for _, i in counts]
    # dark to light
    return sorted(cols, key=lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2])


def boost(c, sat=1.18):
    """Small saturation lift so the flat 3D colors are not pale (filters are allowed; no AI)."""
    r, g, b = c
    m = (r + g + b) / 3
    return tuple(max(0, min(255, int(m + (v - m) * sat))) for v in c)


def scene(draw, x0, y0, w, h, sky, ground):
    """A flat low-poly landscape: sky, far butte, delta ridge, mid ground, near ground, rocks."""
    g = ground + [ground[-1]] * (5 - len(ground))
    draw.rectangle([x0, y0, x0 + w, y0 + h * 0.42], fill=sky)
    draw.ellipse([x0 + w * 0.78, y0 + h * 0.08, x0 + w * 0.82, y0 + h * 0.12], fill="#fff6e0")
    # far butte
    draw.polygon([(x0 + w * 0.62, y0 + h * 0.42), (x0 + w * 0.68, y0 + h * 0.27), (x0 + w * 0.86, y0 + h * 0.26), (x0 + w * 0.9, y0 + h * 0.42)], fill=g[1])
    # delta ridge
    draw.polygon([(x0, y0 + h * 0.46), (x0 + w * 0.15, y0 + h * 0.33), (x0 + w * 0.45, y0 + h * 0.36), (x0 + w * 0.6, y0 + h * 0.46)], fill=g[2])
    draw.polygon([(x0, y0 + h * 0.42), (x0 + w, y0 + h * 0.42), (x0 + w, y0 + h * 0.6), (x0, y0 + h * 0.6)], fill=g[3])
    draw.polygon([(x0, y0 + h * 0.6), (x0 + w, y0 + h * 0.55), (x0 + w, y0 + h), (x0, y0 + h)], fill=g[2])
    draw.polygon([(x0, y0 + h * 0.78), (x0 + w * 0.5, y0 + h * 0.7), (x0 + w, y0 + h * 0.82), (x0 + w, y0 + h), (x0, y0 + h)], fill=g[4])
    for rx, ry, s in [(0.2, 0.75, 0.05), (0.7, 0.68, 0.04), (0.45, 0.88, 0.06), (0.85, 0.9, 0.05)]:
        cx, cy, r = x0 + w * rx, y0 + h * ry, w * s
        draw.polygon([(cx - r, cy), (cx - r * 0.4, cy - r * 0.8), (cx + r * 0.6, cy - r * 0.6), (cx + r, cy)], fill=g[0])
    # a white module, for contrast with the base
    draw.rectangle([x0 + w * 0.42, y0 + h * 0.56, x0 + w * 0.56, y0 + h * 0.64], fill="#e9e1d8")


def main(src, out_img, out_json):
    options = {"current": {"label": "Current (invented)", **CURRENT}}
    for key, label, name, sky_box, ground_box in SOURCES:
        with Image.open(f"{src}/{name}") as im:
            sky = palette(region(im, sky_box), 3)
            ground = palette(region(im, ground_box), 6)
        options[key] = {"label": label, "sky": hexc(sky[len(sky) // 2]), "ground": [hexc(boost(c)) for c in ground[:5]], "_raw": (sky, ground)}
    key, label, base, sat = BOOSTED
    sky, ground = options[base]["_raw"]
    options[key] = {"label": label, "sky": hexc(boost(sky[len(sky) // 2], 1.5)), "ground": [hexc(boost(c, sat)) for c in ground[:5]]}
    for o in options.values():
        o.pop("_raw", None)

    W, H, pad = 420, 300, 16
    keys = list(options)
    board = Image.new("RGB", (len(keys) * (W + pad) + pad, H + 150), "#14100e")
    d = ImageDraw.Draw(board)
    for i, k in enumerate(keys):
        o = options[k]
        x = pad + i * (W + pad)
        scene(d, x, pad, W, H, o["sky"], o["ground"])
        d.text((x, H + pad + 8), f"{k}: {o['label']}", fill="#f3ece6")
        for j, c in enumerate([o["sky"]] + o["ground"]):
            d.rectangle([x + j * 48, H + pad + 30, x + j * 48 + 40, H + pad + 70], fill=c)
            d.text((x + j * 48, H + pad + 74), c, fill="#c4b5a8")
    board.save(out_img, quality=88)
    json.dump(options, open(out_json, "w"), indent=2)
    print(json.dumps(options, indent=2))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
