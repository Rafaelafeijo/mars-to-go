"""Crop and export the approved NASA images at game sizes (IMAGES.md, ASSETS.md).

Usage: python3 -P -E tools/data/prepare_images.py assets-src apps/web/public/images
Only brightness/contrast/crop are allowed (ADR-0023); this script only crops and resizes.
"""
import os
import sys

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

# slug: (source file, crop box as fractions (left, top, right, bottom))
IMAGES = {
    "jezero-panorama": ("01-PIA24921.jpg", (0.56, 0.10, 0.97, 0.80)),
    "gale-sunset": ("02-PIA19400.tif", (0.0, 0.0, 1.0, 1.0)),
    "earth-from-mars": ("03-PIA17936.tif", (0.0, 0.0, 1.0, 1.0)),
    "sun-flare-x87": ("04-SVS14592.jpg", (0.0, 0.0, 1.0, 1.0)),
    "jezero-orbital": ("05-PIA23239.tif", (0.0, 0.0, 1.0, 1.0)),
    "rochette": ("06-PIA24840.tif", (0.22, 0.10, 0.92, 1.0)),
    "kodiak": ("07-PIA24802.tif", (0.0, 0.0, 1.0, 1.0)),
    "delta-front": ("08-PIA24925.jpg", (0.0, 0.02, 0.235, 0.56)),
    "moxie": ("09-PIA24203.tif", (0.0, 0.0, 1.0, 1.0)),
    "iss-lettuce": ("10-iss072e404269.jpg", (0.0, 0.0, 1.0, 1.0)),
}
WIDTHS = (480, 960, 1600)


def main(src: str, out: str, only: str | None = None) -> None:
    os.makedirs(out, exist_ok=True)
    for slug, (name, (l, t, r, b)) in IMAGES.items():
        if only and slug != only:
            continue
        with Image.open(os.path.join(src, name)) as im:
            im = im.convert("RGB")
            w, h = im.size
            im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
            for target in WIDTHS:
                if target > im.width and target != WIDTHS[0]:
                    continue  # never upscale beyond the first size
                scaled = im.copy()
                scaled.thumbnail((target, target * 10))
                path = os.path.join(out, f"{slug}-{target}.webp")
                scaled.save(path, "WEBP", quality=78, method=6)
                print(f"{path} {scaled.size} {os.path.getsize(path) // 1024} KB")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
