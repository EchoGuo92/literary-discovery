#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
books=json.loads((ROOT/"data/books.json").read_text())
writers=json.loads((ROOT/"data/writers.json").read_text())
paths=json.loads((ROOT/"data/recommendation_paths.json").read_text())
sources=json.loads((ROOT/"data/sources.json").read_text())

book_ids={x["id"] for x in books}
writer_ids={x["id"] for x in writers}
source_ids={x["id"] for x in sources}
assert len(book_ids)==len(books), "Duplicate book id"
assert len(writer_ids)==len(writers), "Duplicate writer id"

for b in books:
    assert b["writer_id"] in writer_ids, f'Unknown writer for {b["id"]}'
    assert b["premise"].strip() and b["special"].strip() and b["mood"].strip()
    for sid in b.get("source_ids",[]): assert sid in source_ids, f"Unknown source {sid}"

roles=["BRIDGE","EXPANSION","EXPLORE"]
for p in paths:
    assert p["anchor_id"] in writer_ids
    recs=p["recommendations"]
    assert len(recs)==3, f'{p["anchor"]}: expected 3 recs'
    assert [r["role"] for r in recs]==roles, f'{p["anchor"]}: role order invalid'
    assert len({r["book_id"] for r in recs})==3, f'{p["anchor"]}: duplicate book inside set'
    for r in recs:
        assert r["book_id"] in book_ids
        assert r["bridge"].strip()
        if r["bridge_type"]=="HISTORICAL_CONNECTION":
            assert r.get("source_ids"), f'{p["anchor"]}->{r["book_id"]}: historical edge missing source'
        for sid in r.get("source_ids",[]): assert sid in source_ids, f"Unknown source {sid}"

print(f"OK: {len(paths)} anchors / {sum(len(p['recommendations']) for p in paths)} recommendation edges / {len(books)} books / {len(writers)} writers / {len(sources)} sources")
