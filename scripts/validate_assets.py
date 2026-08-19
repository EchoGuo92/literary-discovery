#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]

books=json.loads((ROOT/"data/books.json").read_text(encoding="utf-8"))
writers={w["id"]:w for w in json.loads((ROOT/"data/writers.json").read_text(encoding="utf-8"))}
paths=json.loads((ROOT/"data/recommendation_paths.json").read_text(encoding="utf-8"))
manifest=json.loads((ROOT/"data/writer-portrait-manifest.json").read_text(encoding="utf-8"))
book_by_id={b["id"]:b for b in books}

book_ids=[]
writer_ids=[]
for p in paths:
    for r in p["recommendations"]:
        bid=r["book_id"]
        if bid not in book_ids: book_ids.append(bid)
        wid=book_by_id[bid]["writer_id"]
        if wid not in writer_ids: writer_ids.append(wid)

errors=[]
for bid in book_ids:
    f=ROOT/"assets/heroes"/f"{bid}.webp"
    if not f.exists() or f.stat().st_size < 500:
        errors.append(f"missing/invalid final hero: {bid}")

for wid in writer_ids:
    w=writers[wid]
    img=w.get("image") or {}
    local=(img.get("local_path") or "").replace("./","")
    if not local:
        errors.append(f"writer has no local portrait: {wid}")
        continue
    if local.startswith("http"):
        errors.append(f"remote portrait prohibited: {wid}")
        continue
    f=ROOT/local
    if not f.exists() or f.stat().st_size < 2000:
        errors.append(f"missing/invalid portrait: {wid} -> {local}")
        continue
    try:
        im=Image.open(f)
        if im.width < 400 or im.height < 400:
            errors.append(f"portrait resolution too small: {wid} -> {im.size}")
    except Exception:
        errors.append(f"portrait unreadable: {wid}")
    if wid not in manifest.get("portraits",{}):
        errors.append(f"portrait missing from manifest: {wid}")

if len(writer_ids)!=14:
    errors.append(f"expected 14 unique recommendation writers, got {len(writer_ids)}")

if errors:
    raise SystemExit("ASSET VALIDATION FAILED\n- "+"\n- ".join(errors))
print(f"OK: {len(book_ids)} local hero assets / {len(writer_ids)} approved local writer portraits / no remote portrait dependencies.")
