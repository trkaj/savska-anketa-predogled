'use strict';

const decisionBriefs = {
  "2023-01-10-1-1": {
    "summary": "Svet se je seznanil z izidom lokalnih volitev novembra 2022. Na isti seji je imenoval komisijo in nato potrdil mandate izvoljenih svetnikov.",
    "related": [
      "2023-01-10-2-1",
      "2023-01-10-3-1"
    ],
    "complete": true
  },
  "2023-01-10-2-1": {
    "summary": "Naloga nove komisije je bila preveriti mandate izvoljenih svetnikov. Svet je o mandatih odločil še na isti seji.",
    "related": [
      "2023-01-10-1-1",
      "2023-01-10-3-1"
    ],
    "complete": true
  },
  "2023-01-10-3-1": {
    "summary": "Po preverjanju volilnih listin je svet potrdil mandate novoizvoljenih članic in članov za obdobje 2022–2026.",
    "related": [
      "2023-01-10-1-1",
      "2023-01-10-2-1"
    ],
    "complete": true
  },
  "2023-01-30-1-2": {
    "minutes": [
      "2023-01-10"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 10. 1. 2023.",
    "complete": true
  },
  "2023-01-30-2-2": {
    "summary": "Za odgovore medijem v imenu četrtne skupnosti je svet pooblastil predsednika Stanka Furlana.",
    "complete": true
  },
  "2023-01-30-3-2": {
    "summary": "Stanko Furlan je dobil pooblastilo za posredovanje informacij javnega značaja. Svet je o nastopanju pred mediji glasoval posebej.",
    "complete": true
  },
  "2023-01-30-4-2": {
    "summary": "Komisijo za mandatna vprašanja so sestavili Alenka Žibert, Dejan Mikuš in Drago Bratun.",
    "outcome": "Ob koncu mandata je bila mandatna komisija z 2/24 izvzeta iz ukinitve delovnih teles.",
    "related": [
      "2026-11-12-2-24"
    ],
    "complete": true
  },
  "2023-01-30-5-2": {
    "summary": "Svet je za ta mandat dovolil zvočno snemanje sej, kadar so za to izpolnjeni pogoji. Za obstoj posnetka posamezne seje je potreben podatek o dejanskem snemanju.",
    "complete": true
  },
  "2023-01-30-6-2": {
    "summary": "Člani sveta so se seznanili s pravili varovanja osebnih podatkov pri svojem delu.",
    "complete": true
  },
  "2023-01-30-7-2": {
    "summary": "Svet je potrdil poročilo o tem, kako je četrt porabila proračunska sredstva v letu 2022.",
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-02-28-1-3": {
    "minutes": [
      "2023-01-30"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 30. 1. 2023.",
    "complete": true
  },
  "2023-02-28-2-3": {
    "summary": "Svet je za podpredsednico izvolil Alenko Žibert.",
    "complete": true
  },
  "2023-02-28-3-3": {
    "summary": "Svet je določil, kako mestni komisiji posreduje predloge kandidatov za imenovanja.",
    "complete": true
  },
  "2023-02-28-4-3": {
    "summary": "Za organizacijo čistilnih akcij v Zupančičevi jami in BS3 je svet namenil 500 evrov."
  },
  "2023-02-28-5-3": {
    "summary": "Svet je določil, katere programe in projekte bo četrt v letu 2023 izvajala v okviru svojega proračuna.",
    "related": [
      "2024-02-06-3-8"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-02-28-6-3": {
    "summary": "Prebivalce je svet povabil, naj predlagajo manjše ureditve za leti 2024 in 2025. O uvrstitvi del v letna načrta je odločal pozneje.",
    "related": [
      "2023-10-10-3-6",
      "2023-10-10-5-6"
    ]
  },
  "2023-02-28-7-3": {
    "summary": "Zaradi nevarnega parkiranja na Ptujski ulici je svet želel ukrepanje pristojnih služb.",
    "outcome": "Maja 2026 je svet ponovno obravnaval Ptujsko in predlagal preveritev enosmernega prometa. Ponavljanje pobude ne pove, kdaj je bil ukrep izveden.",
    "related": [
      "2026-05-13-3-13-izr"
    ]
  },
  "2023-02-28-8-3": {
    "summary": "Svet je zahteval načrte prometnih povezav ob novi avtobusni postaji. Zanimala ga je tudi povezava Šmartinske s Savsko cesto."
  },
  "2023-02-28-9-3": {
    "summary": "Svet je predlagal, naj služba za zimsko vzdrževanje tri pešpoti obravnava prednostno."
  },
  "2023-04-06-1-1-kor": {
    "summary": "Pri pripravi načrta za območje Tiskarne je svet sprejel svoje pripombe k predlagani ureditvi."
  },
  "2023-04-06-2-1-kor": {
    "summary": "Svet je pri načrtovanju območja Tiskarne podprl tudi pripombe prebivalcev, podane v začetku aprila."
  },
  "2023-04-25-1-4": {
    "minutes": [
      "2023-02-28",
      "2023-03-29",
      "2023-04-06"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 28. 2. 2023, 29. 3. 2023, 6. 4. 2023.",
    "complete": true
  },
  "2023-04-25-2-4": {
    "summary": "Četrt je podala prometne in prostorske zahteve za zahodni del območja OPPN 132.",
    "related": [
      "2024-11-13-1-4-kor"
    ]
  },
  "2023-04-25-3-4": {
    "summary": "Svet je nasprotoval predlogu, da bi na Avčinovi uvedli enosmerni promet in bočno parkiranje.",
    "complete": true
  },
  "2023-04-25-4-4": {
    "summary": "Svet je določil naloge svojih delovnih teles. Petčlanska skupina za Savsko naselje naj bi pripravljala pobude in dobivala informacije o odgovorih ter načrtovanih delih.",
    "related": [
      "2023-04-25-6-4",
      "2026-11-12-2-24"
    ],
    "complete": true
  },
  "2023-04-25-5-4": {
    "summary": "Svet je ustanovil glasilo Naš Bežigrad in določil pravila za njegovo izdajanje. Urednika in uredniški odbor je imenoval posebej.",
    "related": [
      "2023-04-25-6-4",
      "2023-04-25-7-4"
    ],
    "complete": true
  },
  "2023-04-25-6-4": {
    "summary": "Svet je imenoval člane komisij, uredniškega odbora in skupine za Savsko naselje. S tem so naloge iz sklepa 4/4 dobile konkretne nosilce.",
    "related": [
      "2023-04-25-5-4",
      "2023-04-25-7-4",
      "2023-04-25-4-4",
      "2026-11-12-2-24"
    ],
    "complete": true
  },
  "2023-04-25-7-4": {
    "summary": "Za urednika novoustanovljenega glasila Naš Bežigrad je svet imenoval Stanka Furlana.",
    "related": [
      "2023-04-25-5-4",
      "2023-04-25-6-4"
    ],
    "complete": true
  },
  "2023-04-25-8-4": {
    "summary": "Zaradi prometne varnosti je svet predlagal fizično oviro ob izhodu iz parka proti Samovi ulici."
  },
  "2023-06-06-1-5": {
    "minutes": [
      "2023-04-25"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 25. 4. 2023.",
    "complete": true
  },
  "2023-06-06-2-5": {
    "summary": "Svet je predlagal preveritev, ali je na Ulici Pohorskega bataljona smiselna postavitev stacionarnega radarja."
  },
  "2023-10-10-1-6": {
    "minutes": [
      "2023-06-06",
      "2023-09-21"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 6. 6. 2023, 21. 9. 2023.",
    "complete": true
  },
  "2023-10-10-2-6": {
    "summary": "Ob peti spremembi občinskega prostorskega načrta je svet zbral in sprejel pobude četrti za mestne načrtovalce."
  },
  "2023-10-10-3-6": {
    "summary": "V načrt malih del za leto 2024 je svet uvrstil tudi ureditev za namizni tenis v BS3 in posege na peskovnikih.",
    "related": [
      "2023-02-28-6-3",
      "2023-10-10-5-6"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-10-10-4-6": {
    "summary": "Svet je razdelil sredstva, načrtovana za delo četrti v letu 2024. Posamezna mala dela je obravnaval v ločenem sklepu.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-10-10-5-6": {
    "summary": "Za obnovo igral med Mislejevo, Savsko in Linhartovo je svet v načrtu malih del za 2025 predvidel 10.000 evrov.",
    "related": [
      "2023-02-28-6-3",
      "2023-10-10-3-6"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-10-10-6-6": {
    "summary": "Svet je sprejel razdelitev sredstev četrti za leto 2025, vključno z delom za mala dela.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-10-10-7-6": {
    "summary": "Ob projektu Potniškega centra je svet želel odgovore o prometu, varnosti in drevesih, tudi za stanovalce Savskega naselja in Zupančičeve jame."
  },
  "2023-11-07-1-7": {
    "summary": "Policija in mestno redarstvo sta svetu predstavila svoje delo. Glasovanje je evidentiralo seznanitev s poročiloma.",
    "complete": true
  },
  "2023-11-07-2-7": {
    "summary": "Stanovalci Matjaževe so želeli ohraniti travnik in dodati drevesa ter grmovnice. Svet je pobudo za park podprl in jo sklenil poslati mestnim oddelkom.",
    "outcome": "Za ureditev prav te zelenice še manjkata odločitev pristojnega oddelka in dokaz o izvedbi."
  },
  "2023-11-07-3-7": {
    "minutes": [
      "2023-10-10"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 10. 10. 2023.",
    "complete": true
  },
  "2023-11-07-4-7": {
    "summary": "Svet je del razpoložljivega denarja preusmeril v socialne, kulturne, športne in prednovoletne programe.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-11-07-5-7": {
    "summary": "Svet je potrdil evidenco udeležbe na sejah leta 2023. Ta je bila podlaga za odločanje o sejninah.",
    "related": [
      "2023-11-07-6-7"
    ],
    "complete": true
  },
  "2023-11-07-6-7": {
    "summary": "Na podlagi udeležbe je svet za sejnine določil 6.639,45 evra bruto in predvidel uskladitev ob dodatni seji.",
    "related": [
      "2023-11-07-5-7"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2023-11-28-1-3-izr": {
    "summary": "Policijski upravi je svet predlagal varnostne prioritete za 2024. Za Savsko naselje je med drugim želel pogostejše nočne patrulje."
  },
  "2024-01-04-1-5-izr": {
    "summary": "Za organizirano spomladansko vadbo je svet odobril največ 1.000 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-01-04-2-5-izr": {
    "summary": "Za sodelovanje pri prireditvi OŠ Bežigrad ob kulturnem prazniku je svet namenil do 500 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-01-04-3-5-izr": {
    "summary": "Svet je za prireditev ob dnevu žena namenil 400 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-02-06-1-8": {
    "minutes": [
      "2023-11-07",
      "2023-11-28",
      "2023-12-05",
      "2024-01-04"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 7. 11. 2023, 28. 11. 2023, 5. 12. 2023, 4. 1. 2024.",
    "complete": true
  },
  "2024-02-06-2-8": {
    "summary": "Predsednik je dobil pooblastilo, da pri uporabi prostorov presodi, ali dejavnost društva ali posameznika koristi četrti.",
    "complete": true
  },
  "2024-02-06-3-8": {
    "summary": "Svet je potrdil letno poročilo o izvedenih programih in projektih četrti za 2023.",
    "related": [
      "2023-02-28-5-3"
    ],
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-02-06-4-8": {
    "summary": "Svet je potrdil poročila za zaključni račun 2023 ter dovolil potrebne uskladitve.",
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-02-06-5-8": {
    "summary": "Svet je sprejel izvedbeni načrt programov četrti za leto 2024.",
    "related": [
      "2025-01-21-2-14"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-02-06-6-8": {
    "summary": "Pri vrtcu Palčki je svet predlagal dodatna mesta za kratkotrajno ustavljanje in preveritev možnosti za zapornico."
  },
  "2024-02-06-7-8": {
    "summary": "Zaradi pomanjkanja bankomatov je svet želel, da banke in Eurospin preučijo postavitev bankomata pri trgovini v Situli.",
    "outcome": "Za bankomat pri Eurospinu v Situli v pregledanih javnih virih ni potrditve postavitve."
  },
  "2024-02-06-8-8": {
    "summary": "Svet je zahteval ureditev parka med Triglavsko in Posavskega ter pojasnilo, kdo ga bo v prihodnje vzdrževal."
  },
  "2024-02-06-9-8": {
    "summary": "Svet je podprl čistilno akcijo na Savskem hribu. Organizatorji so prosili za pomoč pri malici, rokavicah, vrečah in orodju.",
    "outcome": "MOL je Savski hrib uvrstila v razpored akcij za 23. marec 2024. V letnem poročilu ČS je nato zabeleženo sodelovanje pri čiščenju v soseski."
  },
  "2024-03-12-1-9": {
    "minutes": [
      "2024-02-06"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 6. 2. 2024.",
    "complete": true
  },
  "2024-03-12-2-9": {
    "summary": "Za prehrano v počitniškem varstvu je svet predlagal 25 evrov na otroka na teden in oprostitev za socialno ogrožene."
  },
  "2024-03-12-3-9": {
    "summary": "Vrtec je opozoril na vožnjo in parkiranje ob Savski 1 in 3a. Svet je predlagal višje količke in zaporo, ki bi dopuščala dostop komunali in intervenciji.",
    "outcome": "Potrditve o postavitvi zapore ali višjih količkov na teh naslovih v pregledanih virih ni."
  },
  "2024-04-09-1-10": {
    "minutes": [
      "2024-03-12"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 12. 3. 2024.",
    "complete": true
  },
  "2024-05-14-1-11": {
    "minutes": [
      "2024-04-09"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 9. 4. 2024.",
    "complete": true
  },
  "2024-05-14-2-11": {
    "summary": "S prerazporeditvijo sredstev je svet omogočil načrtovanje brezplačne vodene vadbe tudi jeseni.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-05-14-3-11": {
    "summary": "Pred odločitvijo o obdarovanju je svet želel od šol izvedeti, ali jim bolj ustreza skupinsko ali individualno darilo."
  },
  "2024-05-14-4-11": {
    "summary": "Svet je predlagal, da bi združenje Srebrna nit brezplačno souporabljalo pisarno in sejno sobo na Dunajski 101."
  },
  "2024-06-11-1-12": {
    "minutes": [
      "2024-05-14"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 14. 5. 2024.",
    "complete": true
  },
  "2024-08-08-1-2-kor": {
    "summary": "Svet je potrdil pregled izvrševanja finančnega načrta za prvih šest mesecev leta 2024.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2024-09-09-1-3-kor": {
    "summary": "Zaradi mestnega rebalansa je svet prilagodil finančni načrt četrti za leto 2024.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-09-09-2-3-kor": {
    "summary": "Svet je hkrati z načrtom za tekoče leto spremenil tudi načrt četrti za leto 2025.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2024-10-08-1-13": {
    "minutes": [
      "2024-06-11",
      "2024-08-08",
      "2024-09-09",
      "2024-09-17"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 11. 6. 2024, 8. 8. 2024, 9. 9. 2024, 17. 9. 2024.",
    "complete": true
  },
  "2024-10-08-2-13": {
    "summary": "Za navijaško točko na Ljubljanskem maratonu je svet odobril do 300 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-10-08-3-13": {
    "summary": "Svet je dodatna sredstva usmeril v socialne in prednovoletne dejavnosti, vadbo in obletnico društva upokojencev Boris Kidrič.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-11-13-1-4-kor": {
    "summary": "Pri prostorskem načrtu med Tolstojevo in Mašera-Spasičevo je svet sprejel skupen seznam pripomb.",
    "related": [
      "2023-04-25-2-4"
    ]
  },
  "2024-12-03-1-8-izr": {
    "summary": "Svet je policiji za leto 2025 predlagal prednostne naloge, med njimi nadzor hitrosti in varovanja premoženja v Savskem naselju.",
    "complete": true
  },
  "2024-12-03-2-8-izr": {
    "summary": "Za obračun sejnin za 2024 je svet potrdil poročilo o udeležbi članov na sejah.",
    "related": [
      "2024-12-03-3-8-izr"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2024-12-03-3-8-izr": {
    "summary": "Po evidenci udeležbe je svet odobril 12.521,74 evra bruto sejnin za leto 2024.",
    "related": [
      "2024-12-03-2-8-izr"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2024-12-03-4-8-izr": {
    "summary": "Za vodeno vadbo občanov v prvi polovici leta 2025 je svet namenil 1.300 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-01-21-1-14": {
    "minutes": [
      "2024-10-08",
      "2024-11-06",
      "2024-11-13",
      "2024-12-03"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 8. 10. 2024, 6. 11. 2024, 13. 11. 2024, 3. 12. 2024.",
    "complete": true
  },
  "2025-01-21-2-14": {
    "summary": "Svet je potrdil letno poročilo o programih in projektih, ki jih je četrt izvajala v letu 2024.",
    "related": [
      "2024-02-06-5-8"
    ],
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-01-21-3-14": {
    "summary": "Svet je za ploščad med Železno, Avčinovo in Štihovo predlagal drevesa, trato in visoke grede."
  },
  "2025-01-21-4-14": {
    "summary": "Svet je podprl usmerjeno osvetlitev poti skozi park med Staničevo, Vodovodno in Podmilščakovo."
  },
  "2025-01-21-5-14": {
    "summary": "Za pot do šole in vrtcev je svet predlagal dodatne prehode, označene pasove za pešce tam, kjer ni prostora za pločnik, in strokovno presojo enosmernih ulic.",
    "outcome": "Vrtec je marca 2026 ponovno opozoril na prehode. Mestni oddelek je pri povezanih vprašanjih odgovor vezal na zaključek cestnih del. Za tri ukrepe iz tega sklepa še ni posamičnega dokazila o izvedbi."
  },
  "2025-01-21-6-14": {
    "summary": "Zaradi stanja podhoda pri Dunajski 107 je svet pozval k popravilom in obnovi luči v podhodu in na stopniščih."
  },
  "2025-01-21-7-14": {
    "summary": "Svet je vodstvo SIC Ljubljana pozval, naj s športnih igrišč odstrani parkirana vozila in prepreči ponovno parkiranje."
  },
  "2025-01-21-8-14": {
    "summary": "Da bi imeli pešci več časa za prečkanje Dunajske, je svet predlagal daljši interval zelene luči."
  },
  "2025-01-21-9-14": {
    "summary": "Pred spomladanskim pometanjem je svet znova predlagal odstranjevanje listja tudi s pločnikov in kolesarskih poti, po možnosti ob koncu tedna."
  },
  "2025-01-21-10-14": {
    "summary": "Svet je ponovil pobudo za dodatne koše za odpadke ob Dunajski, predvsem med železniškim podvozom in Samovo."
  },
  "2025-02-11-1-15": {
    "minutes": [
      "2025-01-21"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 21. 1. 2025.",
    "complete": true
  },
  "2025-02-11-2-15": {
    "summary": "Za območje Soča J je četrt predlagala storitve, ki jih v soseski pogrešajo, med njimi pošto in skupnostni center, ter garažo za okoliške stanovalce.",
    "related": [
      "2026-06-09-3-22"
    ]
  },
  "2025-02-11-3-15": {
    "summary": "Svet je potrdil poročila o porabi proračuna za 2024. Priloge med dejavnostmi v Savskem naselju omenjajo čistilne akcije in košarko za učence.",
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-02-11-4-15": {
    "summary": "Svet je sprejel načrt programov za 2025 in se seznanil s posodobljenim pregledom tveganj.",
    "related": [
      "2025-12-10-1-11-izr",
      "2026-02-03-2-20"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-02-11-5-15": {
    "summary": "Ob Rezidenci Bežigrad je svet zahteval prometni načrt in sestanek s SIC. Nasprotoval je desnemu zavijalcu pri šoli ter predlagal ureditev zelenic in Topniške."
  },
  "2025-03-25-1-16": {
    "minutes": [
      "2025-02-11"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 11. 2. 2025.",
    "complete": true
  },
  "2025-03-25-2-16": {
    "summary": "Svet je podprl mednarodno tekmovanje v hitrostnem rolanju. Odločitev o obsegu sodelovanja je prepustil komisiji za kulturo in šport."
  },
  "2025-03-25-3-16": {
    "summary": "Svet je sprejel spremembo proračuna četrti za 2025 in prva osnutka načrtov za naslednji dve leti.",
    "related": [
      "2025-09-30-4-19",
      "2025-09-30-6-19"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-03-25-4-16": {
    "summary": "Zaradi rebalansa je svet v načrtu za 2025 popravil postavki za sejnine in nepredvidene izdatke.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2025-03-25-5-16": {
    "summary": "Prebivalci so lahko do 25. aprila 2025 predlagali manjše posege za leti 2026 in 2027.",
    "outcome": "Septembra je svet s sklepom 5/19 sprejel obseg malih del za leto 2026, maja 2026 pa je določil še posredovanje konkretnih lokacij.",
    "related": [
      "2025-09-30-5-19",
      "2026-05-13-4-13-izr",
      "2026-11-12-5-24"
    ]
  },
  "2025-03-25-6-16": {
    "summary": "Za varnejšo šolsko pot na Ulici Pohorskega bataljona je svet podprl označbe, prehode in umirjanje prometa z dvignjenimi površinami."
  },
  "2025-03-25-7-16": {
    "summary": "Zaradi težav v Zupančičevi jami je svet od občine in policije želel nadzor nad lokali, podaljšanim odpiralnim časom in javnim redom."
  },
  "2025-05-06-1-17": {
    "minutes": [
      "2025-03-25"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 25. 3. 2025.",
    "complete": true
  },
  "2025-05-06-2-17": {
    "summary": "Svet je predlagal, naj četrt skupaj z društvi na sejmu Narava–zdravje predstavi športne dejavnosti."
  },
  "2025-05-06-3-17": {
    "summary": "Lastnikom zasebnih zemljišč bi pri ohranjanju dreves pomagale delavnice, ki jih je svet podprl."
  },
  "2025-05-06-5-17": {
    "summary": "Zaradi razmer v Zupančičevi jami je svet sklenil organizirati sestanek z Društvom Stigma.",
    "outcome": "Na isti seji je svet ločeno predlagal preselitev društva ali stalno urejanje okolice. Za dejanski sestanek potrebujemo zapis ali poročilo.",
    "related": [
      "2025-05-06-6-17"
    ]
  },
  "2025-05-06-6-17": {
    "summary": "Svet je predlagal dve možnosti za Hacquetovo. Društvo Stigma bi se preselilo ali pa bi zagotovili stalen nadzor in urejanje okolice.",
    "related": [
      "2025-05-06-5-17"
    ]
  },
  "2025-06-17-1-18": {
    "minutes": [
      "2025-05-06"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 6. 5. 2025.",
    "complete": true
  },
  "2025-06-17-2-18": {
    "summary": "Zaradi preglednosti izvoza s Kržičeve proti Vojkovi je svet predlagal namestitev prometnega ogledala."
  },
  "2025-06-17-3-18": {
    "summary": "Za izvoz z Neubergerjeve na Vilharjevo je svet želel strokovno preveritev pametnega semaforja."
  },
  "2025-07-23-1-5-kor": {
    "summary": "Svet je pregledal in potrdil poročilo o izvrševanju finančnega načrta v prvem polletju 2025.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2025-09-30-1-19": {
    "minutes": [
      "2025-06-17",
      "2025-07-23"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 17. 6. 2025, 23. 7. 2025.",
    "complete": true
  },
  "2025-09-30-2-19": {
    "summary": "Pri načrtu za Parmovo je svet želel v stavbi 3F ohraniti vrtec ali drugo javno dejavnost in nasprotoval preureditvi v oskrbovana stanovanja."
  },
  "2025-09-30-3-19": {
    "summary": "Ob drugem rebalansu za leto 2025 je svet potrdil spremembe finančnega načrta četrti.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-09-30-4-19": {
    "summary": "Svet je določil finančni okvir delovanja četrti za leto 2026.",
    "related": [
      "2025-03-25-3-16",
      "2025-09-30-6-19"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-09-30-5-19": {
    "summary": "Za igrala, parkovno opremo, stojala za kolesa in količke je svet v načrtu za 2026 predvidel 9.300 evrov.",
    "related": [
      "2025-03-25-5-16",
      "2026-05-13-4-13-izr",
      "2026-11-12-5-24"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-09-30-6-19": {
    "summary": "Svet je sprejel finančni načrt četrti za leto 2027.",
    "related": [
      "2025-03-25-3-16",
      "2025-09-30-4-19"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-09-30-7-19": {
    "summary": "Svet je za zelenice, opremo in igrala predvidel 10.000 evrov. Točka je obravnavala načrt za 2027, v samem sklepu pa piše 2026.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-09-30-8-19": {
    "summary": "Po pregledu porabe do septembra je svet preostanek denarja namenil socialnim, kulturnim, športnim in prednovoletnim dejavnostim.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-11-18-1-6-kor": {
    "summary": "Svet je podprl stanovalce BS3, ki so nasprotovali spremembam namembnosti in višine objektov na parkiriščih ob Vojkovi.",
    "complete": true
  },
  "2025-11-18-2-6-kor": {
    "summary": "Svet je podprl obnovo košarkarskega igrišča in tribun ob OŠ Bežigrad ter zaprosil za čimprejšnjo vključitev v načrt naložb."
  },
  "2025-12-02-1-10-izr": {
    "summary": "Svet je potrdil, katerih sej v 2025 so se udeležili predsednik in člani. Upošteval je tudi to sejo.",
    "related": [
      "2025-12-02-2-10-izr"
    ],
    "complete": true
  },
  "2025-12-02-2-10-izr": {
    "summary": "Svet je po tabeli udeležbe odobril 13.140,52 evra bruto sejnin. Če bi do 11. decembra sklicali dodatno sejo, bi izračun popravili.",
    "related": [
      "2025-12-02-1-10-izr"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-12-02-3-10-izr": {
    "summary": "Za leto 2026 je svet policiji predlagal prednostne naloge za varnejši promet, okolico šol in vrtcev ter varovanje premoženja v soseskah.",
    "complete": true
  },
  "2025-12-02-4-10-izr": {
    "summary": "Za vodeno vadbo občanov dvakrat na teden od januarja do aprila 2026 je svet namenil do 1.900 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-12-02-5-10-izr": {
    "summary": "Za izobraževanja o prepoznavanju težav pri učencih in mladostnikih na začetku leta 2026 je svet namenil 600 evrov.",
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2025-12-10-1-11-izr": {
    "summary": "Svet je pregledal, koliko letnega programa je bilo izvedenega do 8. decembra 2025.",
    "related": [
      "2025-02-11-4-15",
      "2026-02-03-2-20"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2026-02-03-1-20": {
    "minutes": [
      "2025-09-30",
      "2025-11-06",
      "2025-11-18",
      "2025-12-02",
      "2025-12-10"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 30. 9. 2025, 6. 11. 2025, 18. 11. 2025, 2. 12. 2025, 10. 12. 2025.",
    "complete": true
  },
  "2026-02-03-2-20": {
    "summary": "Svet je potrdil pregled izvedenih programov in projektov za 2025. Na isti seji je posebej odločal o porabi denarja.",
    "related": [
      "2025-02-11-4-15",
      "2025-12-10-1-11-izr"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2026-02-03-3-20": {
    "summary": "Svet je potrdil finančna poročila za 2025. Priloga za Savsko naselje beleži sodelovanje pri čistilnih akcijah in košarkarskem turnirju.",
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-02-03-4-20": {
    "summary": "Svet je določil, katere programe četrt načrtuje za 2026, in pregledal tveganja za njihovo izvedbo.",
    "related": [
      "2026-07-31-1-8-kor",
      "2026-09-29-2-23",
      "2026-11-12-5-24"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-03-10-1-21": {
    "minutes": [
      "2026-02-03"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 3. 2. 2026. Besedilo so potrdili z dopolnitvijo.",
    "complete": true
  },
  "2026-03-10-2-21": {
    "summary": "Svet je predlagal prometne ukrepe za Tomačevo. Na isti seji je poslušal tudi pobude vrtca za Savsko naselje, ki jih ta sklep ne zajema."
  },
  "2026-04-29-1-7-kor": {
    "summary": "Svet je za območje Baragovega semenišča in Gospodarskega razstavišča sprejel pripombe o prometu ter športnih in zelenih površinah."
  },
  "2026-05-13-1-13-izr": {
    "summary": "Svet je spremenil finančni načrt četrti za tekoče leto 2026.",
    "outcome": "Junija je svet z 2/22 znova spreminjal finančna načrta za 2026 in 2027.",
    "related": [
      "2026-05-13-2-13-izr",
      "2026-06-09-2-22"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-05-13-2-13-izr": {
    "summary": "Svet je skupaj s spremembami za tekoče leto prilagodil tudi finančni načrt za 2027.",
    "outcome": "Junija je svet z 2/22 znova spreminjal finančna načrta za obe leti.",
    "related": [
      "2026-05-13-1-13-izr",
      "2026-06-09-2-22"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-05-13-3-13-izr": {
    "summary": "Zaradi varnosti na Ptujski ulici je svet predlagal ukrepe in preveritev, ali bi pomagala enosmerna ureditev.",
    "related": [
      "2023-02-28-7-3"
    ]
  },
  "2026-05-13-4-13-izr": {
    "summary": "Svet je določil, naj četrt mestnemu oddelku posreduje konkretne lokacije za mala dela leta 2026. Predsednik je dobil pooblastilo za morebitne spremembe.",
    "related": [
      "2025-03-25-5-16",
      "2025-09-30-5-19",
      "2026-11-12-5-24"
    ]
  },
  "2026-05-13-5-13-izr": {
    "summary": "Za voznike ob vstopu v Jarše in Tomačevo je svet predlagal prikazovalnike hitrosti."
  },
  "2026-06-09-1-22": {
    "minutes": [
      "2026-03-10",
      "2026-04-22",
      "2026-04-29",
      "2026-05-13"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 10. 3. 2026, 22. 4. 2026, 29. 4. 2026, 13. 5. 2026.",
    "complete": true
  },
  "2026-06-09-2-22": {
    "summary": "Svet je ponovno prilagodil finančna načrta četrti za leti 2026 in 2027.",
    "related": [
      "2026-05-13-1-13-izr",
      "2026-05-13-2-13-izr"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2026-06-09-3-22": {
    "summary": "Pri načrtovanju območja Soča J je svet predlagal drugo podzemno etažo. Okoliški stanovalci in podjetja bi lahko parkirno mesto najeli ali kupili.",
    "outcome": "Svet je s tem konkretiziral predlog garaže iz sklepa 2/15. Sprejete spremembe prostorskega načrta ali začetka gradnje v pregledanem gradivu ni.",
    "related": [
      "2025-02-11-2-15"
    ]
  },
  "2026-06-09-4-22": {
    "summary": "Svet je podprl možnost igre za otroke in prostor za mlade na območju med Herbersteinovo in Dunajsko.",
    "complete": true
  },
  "2026-06-09-5-22": {
    "summary": "Mestno redarstvo je svet zaprosil, naj na Kolarjevi nadzira hitrost vozil."
  },
  "2026-07-31-1-8-kor": {
    "summary": "Svet je potrdil poročilo o porabi četrti v prvi polovici leta 2026.",
    "related": [
      "2026-02-03-4-20",
      "2026-09-29-2-23",
      "2026-11-12-5-24"
    ],
    "complete": true,
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-09-29-1-23": {
    "minutes": [
      "2026-06-09",
      "2026-07-31",
      "2026-09-16"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 9. 6. 2026, 31. 7. 2026, 16. 9. 2026.",
    "complete": true
  },
  "2026-09-29-2-23": {
    "summary": "Denar, ki je pri nekaterih programih za leto 2026 ostajal neporabljen, je svet preusmeril v kulturo, šport ter socialne in prednovoletne dejavnosti.",
    "outcome": "Izhodišče je bil letni načrt 4/20. Svet je 12. novembra s sklepom 5/24 potrdil poročili o programih in malih delih. Koliko je po prerazporeditvi dobil vsak program, v sklepu ni razčlenjeno.",
    "related": [
      "2026-02-03-4-20",
      "2026-07-31-1-8-kor",
      "2026-11-12-5-24"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-10-20-1-15-izr": {
    "summary": "Za leto 2027 je svet določil prednostne varnostne naloge in sklenil posredovati tudi predlog glede prometne infrastrukture."
  },
  "2026-10-20-2-15-izr": {
    "summary": "Zaradi parkiranja v križišču Vrbovca, Raičeve in Poti k Savi je svet predlagal ukrepe za varnejše križišče."
  },
  "2026-11-12-1-24": {
    "minutes": [
      "2026-09-29",
      "2026-10-20"
    ],
    "summary": "Svet je skupaj potrdil zapisnike naslednjih sej: 29. 9. 2026, 20. 10. 2026. Zapisnik 23. redne seje so potrdili brez priponke.",
    "complete": true
  },
  "2026-11-12-2-24": {
    "summary": "Ob koncu mandata je svet ukinil delovna telesa z dvema izjemama. Delo sta nadaljevala mandatna komisija in uredniški odbor glasila Naš Bežigrad.",
    "related": [
      "2023-01-30-4-2",
      "2023-04-25-4-4",
      "2023-04-25-6-4"
    ],
    "complete": true
  },
  "2026-11-12-3-24": {
    "summary": "Za obračun sejnin je svet potrdil evidenco udeležbe svojih članov v letu 2026.",
    "outcome": "Svet je na isti seji sprejel še sklep 4/24 o obračunu po zadnji dopisni seji.",
    "related": [
      "2026-11-12-4-24"
    ],
    "complete": true
  },
  "2026-11-12-4-24": {
    "summary": "Svet je določil podlago za izračun sejnin. Končni znesek je bilo treba izračunati po zadnji dopisni seji.",
    "related": [
      "2026-11-12-3-24"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen."
  },
  "2026-11-12-5-24": {
    "summary": "Svet je ob koncu mandata potrdil dve poročili za leto 2026. Eno zajema manjše ureditve, drugo pa izvajanje programov četrti.",
    "outcome": "Med predhodnimi odločitvami sta izbor lokacij za mala dela in septembrska prerazporeditev programskega denarja. Potrditev obeh poročil sama ne pokaže zneska za posamezno lokacijo ali program.",
    "related": [
      "2025-03-25-5-16",
      "2025-09-30-5-19",
      "2026-05-13-4-13-izr",
      "2026-02-03-4-20",
      "2026-07-31-1-8-kor",
      "2026-09-29-2-23"
    ],
    "gap": "Znesek dejanske porabe za to odločitev v samem sklepu ni razčlenjen.",
    "complete": true
  },
  "2026-11-17-1-9-kor": {
    "minutes": [
      "2026-11-12"
    ],
    "summary": "Svet je potrdil zapisnik seje z dne 12. 11. 2026.",
    "complete": true
  }
};

const savskoSources = {
  "cesta": {
    "who": "MOL",
    "when": "29. 8. 2025",
    "label": "Poročilo o izvedenih delih",
    "fact": "MOL poroča o obnovi vodovoda in kanalizacije na Linhartovi, novih pločnikih in kolesarskih stezah. Odprtje odseka od Topniške do Žal je napovedala za 31. avgust.",
    "url": "https://www.ljubljana.si/sl/aktualno/novice/odprli-bomo-prenovljeno-linhartovo-cesto"
  },
  "drevesa": {
    "who": "MOL",
    "when": "20. 2. 2024",
    "label": "Presaditev z Linhartove",
    "fact": "MOL dokumentira preselitev dreves z Linhartove v Šmartinski park. Objava ne popisuje usode vsakega drevesa, o katerem so spraševali stanovalci.",
    "url": "https://www.ljubljana.si/sl/aktualno/novice/kako-smo-selili-drevesa-v-smartinski-park"
  },
  "posta": {
    "who": "Pošta Slovenije",
    "when": "7. 10. 2021",
    "label": "Predhodna ureditev na Savski 3a",
    "fact": "Pošta je na Savski 3a odprla pogodbeno mesto za prevzem pošiljk. To pojasni, katera storitev je v soseski že obstajala pred pobudo za poslovalnico.",
    "url": "https://www.posta.si/o-nas/novice/nova-oblika-prevzemnega-mesta-za-posiljke"
  },
  "parkiranje": {
    "who": "Mestna uprava · OGDP",
    "when": "2019",
    "label": "Odgovor na svetniško vprašanje o parkiranju",
    "fact": "Mestni oddelek je v odgovoru o Majaronovi in širši soseski navedel, da so nove ureditve na zemljiščih v sodnih postopkih omejene. Odgovor opisuje razmere leta 2019.",
    "url": "https://www.ljubljana.si/assets/Uploads/2.-tocka-Odgovor-na-vprasanje-Svetniskega-kluba-Levica-problematika-parkiranja-Savsko-naselje.pdf"
  },
  "klopi": {
    "who": "MOL · projekt Zunaj",
    "when": "2025",
    "label": "Skupnostna ureditev zelenice",
    "fact": "MOL med izvedenimi akcijami navaja obnovo klopi, zasaditev in zaščito zelenice v Savskem naselju. Objava ne navaja, da bi akcija sledila prav tej pobudi ČS.",
    "url": "https://www.ljubljana.si/sl/ljubljana/zelena/projekt-zunaj/zemljevid-akcij-projekta-zunaj/skupnostna-ureditev-zelenice"
  },
  "serkova": {
    "who": "Dnevnik · odziv MOL",
    "when": "24. 11. 2026",
    "label": "Napoved prenove Šerkove za 2027",
    "fact": "Dnevnik poroča, da se po razrešitvi zemljiškega vprašanja obeta prenova igrišča. Preplastitev in goli so med željami stanovalcev. Dokončanje del in naročilo plezalne stene ostajata odprta.",
    "url": "https://novi.dnevnik.si/novice/ljubljana/stanovalci-so-opozarjali-na-nevarno-igrisce-zdaj-je-znano-kdaj-ga-bodo-obnovili-2842779/"
  },
  "park": {
    "who": "MOL",
    "when": "19. 5. 2026",
    "label": "Odprtje športnega parka",
    "fact": "MOL je objavila odprtje prenovljenega Športnega parka Savsko naselje. Park je prevzel v upravljanje javni zavod Šport Ljubljana.",
    "url": "https://www.ljubljana.si/sl/aktualno/novice/odprli-smo-prenovljen-sportni-park-savsko-naselje"
  },
  "sport": {
    "who": "Šport Ljubljana",
    "when": "Pregled 27. 11. 2026",
    "label": "Ponudba upravljavca parka",
    "fact": "Upravljavec na Kranjčevi 24 navaja večnamenski igrišči, igrišči za padel, košarko, tenis in otroška igrala.",
    "url": "https://www.sport-ljubljana.si/sportni-park-savsko-naselje/"
  },
  "sola": {
    "who": "MOL",
    "when": "24. 5. 2024",
    "label": "Končana prenova šole",
    "fact": "MOL je predstavila prenovljene učilnice, kuhinjo in jedilnico, večnamensko dvorano ter prostore za vrtec.",
    "url": "https://www.ljubljana.si/sl/aktualno/novice/prenovili-smo-os-savsko-naselje"
  },
  "dostop": {
    "who": "24ur · šola in MOL",
    "when": "april 2024",
    "label": "Pojasnili o zapiranju igrišča",
    "fact": "Ravnateljica je pojasnila odločitev o zapiranju igrišča zunaj šolskega časa. Občinski oddelek za izobraževanje je odločitev podprl. Prispevek opisuje takratni režim.",
    "url": "https://www.24ur.com/novice/slovenija/zaklenjeno-igrisce.html"
  },
  "ciscenje": {
    "who": "MOL",
    "when": "marec 2024",
    "label": "Mestni razpored čistilnih akcij",
    "fact": "Savski hrib je v razporedu naveden za 23. marec 2024 z rezervnim terminom ob dežju. Razpored potrjuje napovedani dogodek.",
    "url": "https://www.ljubljana.si/assets/Uploads/CISTILNE-AKCIJE-PO-CS-2024.pdf#page=1"
  },
  "knjiznica": {
    "who": "Prostorož",
    "when": "Predhodni projekt",
    "label": "Obstoječi Dom skupnosti",
    "fact": "Prostorož opisuje vzpostavitev Knjižnice REČI v Domu skupnosti Savsko naselje. Gre za že obstoječo dejavnost, zato iz nje ne moremo sklepati o dodelitvi novega prostora.",
    "url": "https://www.prostoroz.org/projekti/knjiznica-reci"
  },
  "prostorski": {
    "who": "Prostorski informacijski sistem",
    "when": "2022",
    "label": "Sklep o pripravi OPPN 234 Soča J",
    "fact": "Sklep določa območje urejanja in začenja pripravo prostorskega načrta. Gradnja garaže, nova pošta in oddaja parkirnih mest bi potrebovale nadaljnje odločitve.",
    "url": "https://dokumenti-pis.mop.gov.si/javno/veljavni/02_rep_priprava/3025/1/sklep.pdf#page=1"
  },
  "filip": {
    "who": "OŠ Savsko naselje · projekt",
    "when": "Predhodni projekt",
    "label": "Nastanek Filipovega igrišča",
    "fact": "Projektna stran opisuje pobudo Filipove družine in sodelovanje učencev pri ureditvi košarkarskega igrišča, hriba in otroškega igrišča. Za potek prenove v letu 2026 je merodajen novejši zapisnik.",
    "url": "https://ossavskonaselje.javno.si/index.php/en/savski-hrib"
  },
  "mestno": {
    "who": "Mestni svet · svetniška pobuda",
    "when": "14. 11. 2025",
    "label": "Denis Striković odpre vprašanje prometne ureditve",
    "fact": "Denis Striković je vprašal, kako se župan in mestna uprava odzivata na poročilo prebivalcev. V prilogi so na 4. strani med predlogi enosmerne ulice, na 6. strani pa strokovna revizija in ponovna presoja prometnih tokov.",
    "url": "https://www.ljubljana.si/assets/Mestni-svet/Seje-MS/27-seja-2025/2.-tocka-Vprasanje-svetnika-Denisa-Strikovica-prometna-ureditev.pdf#page=1"
  },
  "odgovor": {
    "who": "Mestna uprava · OGDP",
    "when": "3. 12. 2025",
    "label": "OGDP napove odgovore po dokončanju cestnih del",
    "fact": "V odgovoru Denisu Strikoviću št. 90000-8/2025-41 oddelek vsebinske odgovore o novi prometni ureditvi odloži do konca cestnih del in vzpostavitve končne ureditve. Izida presoje enosmernosti ne navede.",
    "url": "https://www.ljubljana.si/assets/Mestni-svet/Seje-MS/28-seja-2025/2.-tocka-Odgovor-na-vprasanje-svetnika-Denisa-Strikovica-prometna-ureditev.pdf#page=1"
  },
  "primc": {
    "who": "Mestni svet · svetniška pobuda",
    "when": "30. 1. 2026",
    "label": "Mestni svetnik imenuje tri lokacije za prehode",
    "fact": "Aleš Primc je predlagal prehode pri zavijanju z Luize Pesjakove na Endliherjevo, pri vrtcu ter v križišču Fabianijeve in Luize Pesjakove. Predlagal je tudi ločilno črto za pešce in dogovor s šolo o šolski poti. Gre za pobudo št. 90000-10/2026-14 brez sklica na sklep ČS 5/14.",
    "url": "https://www.ljubljana.si/assets/Mestni-svet/Seje-MS/29-seja-2026/2.-tocka-Vprasanje-svetnika-Alese-Primca-Savsko-naselje.pdf#page=2"
  },
  "ogdp": {
    "who": "Mestna uprava · OGDP",
    "when": "17. 2. 2026",
    "label": "OGDP odgovor o prometnih ukrepih odloži do konca del",
    "fact": "OGDP v dopisu št. 90000-10/2025-30 Alešu Primcu pojasni, da se prometna ureditev na območju Savskega naselja še izvaja. Na vprašanja in pobude bo odgovarjal po zaključku del in vzpostavitvi končne ureditve. Dopis ne navede izida za posamezni prehod ali pas za pešce.",
    "url": "https://www.ljubljana.si/assets/Mestni-svet/Seje-MS/30-seja-2026/2.-tocka-Odgovor-na-vprasanje-svetnika-Alesa-Primca-Savsko-naselje.pdf#page=1"
  },
  "meritev": {
    "who": "MOL · mestno redarstvo",
    "when": "25. 8. 2026",
    "label": "Meritve hitrosti pri OŠ na Linhartovi 35",
    "fact": "MOL je objavila, da je namestila novo ohišje in da meritve hitrosti že potekajo. To potrjuje konkreten ukrep v okolici šole. Objava ga ne povezuje s tremi predlogi sklepa 5/14.",
    "url": "https://www.ljubljana.si/sl/aktualno/novice/varni-koraki-v-novo-solsko-leto"
  }
};

const savskoReviews = {
  "2023-01-30|Napoved obnove vodovoda in kanalizacije": {
    "sources": [
      "cesta"
    ],
    "note": "Za obnovo Linhartove obstaja poročilo MOL. Za posamezne ulice v notranjosti soseske bi potrebovali popis del po odsekih.",
    "related": [
      "2024-05-14|Napovedani rok obnove Linhartove do Topniške",
      "2025-09-30|Odprtje odseka Linhartove in ureditev pri Žalah"
    ]
  },
  "2024-05-14|Napovedani rok obnove Linhartove do Topniške": {
    "sources": [
      "cesta"
    ],
    "note": "Za obnovo Linhartove obstaja poročilo MOL. Za posamezne ulice v notranjosti soseske bi potrebovali popis del po odsekih.",
    "related": [
      "2023-01-30|Napoved obnove vodovoda in kanalizacije",
      "2025-09-30|Odprtje odseka Linhartove in ureditev pri Žalah"
    ]
  },
  "2025-09-30|Odprtje odseka Linhartove in ureditev pri Žalah": {
    "sources": [
      "cesta"
    ],
    "note": "Za obnovo Linhartove obstaja poročilo MOL. Za posamezne ulice v notranjosti soseske bi potrebovali popis del po odsekih.",
    "related": [
      "2023-01-30|Napoved obnove vodovoda in kanalizacije",
      "2024-05-14|Napovedani rok obnove Linhartove do Topniške"
    ]
  },
  "2023-01-30|Prostor za poštno poslovalnico": {
    "sources": [
      "posta"
    ],
    "note": "Ponovno odprtje polne poštne poslovalnice ali dodelitev brezplačnega prostora v pregledanih objavah ni potrjeno."
  },
  "2023-01-30|Plačljivo parkiranje in pripadajoča zemljišča": {
    "sources": [
      "parkiranje",
      "mestno",
      "odgovor"
    ],
    "note": "Dokumenti pojasnijo zemljiške ovire in poznejšo razpravo o prometu. Posebne odločitve o zapori soseske za dnevne migrante nismo našli.",
    "related": [
      "2024-03-12|Omejitev dostopa za dnevne migrante"
    ]
  },
  "2024-03-12|Omejitev dostopa za dnevne migrante": {
    "sources": [
      "parkiranje",
      "mestno",
      "odgovor"
    ],
    "note": "Dokumenti pojasnijo zemljiške ovire in poznejšo razpravo o prometu. Posebne odločitve o zapori soseske za dnevne migrante nismo našli.",
    "related": [
      "2023-01-30|Plačljivo parkiranje in pripadajoča zemljišča"
    ]
  },
  "2023-01-30|Kdo bi sodeloval v posvetovalni skupini?": {
    "sources": [],
    "note": "Zapisniki spremljajo pot od predloga do imenovanja članov in prvega sestanka. Sklep 2/24 je ob koncu mandata ukinil tudi to skupino.",
    "related": [
      "2023-04-25|Ustanovitev in naloge posvetovalne skupine",
      "2023-04-25|Imenovanje petih članov posvetovalne skupine",
      "2023-06-06|Poročilo o prvem sestanku posvetovalne skupine"
    ]
  },
  "2023-04-25|Ustanovitev in naloge posvetovalne skupine": {
    "sources": [],
    "note": "Zapisniki spremljajo pot od predloga do imenovanja članov in prvega sestanka. Sklep 2/24 je ob koncu mandata ukinil tudi to skupino.",
    "related": [
      "2023-01-30|Kdo bi sodeloval v posvetovalni skupini?",
      "2023-04-25|Imenovanje petih članov posvetovalne skupine",
      "2023-06-06|Poročilo o prvem sestanku posvetovalne skupine"
    ]
  },
  "2023-04-25|Imenovanje petih članov posvetovalne skupine": {
    "sources": [],
    "note": "Zapisniki spremljajo pot od predloga do imenovanja članov in prvega sestanka. Sklep 2/24 je ob koncu mandata ukinil tudi to skupino.",
    "related": [
      "2023-01-30|Kdo bi sodeloval v posvetovalni skupini?",
      "2023-04-25|Ustanovitev in naloge posvetovalne skupine",
      "2023-06-06|Poročilo o prvem sestanku posvetovalne skupine"
    ]
  },
  "2023-06-06|Poročilo o prvem sestanku posvetovalne skupine": {
    "sources": [],
    "note": "Zapisniki spremljajo pot od predloga do imenovanja članov in prvega sestanka. Sklep 2/24 je ob koncu mandata ukinil tudi to skupino.",
    "related": [
      "2023-01-30|Kdo bi sodeloval v posvetovalni skupini?",
      "2023-04-25|Ustanovitev in naloge posvetovalne skupine",
      "2023-04-25|Imenovanje petih članov posvetovalne skupine"
    ]
  },
  "2023-01-30|Priloga za leto 2022: sadike in material za skupne zelenice": {
    "sources": [
      "klopi"
    ],
    "note": "Za nakup sadik je vir letno poročilo ČS. Projekt Zunaj opisuje poznejšo, ločeno akcijo.",
    "related": [
      "2024-02-06|Priloga za leto 2023: sadike in material za zelenice"
    ]
  },
  "2024-02-06|Priloga za leto 2023: sadike in material za zelenice": {
    "sources": [
      "klopi"
    ],
    "note": "Za nakup sadik je vir letno poročilo ČS. Projekt Zunaj opisuje poznejšo, ločeno akcijo.",
    "related": [
      "2023-01-30|Priloga za leto 2022: sadike in material za skupne zelenice"
    ]
  },
  "2023-02-28|Preplastitev igrišča, dva gola in plezalna stena": {
    "sources": [
      "serkova"
    ],
    "note": "Za Šerkovo je znana napoved za leto 2027. Za potrditev izvedbe bi potrebovali poročilo o dokončanju."
  },
  "2023-02-28|Predlog, naj skupina pripravi rešitve za varno šolsko pot in parkiranje": {
    "sources": [
      "primc",
      "ogdp"
    ],
    "note": "Vrtec je predlog ponovil. Mestni svetnik je navedel konkretne prehode, oddelek pa odgovor vezal na dokončanje cestnih del. Za vsak prehod posebej še iščemo odločitev in datum izvedbe.",
    "related": [
      "2025-01-21|Varne poti v šolo in vrtec",
      "2026-03-10|Vrtec ponovi pobudo za prehode in označene poti"
    ]
  },
  "2025-01-21|Varne poti v šolo in vrtec": {
    "sources": [
      "primc",
      "ogdp"
    ],
    "note": "Vrtec je predlog ponovil. Mestni svetnik je navedel konkretne prehode, oddelek pa odgovor vezal na dokončanje cestnih del. Za vsak prehod posebej še iščemo odločitev in datum izvedbe.",
    "related": [
      "2023-02-28|Predlog, naj skupina pripravi rešitve za varno šolsko pot in parkiranje",
      "2026-03-10|Vrtec ponovi pobudo za prehode in označene poti"
    ]
  },
  "2026-03-10|Vrtec ponovi pobudo za prehode in označene poti": {
    "sources": [
      "primc",
      "ogdp"
    ],
    "note": "Vrtec je predlog ponovil. Mestni svetnik je navedel konkretne prehode, oddelek pa odgovor vezal na dokončanje cestnih del. Za vsak prehod posebej še iščemo odločitev in datum izvedbe.",
    "related": [
      "2023-02-28|Predlog, naj skupina pripravi rešitve za varno šolsko pot in parkiranje",
      "2025-01-21|Varne poti v šolo in vrtec"
    ]
  },
  "2023-02-28|Nove ali obnovljene klopi v naselju": {
    "sources": [
      "klopi"
    ],
    "note": "V soseski je dokumentirana obnova klopi. Povezava med posamezno klopjo in predlogom iz leta 2023 ostaja odprta."
  },
  "2023-02-28|Omejitev hitrosti na 40 km/h": {
    "sources": [
      "meritev"
    ],
    "note": "Objavljene meritve na Linhartovi 35 se nanašajo na drugo cesto. Za omejitev 40 km/h, prikazovalnik ali stacionarni radar na Topniški izvedba v pregledanih virih ni izkazana.",
    "related": [
      "2025-09-30|Pobuda za stacionarni radar na Topniški"
    ]
  },
  "2025-09-30|Pobuda za stacionarni radar na Topniški": {
    "sources": [
      "meritev"
    ],
    "note": "Objavljene meritve na Linhartovi 35 se nanašajo na drugo cesto. Za omejitev 40 km/h, prikazovalnik ali stacionarni radar na Topniški izvedba v pregledanih virih ni izkazana.",
    "related": [
      "2023-02-28|Omejitev hitrosti na 40 km/h"
    ]
  },
  "2023-02-28|Ureditev igrišča in ograje ob dveh igriščih": {
    "sources": [],
    "note": "Za ograji ob igriščih na Fabianijevi–Endliherjevi in na koncu Majaronove nismo našli potrditve lastnikov ali poročila o postavitvi."
  },
  "2023-02-28|Pasji park, koši in čiščenje zelenic": {
    "sources": [],
    "note": "Za predlagani pasji park in posebne koše v Savskem naselju nismo našli lokacijske odločitve ali prevzema del."
  },
  "2023-02-28|Parkiranje med bloki in obnova talnih oznak": {
    "sources": [
      "parkiranje"
    ],
    "note": "Starejši odgovor pojasnjuje razmere v soseski. Za obnovo talnih črt na krakih Ulice Metoda Mikuža bi potrebovali delovni nalog ali potrditev zarisa."
  },
  "2023-02-28|Količki pri zaklonišču": {
    "sources": [
      "parkiranje"
    ],
    "note": "Pobuda za količke pri zaklonišču se ponovi. V mestnem odgovoru o Majaronovi ni potrditve postavitve teh količkov.",
    "related": [
      "2023-06-06|Parkiranje, količki in pešpot z Majaronove"
    ]
  },
  "2023-06-06|Parkiranje, količki in pešpot z Majaronove": {
    "sources": [
      "parkiranje"
    ],
    "note": "Pobuda za količke pri zaklonišču se ponovi. V mestnem odgovoru o Majaronovi ni potrditve postavitve teh količkov.",
    "related": [
      "2023-02-28|Količki pri zaklonišču"
    ]
  },
  "2023-02-28|Ali je tlakovanje križišča usklajeno z MOL?": {
    "sources": [],
    "note": "Vprašanje se je ponovilo na treh sejah. V pregledanih objavah ni pojasnila MOL o soglasju za točno to tlakovanje.",
    "related": [
      "2023-04-25|Ponovno vprašanje o tlakovanju križišča",
      "2023-06-06|Ponovno vprašanje o tlakovanju"
    ]
  },
  "2023-04-25|Ponovno vprašanje o tlakovanju križišča": {
    "sources": [],
    "note": "Vprašanje se je ponovilo na treh sejah. V pregledanih objavah ni pojasnila MOL o soglasju za točno to tlakovanje.",
    "related": [
      "2023-02-28|Ali je tlakovanje križišča usklajeno z MOL?",
      "2023-06-06|Ponovno vprašanje o tlakovanju"
    ]
  },
  "2023-06-06|Ponovno vprašanje o tlakovanju": {
    "sources": [],
    "note": "Vprašanje se je ponovilo na treh sejah. V pregledanih objavah ni pojasnila MOL o soglasju za točno to tlakovanje.",
    "related": [
      "2023-02-28|Ali je tlakovanje križišča usklajeno z MOL?",
      "2023-04-25|Ponovno vprašanje o tlakovanju križišča"
    ]
  },
  "2023-02-28|Promet z nove avtobusne postaje in navezava na Savsko": {
    "sources": [
      "drevesa"
    ],
    "note": "Za drevesa ob Linhartovi obstaja objava MOL. Odgovor na zahtevo ČS o prometnih tokovih ob avtobusni postaji in navezavi Šmartinske na Savsko ostaja odprt.",
    "related": [
      "2023-10-10|Vpliv prometa ob potniškem centru na stanovalce in drevesa"
    ]
  },
  "2023-10-10|Vpliv prometa ob potniškem centru na stanovalce in drevesa": {
    "sources": [
      "drevesa"
    ],
    "note": "Za drevesa ob Linhartovi obstaja objava MOL. Odgovor na zahtevo ČS o prometnih tokovih ob avtobusni postaji in navezavi Šmartinske na Savsko ostaja odprt.",
    "related": [
      "2023-02-28|Promet z nove avtobusne postaje in navezava na Savsko"
    ]
  },
  "2023-04-25|Pobuda za Savsko tržnico": {
    "sources": [],
    "note": "Pobuda za Savsko tržnico je zapisana. Za odločitev o prostoru, organizatorju ali začetku rednega delovanja nismo našli javnega dokazila."
  },
  "2023-06-06|Skrb stanovalcev glede dreves ob širitvi ceste": {
    "sources": [
      "drevesa",
      "cesta"
    ],
    "note": "MOL je opisala presajanje dreves in nove zasaditve. Za primerjavo z zahtevo stanovalcev manjka popis po posameznih drevesih."
  },
  "2023-06-06|Načrtovana gradnja in prostori za civilne pobude": {
    "sources": [
      "prostorski"
    ],
    "note": "Državni register potrjuje postopek za območje Soča J ob Stolpniški. Iz začetka prostorskega postopka ni razvidna dodelitev prostorov civilnim pobudam."
  },
  "2023-09-21|Ureditev športnega parka": {
    "sources": [
      "park",
      "sport"
    ],
    "note": "Mestna objava in upravljavec potrjujeta odprtje in uporabo športnega parka na Kranjčevi.",
    "related": [
      "2025-09-30|Začetek obnove športnega parka",
      "2026-05-13|Vabilo na odprtje športnega parka"
    ]
  },
  "2025-09-30|Začetek obnove športnega parka": {
    "sources": [
      "park",
      "sport"
    ],
    "note": "Mestna objava in upravljavec potrjujeta odprtje in uporabo športnega parka na Kranjčevi.",
    "related": [
      "2023-09-21|Ureditev športnega parka",
      "2026-05-13|Vabilo na odprtje športnega parka"
    ]
  },
  "2026-05-13|Vabilo na odprtje športnega parka": {
    "sources": [
      "park",
      "sport"
    ],
    "note": "Mestna objava in upravljavec potrjujeta odprtje in uporabo športnega parka na Kranjčevi.",
    "related": [
      "2023-09-21|Ureditev športnega parka",
      "2025-09-30|Začetek obnove športnega parka"
    ]
  },
  "2023-10-10|Načrt za leto 2025: 10.000 evrov za obnovo igral": {
    "sources": [],
    "note": "Septembra 2025 je predsedujoči poročal o prenovi otroškega igrišča in prispevku ČS. Načrtovanih 10.000 evrov je bilo predvidenih vnaprej. Končnega računa za to igrišče v pregledanem gradivu ni.",
    "related": [
      "2025-02-11|Obnova otroškega igrišča ob Linhartovi",
      "2025-09-30|Poročilo o prenovi otroškega igrišča"
    ]
  },
  "2025-02-11|Obnova otroškega igrišča ob Linhartovi": {
    "sources": [],
    "note": "Septembra 2025 je predsedujoči poročal o prenovi otroškega igrišča in prispevku ČS. Načrtovanih 10.000 evrov je bilo predvidenih vnaprej. Končnega računa za to igrišče v pregledanem gradivu ni.",
    "related": [
      "2023-10-10|Načrt za leto 2025: 10.000 evrov za obnovo igral",
      "2025-09-30|Poročilo o prenovi otroškega igrišča"
    ]
  },
  "2025-09-30|Poročilo o prenovi otroškega igrišča": {
    "sources": [],
    "note": "Septembra 2025 je predsedujoči poročal o prenovi otroškega igrišča in prispevku ČS. Načrtovanih 10.000 evrov je bilo predvidenih vnaprej. Končnega računa za to igrišče v pregledanem gradivu ni.",
    "related": [
      "2023-10-10|Načrt za leto 2025: 10.000 evrov za obnovo igral",
      "2025-02-11|Obnova otroškega igrišča ob Linhartovi"
    ]
  },
  "2023-11-07|Zastoji na križišču ob južnem dostopu do soseske": {
    "sources": [],
    "note": "Policija je na seji opisala nadzor ob konicah. Število konkretnih nadzorov ali poznejši učinek na zastoje na tem križišču nista objavljena v pregledanih virih."
  },
  "2023-11-07|Podpora pobudi stanovalcev za Matjažev park": {
    "sources": [],
    "note": "Svet je podprl pobudo za Matjažev park. Odločitve mestnega oddelka, zasaditvenega načrta ali prevzema del na zelenici pri Matjaževi 13–17 nismo našli."
  },
  "2023-11-28|Varnostne prioritete za leto 2024: vlomi in poškodovanje opreme": {
    "sources": [],
    "note": "Svet je v več letnih programih znova navedel Savsko naselje. Kolikokrat sta policija ali redarstvo tu opravila nadzor, iz teh programov ni mogoče razbrati.",
    "related": [
      "2024-12-03|Varnostne prioritete za leto 2025: promet in nadzor v soseski",
      "2025-12-02|Savsko naselje v prednostnih varnostnih nalogah za leto 2026"
    ]
  },
  "2024-12-03|Varnostne prioritete za leto 2025: promet in nadzor v soseski": {
    "sources": [],
    "note": "Svet je v več letnih programih znova navedel Savsko naselje. Kolikokrat sta policija ali redarstvo tu opravila nadzor, iz teh programov ni mogoče razbrati.",
    "related": [
      "2023-11-28|Varnostne prioritete za leto 2024: vlomi in poškodovanje opreme",
      "2025-12-02|Savsko naselje v prednostnih varnostnih nalogah za leto 2026"
    ]
  },
  "2025-12-02|Savsko naselje v prednostnih varnostnih nalogah za leto 2026": {
    "sources": [],
    "note": "Svet je v več letnih programih znova navedel Savsko naselje. Kolikokrat sta policija ali redarstvo tu opravila nadzor, iz teh programov ni mogoče razbrati.",
    "related": [
      "2023-11-28|Varnostne prioritete za leto 2024: vlomi in poškodovanje opreme",
      "2024-12-03|Varnostne prioritete za leto 2025: promet in nadzor v soseski"
    ]
  },
  "2024-02-06|Pobuda bankam in trgovcu za bankomat": {
    "sources": [],
    "note": "Sklep imenuje banke, Eurospin in Situlo. Javno dostopne potrditve banke ali upravljavca, da je bil na tej lokaciji nameščen bankomat, nismo našli."
  },
  "2024-02-06|Podpora čistilni akciji na Savskem hribu": {
    "sources": [
      "ciscenje"
    ],
    "note": "Razpored MOL potrjuje datum in kraj načrtovane akcije. Letno poročilo ČS za 2024 beleži sodelovanje pri čiščenju v soseski.",
    "related": [
      "2024-03-12|Vabilo na čistilno akcijo 23. marca"
    ]
  },
  "2024-03-12|Vabilo na čistilno akcijo 23. marca": {
    "sources": [
      "ciscenje"
    ],
    "note": "Razpored MOL potrjuje datum in kraj načrtovane akcije. Letno poročilo ČS za 2024 beleži sodelovanje pri čiščenju v soseski.",
    "related": [
      "2024-02-06|Podpora čistilni akciji na Savskem hribu"
    ]
  },
  "2024-03-12|Ponovno opozorilo o nevarnih drevesih": {
    "sources": [],
    "note": "Zapisnik razlikuje drevo na mestni zemlji od drevesa na drugi zelenici. Zaključka postopka za obe drevesi nismo našli."
  },
  "2024-03-12|Količki in zapora pred vrtcem Mladi rod": {
    "sources": [],
    "note": "Za višje količke in fizično zaporo na Savski 1 in 3a manjka potrditev postavitve. Predlogi za prehode v okolici vrtca so ločena zadeva."
  },
  "2024-04-09|Sestanek o skupnostnem prostoru": {
    "sources": [
      "knjiznica"
    ],
    "note": "Za predlagani novi skupnostni prostor ali izid tega sestanka ni dodatnega javnega sklepa.",
    "related": [
      "2024-04-09|Sestanek ustanov in društev na povabilo Knjižnice REČI"
    ]
  },
  "2024-04-09|Sestanek ustanov in društev na povabilo Knjižnice REČI": {
    "sources": [
      "knjiznica"
    ],
    "note": "Za predlagani novi skupnostni prostor ali izid tega sestanka ni dodatnega javnega sklepa.",
    "related": [
      "2024-04-09|Sestanek o skupnostnem prostoru"
    ]
  },
  "2024-05-14|Napoved odprtja prenovljenih prostorov šole": {
    "sources": [
      "sola"
    ],
    "note": "MOL je potrdila prenovo prostorov osnovne šole in vrtca."
  },
  "2024-06-11|Pobuda za ponovno odprtje šolskega igrišča po pouku": {
    "sources": [
      "dostop"
    ],
    "note": "Znana je odločitev šole iz leta 2024. Za poznejšo spremembo odpiralnega časa v pregledanem gradivu ni sklepa ali aktualnega urnika."
  },
  "2024-10-08|Košarkarski turnir za učence": {
    "sources": [],
    "note": "Letni poročili ČS za 2024 in 2025 beležita sodelovanje pri turnirjih za učence. Število udeležencev in poraba za posamezni turnir ostajata odprta.",
    "related": [
      "2025-02-11|Poročilo za leto 2024: čistilne akcije in košarka za učence",
      "2026-02-03|Poročilo za leto 2025: čistilne akcije in košarka za učence"
    ]
  },
  "2025-02-11|Poročilo za leto 2024: čistilne akcije in košarka za učence": {
    "sources": [],
    "note": "Letni poročili ČS za 2024 in 2025 beležita sodelovanje pri turnirjih za učence. Število udeležencev in poraba za posamezni turnir ostajata odprta.",
    "related": [
      "2024-10-08|Košarkarski turnir za učence",
      "2026-02-03|Poročilo za leto 2025: čistilne akcije in košarka za učence"
    ]
  },
  "2026-02-03|Poročilo za leto 2025: čistilne akcije in košarka za učence": {
    "sources": [],
    "note": "Letni poročili ČS za 2024 in 2025 beležita sodelovanje pri turnirjih za učence. Število udeležencev in poraba za posamezni turnir ostajata odprta.",
    "related": [
      "2024-10-08|Košarkarski turnir za učence",
      "2025-02-11|Poročilo za leto 2024: čistilne akcije in košarka za učence"
    ]
  },
  "2024-10-08|Hrup pri mizi za namizni tenis": {
    "sources": [],
    "note": "Na seji junija 2025 je predsedujoči poročal o zamenjavi mize. Za začetek redne vodene vadbe ni navedenega poročila ali urnika.",
    "related": [
      "2025-06-17|Zamenjana miza za namizni tenis in predlog vodenih dejavnosti"
    ]
  },
  "2025-06-17|Zamenjana miza za namizni tenis in predlog vodenih dejavnosti": {
    "sources": [],
    "note": "Na seji junija 2025 je predsedujoči poročal o zamenjavi mize. Za začetek redne vodene vadbe ni navedenega poročila ali urnika.",
    "related": [
      "2024-10-08|Hrup pri mizi za namizni tenis"
    ]
  },
  "2025-01-21|Predlog marčevske čistilne akcije": {
    "sources": [],
    "note": "Zaključni račun za 2025 beleži sodelovanje pri čistilnih akcijah v soseski. V njem ni potrditve, da je posamezna akcija potekala prav 2. marca.",
    "related": [
      "2025-02-11|Dogovor o soorganizaciji čistilne akcije"
    ]
  },
  "2025-02-11|Dogovor o soorganizaciji čistilne akcije": {
    "sources": [],
    "note": "Zaključni račun za 2025 beleži sodelovanje pri čistilnih akcijah v soseski. V njem ni potrditve, da je posamezna akcija potekala prav 2. marca.",
    "related": [
      "2025-01-21|Predlog marčevske čistilne akcije"
    ]
  },
  "2025-02-11|Soča J: predlog podzemne garaže za prebivalce obeh sosesk": {
    "sources": [
      "prostorski"
    ],
    "note": "Po predstavitvi variant je svet junija 2026 predlagal dodatno kletno etažo. Javni sklep o začetku priprave načrta in predlog ČS sama še ne potrjujeta dovoljenja ali gradnje.",
    "related": [
      "2026-05-13|Predstavitev načrta Soča J in razprava o prometu",
      "2026-06-09|Soča J: predlog dodatne kletne etaže za parkiranje"
    ]
  },
  "2026-05-13|Predstavitev načrta Soča J in razprava o prometu": {
    "sources": [
      "prostorski"
    ],
    "note": "Po predstavitvi variant je svet junija 2026 predlagal dodatno kletno etažo. Javni sklep o začetku priprave načrta in predlog ČS sama še ne potrjujeta dovoljenja ali gradnje.",
    "related": [
      "2025-02-11|Soča J: predlog podzemne garaže za prebivalce obeh sosesk",
      "2026-06-09|Soča J: predlog dodatne kletne etaže za parkiranje"
    ]
  },
  "2026-06-09|Soča J: predlog dodatne kletne etaže za parkiranje": {
    "sources": [
      "prostorski"
    ],
    "note": "Po predstavitvi variant je svet junija 2026 predlagal dodatno kletno etažo. Javni sklep o začetku priprave načrta in predlog ČS sama še ne potrjujeta dovoljenja ali gradnje.",
    "related": [
      "2025-02-11|Soča J: predlog podzemne garaže za prebivalce obeh sosesk",
      "2026-05-13|Predstavitev načrta Soča J in razprava o prometu"
    ]
  },
  "2025-05-06|Pobuda za promet in kolopark ob križišču": {
    "sources": [
      "mestno",
      "odgovor"
    ],
    "note": "Svet je zavrnil skupen predlog o avtobusih, koloparku in enosmernosti. Mestno vprašanje ob prenovi Linhartove zadeva širše območje in nima istega predmeta glasovanja."
  },
  "2025-11-06|Prenova lokalnega središča v prostorskem načrtu": {
    "sources": [],
    "note": "Po predstavitvi pogojev za Belokranjsko 6 iščemo sprejeti akt ali izvedbeni projekt, ki bi pokazal, kaj je dovoljeno in kaj je bilo izvedeno."
  },
  "2026-02-03|Pripombe o delih na Linhartovi in zahteva za informacije o delu sveta": {
    "sources": [
      "mestno",
      "odgovor"
    ],
    "note": "Mestni svetnik je vprašal o posledicah prometne ureditve. Oddelek je vsebinski odgovor odložil do konca del. Rešitve za posamezne dostope iz tega odgovora niso razvidne.",
    "related": [
      "2026-03-10|Dostop v sosesko po preureditvi Linhartove"
    ]
  },
  "2026-03-10|Dostop v sosesko po preureditvi Linhartove": {
    "sources": [
      "mestno",
      "odgovor"
    ],
    "note": "Mestni svetnik je vprašal o posledicah prometne ureditve. Oddelek je vsebinski odgovor odložil do konca del. Rešitve za posamezne dostope iz tega odgovora niso razvidne.",
    "related": [
      "2026-02-03|Pripombe o delih na Linhartovi in zahteva za informacije o delu sveta"
    ]
  },
  "2026-02-03|Pobuda za odstranitev avtomobila": {
    "sources": [],
    "note": "Za točno določeno vozilo na Mercatorjevem parkirišču v pregledanih javnih virih nismo našli potrditve odstranitve."
  },
  "2026-03-10|Ureditev Filipovega igrišča in lovilci žog": {
    "sources": [
      "filip"
    ],
    "note": "Septembra 2026 je predsedujoči poročal o začetku prenove ob Mislejevi. Za dokončanje lovilcev žog ali prevzem vseh del javnega dokazila nismo našli.",
    "related": [
      "2026-09-29|Začetek prenove športnega igrišča ob Mislejevi"
    ]
  },
  "2026-09-29|Začetek prenove športnega igrišča ob Mislejevi": {
    "sources": [
      "filip"
    ],
    "note": "Septembra 2026 je predsedujoči poročal o začetku prenove ob Mislejevi. Za dokončanje lovilcev žog ali prevzem vseh del javnega dokazila nismo našli.",
    "related": [
      "2026-03-10|Ureditev Filipovega igrišča in lovilci žog"
    ]
  },
  "2026-06-09|Postavitev ohišja radarja na Linhartovi": {
    "sources": [
      "meritev"
    ],
    "note": "MOL je pozneje poleg postavitve ohišja potrdila tudi izvajanje meritev pri šoli na Linhartovi 35."
  }
};

function neighbourhoodReview(entry) {
  return savskoReviews[entry.date+'|'+entry.title];
}
function reviewText(entry) {
  const review=neighbourhoodReview(entry);
  if(!review)return '';
  return [review.note,...review.sources.map(id=>Object.values(savskoSources[id]).slice(0,4).join(' '))].join(' ');
}
function reviewEvidence(entry) {
  const review=neighbourhoodReview(entry);
  if(!review)return '';
  const items=review.sources.map(id=>{
    const source=savskoSources[id];
    return '<li><strong>'+h(source.who)+'</strong> · '+h(source.when)+'<p>'+h(source.fact)+'</p>'+link(source.url,source.label)+'</li>';
  });
  const related=(review.related||[]).map(key=>{
    const [date,title]=key.split('|');
    const target=db.savsko.find(e=>e.date===date&&e.title===title);
    return target?anchor('zapisniki/'+date+'/'+target.page,day(date)+' · '+target.title):'';
  });
  const closing=entry.title.includes('posvetovaln')?getDecisionRows().find(r=>r.key==='2026-11-12-2-24'):null;
  if(closing)related.push(anchor(overviewRoute(closing.m.date,closing.d.id),'12. 11. 2026 · Ukinitev delovnih teles'));
  return '<section class="evidence public-review"><strong>Kaj vemo o izidu?</strong><p>'+h(review.note)+'</p>'+
    (items.length?'<details><summary>Zunanji viri ('+items.length+')</summary><ul>'+items.join('')+'</ul></details>':'')+
    (related.length?'<details><summary>Povezane obravnave ČS</summary><div class="links">'+related.join('')+'</div></details>':'')+'</section>';
}
function laterEvidence(row) {
  return [...row.trail.events].filter(e=>e.date>row.m.date).sort((a,b)=>b.date.localeCompare(a.date))[0];
}
function decisionSummary(row,detail=false) {
  const item=decisionBriefs[row.key];
  if(!item)return '';
  const parts=[item.summary];
  const evidence=laterEvidence(row);
  if(item.outcome)parts.push(item.outcome);
  else if(evidence)parts.push(day(evidence.date)+' · '+evidence.text);
  else if(!item.minutes && !item.complete)parts.push(item.gap||'Za to pobudo v pregledanih dokumentih ni navedeno, kako se je nanjo odzval naslovnik.');
  const related=(item.related||[]).map(key=>{
    const other=getDecisionRows().find(r=>r.key===key);
    return other?anchor(overviewRoute(other.m.date,other.d.id),'Sklep '+other.d.id+' · '+day(other.m.date)):'';
  });
  for(const date of item.minutes||[])related.push(anchor('seje/'+date,day(date)+' · seja'));
  if(evidence&&!item.outcome)related.push(link(evidence.url,'Poznejše dokazilo · '+day(evidence.date)));
  if(detail){
    for(const entry of db.savsko.filter(e=>e.date===row.m.date&&e.decisions.includes(row.d.id))){
      related.push(anchor(filteredRoute('savsko',new URLSearchParams({q:entry.title,leto:entry.date.slice(0,4)})),'Savsko naselje · '+entry.title));
      for(const id of neighbourhoodReview(entry)?.sources||[]){
        const source=savskoSources[id];
        related.push(link(source.url,source.who+' · '+source.label));
      }
    }
  }
  if(detail)related.unshift(link(row.m.pdf+'#page='+row.d.page,'Podlaga · str. '+row.d.page));
  return '<div class="decision-brief"><strong>Povzetek</strong><p>'+h(parts.join(' '))+'</p>'+
    (detail&&related.length?'<div class="links">'+related.join('')+'</div>':'')+'</div>';
}
function hasDecisionEvidence(row) {
  return Boolean(laterEvidence(row)||row.extended?.events.some(e=>e.date>row.m.date)||
    decisionBriefs[row.key]?.related?.some(key=>key.slice(0,10)>row.m.date));
}
