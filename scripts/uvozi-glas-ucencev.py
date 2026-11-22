#!/usr/bin/env python3
"""Uvoz anonimnega CSV izvoza ankete (ki ga pošlje šola) v sloj Glas učencev.

Skripta ne bere odgovorov iz Google Forms ali konektorja — samo lokalno datoteko.
E-naslove in stolpce z e-pošto zavrže. Razred in ulica smeta v javni izhod.
Prosta besedila grejo v javni geojson samo, če so v datoteki pregleda označena
kot odobreno. Prag MIN_ODGOVOROV=1 (brez združevanja v »ostalo«); lahko ga
vrnemo npr. na 5.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

# Prag za prikaz skupine (ulica / razred / kraj). 1 = pokaži vse; za strožji
# prag nastavi npr. 5. Skupin pod pragom ne združujemo v »ostalo«.
MIN_ODGOVOROV = 1

EMAIL_HEADER = re.compile(r"e-?pošt|e-?mail|\bemail\b|\bmail\b", re.I)
EMAIL_VALUE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)

# Znane točke iz javnega šolskega zemljevida (ne izmišljujemo novih koordinat).
KNOWN_PLACES = [
    {"id": "serkovo", "ime": "Igrišče na Šerkovi", "aliases": (
        "šerkovo", "serkovo", "šerkovi", "serkovi", "šerkovem", "serkovem",
        "šerkovega", "serkovega", "igrišče na šerkovi", "igrisce na serkovi",
        "šerkova", "serkova"
    ), "lon": 14.52195, "lat": 46.06177},
    {"id": "filipovo", "ime": "Filipovo igrišče", "aliases": (
        "filipovo", "filipovem", "filipovega"
    ), "lon": 14.52397, "lat": 46.06457},
    {"id": "sola", "ime": "OŠ Savsko naselje", "aliases": (
        "pri šoli", "pri soli", "os savsko", "oša savsko", "šola", "sola"
    ), "lon": None, "lat": None, "address": "Matjaževa ulica 4"},
]

# Prosta vprašanja (podnizi v naslovu stolpca).
FREE_TEXT_HINTS = (
    "kje in kdaj se to zgodi",
    "izogneš",
    "spremenil ali spremenila eno stvar",
    "spremenil/a eno stvar",
    "kakšen dogodek ali akcijo",
)

COL_HINTS = {
    "razred": ("kateri razred",),
    "zivi": ("živiš v savskem", "zivis v savskem"),
    "ulica": ("na kateri ulici", "kateri ulici"),
    "ocena_naselja": ("kako ti je všeč naše naselje", "kako ti je vsec nase naselje"),
    "vsec": ("najbolj všeč", "najbolj vsec"),
    "moti": ("najbolj moti",),
    "ocena_poti": ("varna je tvoja pot",),
    "druzzenje": ("najraje družiš", "najraje druzis"),
    "manjka": ("najbolj manjka",),
    "dogodki": ("katerih dogodkov",),
    "pomoc": ("bi pomagal",),
    "pomoc_pri": ("pri čem bi najraje pomagal", "pri cem bi najraje pomagal"),
    "obvescanje": ("kako zdaj izveš", "kako zdaj izves"),
}


def fold(text: str) -> str:
    text = (text or "").strip().casefold()
    trans = str.maketrans("čćšžđ", "ccszd")
    return text.translate(trans)


def is_email_header(name: str) -> bool:
    return bool(EMAIL_HEADER.search(name or ""))


def strip_emails(value: str) -> str:
    return EMAIL_VALUE.sub("", value or "").strip()


def find_col(headers, hints, exclude=()):
    ex = tuple(fold(x) for x in exclude)
    hints_f = tuple(fold(h) for h in hints)
    for h in headers:
        fh = fold(h)
        if any(fh == e or fh.startswith(e + " ") for e in ex):
            continue
        for hint in hints_f:
            if hint in fh:
                return h
    return None


def split_multi(value: str):
    if not value:
        return []
    parts = re.split(r"[,;|]|\n", value)
    return [p.strip() for p in parts if p.strip() and p.strip() != "Other"]


def parse_score(value: str):
    if value is None or str(value).strip() == "":
        return None
    m = re.search(r"(\d+(?:[.,]\d+)?)", str(value).replace(",", "."))
    if not m:
        return None
    n = float(m.group(1))
    if 1 <= n <= 5:
        return n
    return None


def text_id(question: str, text: str) -> str:
    raw = (question or "").strip() + "\n" + (text or "").strip()
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:12]


def mean(values):
    vals = [v for v in values if v is not None]
    if not vals:
        return None
    return round(sum(vals) / len(vals), 2)


def street_centroids(addresses):
    buckets = defaultdict(list)
    for a in addresses or []:
        label = (a.get("label") or "").strip()
        m = re.match(r"^(.+?)\s+\d+", label)
        street = m.group(1).strip() if m else label
        if not street:
            continue
        buckets[street].append((float(a["longitude"]), float(a["latitude"])))
    out = {}
    for street, pts in buckets.items():
        lon = sum(p[0] for p in pts) / len(pts)
        lat = sum(p[1] for p in pts) / len(pts)
        out[street] = (lon, lat)
        out[fold(street)] = (lon, lat)
    return out


def resolve_school(addresses):
    for a in addresses or []:
        if (a.get("label") or "").strip() == "Matjaževa ulica 4":
            return float(a["longitude"]), float(a["latitude"])
    return None


def match_place(text, places):
    f = fold(text)
    best = None
    for p in places:
        for alias in p["aliases"]:
            if fold(alias) in f and (best is None or len(alias) > len(best["alias"])):
                best = {"place": p, "alias": alias}
    return best["place"] if best else None


def match_street_point(text, centroids):
    f = fold(text)
    best = None
    for key, xy in centroids.items():
        # keys include both original and folded; skip odd short keys
        if len(key) < 5:
            continue
        fk = fold(key)
        if fk in f and (best is None or len(fk) > len(best[0])):
            best = (fk, xy)
    return best[1] if best else None


def map_columns(headers):
    cols = {}
    for key, hints in COL_HINTS.items():
        cols[key] = find_col(headers, hints)
    # »najbolj moti« checkbox vs. free-text »Kje in kdaj«
    moti = cols.get("moti")
    if moti and any(h in fold(moti) for h in ("kje in kdaj", "izberi tisto")):
        cols["moti"] = find_col(headers, COL_HINTS["moti"], exclude=(moti,))
    cols["prosta"] = [
        h for h in headers
        if any(fold(hint) in fold(h) for hint in FREE_TEXT_HINTS) and not is_email_header(h)
    ]
    return cols


def residence_street(row, cols):
    ulica = split_multi(row.get(cols["ulica"]) or "") if cols.get("ulica") else []
    if ulica:
        return ulica
    zivi = (row.get(cols["zivi"]) or "").strip() if cols.get("zivi") else ""
    fz = fold(zivi)
    if "bežigrad" in fz or "bezigrad" in fz:
        return ["Bežigrad (blizu)"]
    if fz.startswith("ne"):
        return ["zunaj naselja"]
    return ["ni navedeno"]


def add_counter(store, key, items):
    if key not in store:
        store[key] = Counter()
    for it in items:
        store[key][it] += 1


def threshold_items(counter: Counter):
    return {k: v for k, v in counter.items() if v >= MIN_ODGOVOROV}


def group_stats(rows, score_keys):
    out = {"n": len(rows)}
    for key in score_keys:
        out[key] = mean([r.get(key) for r in rows])
    return out


def main(argv=None):
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", required=True, help="Anonimni izvoz, ki ga pošlje šola")
    parser.add_argument("--izhod", default=str(root / "superzemljevid" / "glas-ucencev.geojson"))
    parser.add_argument("--pregled", default="", help="Zasebna datoteka za učiteljev pregled prostih odgovorov (ne v javni repo)")
    parser.add_argument("--addresses", default=str(root / "superzemljevid" / "addresses.json"))
    parser.add_argument("--povzetek", default=None, help="Ročni kratki povzetek (sicer ohrani obstoječega ali pusti prazno)")
    args = parser.parse_args(argv)

    with open(args.csv, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        email_cols = [h for h in headers if is_email_header(h)]
        keep = [h for h in headers if h not in email_cols]
        rows_raw = []
        for row in reader:
            cleaned = {}
            for h in keep:
                cleaned[h] = strip_emails(row.get(h) or "")
            rows_raw.append(cleaned)

    cols = map_columns(keep)
    addresses = []
    addr_path = Path(args.addresses)
    if addr_path.is_file():
        addresses = json.loads(addr_path.read_text(encoding="utf-8"))
    centroids = street_centroids(addresses)
    school = resolve_school(addresses)
    places = []
    for p in KNOWN_PLACES:
        q = dict(p)
        if q["lon"] is None and q.get("address") and school:
            q["lon"], q["lat"] = school
        if q["lon"] is not None:
            places.append(q)

    records = []
    free_items = []
    for row in rows_raw:
        rec = {
            "ulice": residence_street(row, cols),
            "razred": (row.get(cols["razred"]) or "").strip() if cols.get("razred") else "",
            "ocena_naselja": parse_score(row.get(cols["ocena_naselja"]) if cols.get("ocena_naselja") else ""),
            "ocena_poti": parse_score(row.get(cols["ocena_poti"]) if cols.get("ocena_poti") else ""),
            "vsec": split_multi(row.get(cols["vsec"]) or "") if cols.get("vsec") else [],
            "moti": split_multi(row.get(cols["moti"]) or "") if cols.get("moti") else [],
            "druzzenje": split_multi(row.get(cols["druzzenje"]) or "") if cols.get("druzzenje") else [],
            "manjka": split_multi(row.get(cols["manjka"]) or "") if cols.get("manjka") else [],
            "dogodki": split_multi(row.get(cols["dogodki"]) or "") if cols.get("dogodki") else [],
            "pomoc": (row.get(cols["pomoc"]) or "").strip() if cols.get("pomoc") else "",
            "pomoc_pri": split_multi(row.get(cols["pomoc_pri"]) or "") if cols.get("pomoc_pri") else [],
            "obvescanje": split_multi(row.get(cols["obvescanje"]) or "") if cols.get("obvescanje") else [],
        }
        records.append(rec)
        for h in cols["prosta"]:
            text = (row.get(h) or "").strip()
            if text:
                free_items.append({
                    "id": text_id(h, text),
                    "vprasanje": h,
                    "besedilo": text,
                    "odobreno": False,
                })

    # Dedup identical texts (same id), keep one entry.
    unique_free = {}
    for item in free_items:
        unique_free[item["id"]] = item
    free_items = list(unique_free.values())

    approved_ids = set()
    existing_povzetek = ""
    pregled_path = Path(args.pregled) if args.pregled else None
    if pregled_path and pregled_path.is_file():
        prev = json.loads(pregled_path.read_text(encoding="utf-8"))
        existing_povzetek = prev.get("povzetek") or ""
        by_id = {x.get("id"): x for x in prev.get("besedila") or [] if x.get("id")}
        for item in free_items:
            old = by_id.get(item["id"])
            if old and old.get("odobreno"):
                item["odobreno"] = True
                approved_ids.add(item["id"])
    else:
        approved_ids = {i["id"] for i in free_items if i.get("odobreno")}

    if pregled_path:
        pregled_path.parent.mkdir(parents=True, exist_ok=True)
        pregled_path.write_text(json.dumps({
            "opis": "Zasebni pregled prostih odgovorov. V javni sloj gre samo, kar ima odobreno: true. Te datoteke ne dajaj v javni repo.",
            "povzetek": args.povzetek if args.povzetek is not None else existing_povzetek,
            "besedila": free_items,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # Existing public povzetek if not overridden
    izhod = Path(args.izhod)
    if args.povzetek is not None:
        povzetek = args.povzetek
    else:
        povzetek = existing_povzetek
        if not povzetek and izhod.is_file():
            try:
                prev_g = json.loads(izhod.read_text(encoding="utf-8"))
                povzetek = (prev_g.get("properties") or {}).get("povzetek") or ""
            except json.JSONDecodeError:
                povzetek = ""

    by_street = defaultdict(list)
    by_class = defaultdict(list)
    for rec in records:
        by_class[rec["razred"] or "ni navedeno"].append(rec)
        for ul in rec["ulice"]:
            by_street[ul].append(rec)

    def pack_groups(mapping, name_key):
        packed = []
        for name, recs in mapping.items():
            if len(recs) < MIN_ODGOVOROV:
                continue
            vsec, moti = Counter(), Counter()
            for r in recs:
                vsec.update(r["vsec"])
                moti.update(r["moti"])
            packed.append({
                name_key: name,
                "n": len(recs),
                "ocena_naselja": mean([r["ocena_naselja"] for r in recs]),
                "ocena_poti": mean([r["ocena_poti"] for r in recs]),
                "vsec": dict(vsec),
                "moti": dict(moti),
            })
        packed.sort(key=lambda x: (-x["n"], x[name_key]))
        return packed

    ulice = pack_groups(by_street, "ulica")
    razredi = pack_groups(by_class, "razred")

    dogodki, pomoc, pomoc_pri, manjka, obvescanje = Counter(), Counter(), Counter(), Counter(), Counter()
    druzzenje, izogib = Counter(), Counter()
    for rec in records:
        dogodki.update(rec["dogodki"])
        if rec["pomoc"]:
            pomoc[rec["pomoc"]] += 1
        pomoc_pri.update(rec["pomoc_pri"])
        manjka.update(rec["manjka"])
        obvescanje.update(rec["obvescanje"])
        druzzenje.update(rec["druzzenje"])

    # Izogibanje: samo prepoznani kraji, brez surovega besedila.
    for item in free_items:
        if "izognes" in fold(item["vprasanje"]):
            place = match_place(item["besedilo"], places)
            if place:
                izogib[place["ime"]] += 1

    features = []

    def point_feature(lon, lat, props):
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [round(lon, 6), round(lat, 6)]},
            "properties": props,
        })

    for u in ulice:
        xy = centroids.get(u["ulica"]) or centroids.get(fold(u["ulica"]))
        if not xy:
            continue
        point_feature(xy[0], xy[1], {
            "vrsta": "ulica",
            "ime": u["ulica"],
            "n": u["n"],
            "ocena_naselja": u["ocena_naselja"],
            "ocena_poti": u["ocena_poti"],
            "vsec": u["vsec"],
            "moti": u["moti"],
        })

    for name, n in druzzenje.items():
        if n < MIN_ODGOVOROV:
            continue
        place = match_place(name, places)
        if not place:
            continue
        point_feature(place["lon"], place["lat"], {
            "vrsta": "druzzenje",
            "ime": place["ime"],
            "glasovi": n,
        })

    for name, n in izogib.items():
        if n < MIN_ODGOVOROV:
            continue
        place = match_place(name, places)
        if not place:
            continue
        point_feature(place["lon"], place["lat"], {
            "vrsta": "izogibanje",
            "ime": place["ime"],
            "glasovi": n,
        })

    approved_texts = [
        {"id": i["id"], "vprasanje": i["vprasanje"], "besedilo": i["besedilo"], "odobreno": True}
        for i in free_items if i["id"] in approved_ids or i.get("odobreno")
    ]

    geo = {
        "type": "FeatureCollection",
        "properties": {
            "sloj": "Glas učencev",
            "status": "pripravljeno",
            "opis": "Zbirni prikaz ankete učencev iz anonimnega izvoza, ki ga je poslala šola.",
            "povzetek": povzetek or "",
            "n": len(records),
            "min_odgovorov": MIN_ODGOVOROV,
            "ulice": ulice,
            "razredi": razredi,
            "stranski_okvir": {
                "dogodki": dict(dogodki),
                "pomoc": dict(pomoc),
                "pomoc_pri": dict(pomoc_pri),
                "manjka": dict(manjka),
                "obvescanje": dict(obvescanje),
                "druzzenje": dict(druzzenje),
                "izogibanje": dict(izogib),
            },
            "besedila": approved_texts,
        },
        "features": features,
    }

    # Varnost: v javnem izhodu ne sme ostati e-naslov.
    dumped = json.dumps(geo, ensure_ascii=False, indent=2)
    if EMAIL_VALUE.search(dumped):
        raise SystemExit("Napaka: v izhodu je ostal e-naslov, izvoz prekinjen.")
    izhod.parent.mkdir(parents=True, exist_ok=True)
    izhod.write_text(dumped + "\n", encoding="utf-8")
    print(
        f"Zapisano {izhod} ({len(records)} odgovorov, {len(features)} točk, "
        f"{len(approved_texts)} odobrenih prostih besedil). E-naslovov ni.",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
