# Lastništvo in razlage po parcelah (k. o. 2636 Bežigrad, Savsko naselje)

Datoteka `lastnistvo-povzetki.json` je javno varen povzetek lastništva in stanja za 712 veljavnih parcel katastrske občine 2636 Bežigrad, po rednih izpisih e-ZK (obrazec 03-001) s 20. 11. 2026. Ob njej so še 4 izbrisane parcele (zgodovinski izpis 03-002) z navedbo naslednic in številke Dn izbrisa.

Povzetke sestavi `gen-lastnistvo.py` iz izpisov. Besedilo je v preprostem jeziku in ni pravni nasvet. Izvirnik vsak preveri na [esodisce.si](https://www.esodisce.si/) (e-ZK, javni izpisi, redni izpis, k. o. 2636).

## Polja v JSON

- `lastnik_kratko` — kratek opis vpisanih imetnikov.
- `lastniki` — seznam imetnikov (`kdo`, `tip`, `delez`).
- `faza` — strojni ključ: `ni_postopka`, `postopek_tece` (vpisana zaznamba postopka ZVEtL; ime ključa je zgodovinsko) ali `izbrisana`.
- `faza_besedilo` — berljiv opis faze.
- `po_domace` — kratek odstavek za kartico parcele.
- `opombe` — tehnične opombe (npr. vrsta položaja, služnost, plomba), brez osebnih podatkov.

## Stanje postopka ZVEtL

Na 104 veljavnih parcelah je v zemljiški knjigi vpisana zaznamba postopka ZVEtL, čaka se sklep Okrajnega sodišča v Ljubljani (stanje e-ZK 20. 11. 2026). Na 608 veljavnih parcelah take zaznambe ni. Zaznamba pomeni, da je postopek v knjigi vpisan; iz nje same ni razvidno, ali je sodišče že odločilo. Kjer je zaznamba vpisana, povzetek ne pravi, da vpisani lastnik o urejanju že odloča: najprej se čaka sklep sodišča.

## Štetje po vrsti lastnika

Od 712 veljavnih parcel:

- skupni del stavbe (etažni lastniki): **324 od 712**
- zasebni lastniki (samo fizične osebe): **171 od 712**
- Mestna občina Ljubljana: **107 od 712**
- družbena lastnina: **69 od 712**
- druge pravne osebe: **37 od 712**
- mešano lastništvo: **4 od 712**

Poleg tega: izbrisane parcele: **4** (niso v števcu 712).

## Pravila javnosti

Imena, naslovi, EMŠO in datumi rojstva fizičnih oseb niso v datoteki. Kjer so lastniki samo fizične osebe, je navedeno samo število lastnikov in seštevek njihovih deležev. Pri mešanem lastništvu (pravna oseba in fizična oseba) zasebni lastnik ni naveden z imenom, številom ali deležem, ampak samo kot »tudi zasebni lastnik«. Pravne osebe in javni organi so poimenovani, kot so vpisani v zemljiški knjigi. Samostojni podjetniki (s.p.) so navedeni samo kot »samostojni podjetnik (s.p.)«, brez imena. Deleži pravnih oseb, javnih organov in celote so izpisani z imenovalcem (npr. 1/1, 93/100).

## Preverjanje uhajanja osebnih imen

Samodejno preverjanje: v izpisih je bilo najdenih 223 imen fizičnih oseb v imetniških blokih; v izhodni datoteki in v tem README je **0 zadetkov**.

