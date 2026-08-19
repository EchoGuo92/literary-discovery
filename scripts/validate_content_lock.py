#!/usr/bin/env python3
import json, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
m=json.loads((ROOT/"data/content-lock.json").read_text(encoding="utf-8"))
for rel,meta in m["files"].items():
    raw=(ROOT/rel).read_bytes()
    got=hashlib.sha256(raw).hexdigest()
    assert got==meta["sha256"], f"CONTENT DRIFT: {rel}\nexpected {meta['sha256']}\ngot      {got}"
print("OK: frozen reader-facing content hashes match.")
