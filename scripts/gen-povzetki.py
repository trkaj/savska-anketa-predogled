import json,sys
src,dst=sys.argv[1],sys.argv[2]
P=json.load(open(src))['parcels']
def dt(s):
  y,m,dd=s.split('-');return f"{int(dd)}. {int(m)}. {y}"
def n_post(n): return {1:"en postopek",2:"dva postopka",3:"trije postopki",4:"štirje postopki"}.get(n,f"{n} postopkov")
out={}
for k,v in P.items():
  cs=v.get('cases') or []
  if not cs: continue
  parc=k.split(':')[1]; by={}
  for c in cs: by.setdefault(c['opravilna'],[]).append(c)
  has318=any(c['koda']=='318' for c in cs); has317=any(c['koda']=='317' for c in cs)
  stavbe=sorted({s.strip().replace('stavba ','') for c in cs for s in (c.get('objekti') or '').split(',') if s.strip()})
  prvi=min(c['datum'] for c in cs)[:4]; kaj=[]
  if has318: kaj.append("Za to zemljišče na sodišču še ni dokončno odločeno, kateri stavbi pripada. Ko so bloki nastajali, se zemljišče okoli njih pogosto ni vpisalo kot last stanovalcev, zato zdaj sodišče to ureja v posebnem postopku (ZVEtL).")
  if has317: kaj.append("Sodišče ureja tudi vpis stanovanj v zemljiško knjigo: nekateri deli stavbe še niso pravilno vpisani kot last posameznih lastnikov.")
  kaj.append(f"V zemljiški knjigi je postopek opisan od leta {prvi} in po stanju 20. 11. 2026 še ni končan.")
  zakaj="Dokler se postopek ne konča, ni povsem jasno, kdo je lastnik tega zemljišča. Zato je težje dobiti soglasja za ureditev (npr. parkirišča, igrala, klopi, zelenice), dogovor o vzdrževanju pa je lahko negotov."
  if len(by)>1: zakaj+=f" Tu tečejo {n_post(len(by))} hkrati, kar urejanje še dodatno zaplete."
  podr=[f"{op} (Okrajno sodišče v Ljubljani), zaznamovano {dt(sorted(L,key=lambda c:c['datum'])[0]['datum'])}" for op,L in by.items()]
  out[k]={"kaj_se_dogaja":" ".join(kaj),"zakaj_je_pomembno":zakaj,"stavbe":stavbe,"postopki":podr,
   "oznaka":"Samodejni povzetek v preprostem jeziku, narejen iz rednega izpisa zemljiške knjige (20. 11. 2026), brez osebnih podatkov. Ni pravni nasvet.",
   "kako_preveriti":f"Izvirnik si lahko vsak brezplačno ogleda na esodisce.si (e-ZK, javni izpisi, redni izpis): katastrska občina 2636 Bežigrad, parcela {parc}."}
json.dump({"vir":"redni izpisi e-ZK 20. 11. 2026","povezave":{"ezk":"https://www.esodisce.si/","zvetl1":"https://pisrs.si/pregledPredpisa?id=ZAKO7090"},
 "slovar":{"ZVEtL":"Zakon o vzpostavitvi etažne lastnine in določanju pripadajočega zemljišča: z njim sodišče uredi, katero zemljišče pripada bloku in kdo je lastnik stanovanj, kadar to ob gradnji ni bilo vpisano.","zaznamba":"opomba v zemljiški knjigi, ki vsem pove, da za parcelo teče sodni postopek","pripadajoče zemljišče":"zemljišče okoli bloka, ki ga stanovalci potrebujejo za normalno uporabo (dostop, dvorišče, zelenica)"},
 "parcels":out},open(dst,'w'),ensure_ascii=False,indent=1)
print(len(out))
