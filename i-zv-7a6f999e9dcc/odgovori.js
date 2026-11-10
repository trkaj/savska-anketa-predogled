/* Odgovori list na predogledu. Vir: uradne oddaje (JSON), brez e-naslovov in kod.
   Nova izpolnjena lista: dodaj vnos v ODGOVORI z prioritet, prioritetId, counts in odgovori[id]. */
const TEMA_SID = {
  "parkiranje": "p-parkiranje",
  "storitve": "p-storitve",
  "promet": "p-promet",
  "varnost": "p-varnost",
  "klopi": "p-klopi",
  "cistoca": "p-cistoca",
  "zelenje": "p-zelenje",
  "dom": "p-dom",
  "zrak": "p-zrak",
  "mladi": "p-mladi",
  "maladela": "p-maladela",
  "obvescanje": "komunikacija",
  "zakaj": "zakaj"
};

const LISTE_KRATKO = {
  1: "Svoboda",
  2: "SLS",
  3: "Demokrati",
  4: "Pirati",
  5: "Levica",
  6: "Prerod",
  7: "SDS",
  8: "Vesna",
  9: "NSi in Fokus",
  10: "SD",
  11: "Cilj",
  12: "Straža",
  13: "Lj. smo vsi",
  14: "Resni.ca",
  15: "LZJ"
};

const VPRASANJA = [
  {
    "id": "parkiranje-1",
    "temaId": "parkiranje",
    "tema": "Parkiranje",
    "label": "Lastništvo parkirišč",
    "vprasanje": "Ali se zavežete, da boste v prvih 6 mesecih dali pobudo MOL, da javno pojasni, katera parkirišča v naselju so v lasti MOL, katera na zemljiščih etažnih lastnikov in katera so udeležena v postopku ZVEtL?",
    "sid": "p-parkiranje"
  },
  {
    "id": "parkiranje-2",
    "temaId": "parkiranje",
    "tema": "Parkiranje",
    "label": "Ureditev parkiranja za stanovalce",
    "vprasanje": "Ali se kot člani sveta ČS zavežete, da boste v prvem letu skupaj s civilno družbo, MOL, etažnimi lastniki in upravniki poiskali način, kako urediti parkiranje v Savskem naselju, da imajo stanovalci prednost, pločniki in zelenice pa ostanejo prosti?",
    "sid": "p-parkiranje"
  },
  {
    "id": "storitve-1",
    "temaId": "storitve",
    "tema": "Pošta, banka in druge storitve",
    "label": "Pismo Pošti in bankam",
    "vprasanje": "Ali se zavežete, da se bo svet ČS v prvih 3 mesecih s podatki iz ankete pisno obrnil na Pošto Slovenije in banke ter njihov odgovor objavil?",
    "sid": "p-storitve"
  },
  {
    "id": "storitve-2",
    "temaId": "storitve",
    "tema": "Pošta, banka in druge storitve",
    "label": "Umestitev storitev v naselje",
    "vprasanje": "Ali se kot člani sveta zavežete, da se boste skupaj s civilno pobudo, MOL, partnerji, razpisi, poiskali ali ustvarili rešitve za umestitev Pošte in Banke in drugih storitev iz ankete, na primer lekarne, trgovine in pekarne, v Savsko naselje?",
    "sid": "p-storitve"
  },
  {
    "id": "promet-1",
    "temaId": "promet",
    "tema": "Promet skozi naselje",
    "label": "Strokovna prometna presoja",
    "vprasanje": "Ali se kot člani sveta ČS zavežete, da boste v prvem letu dali pobudo MOL za strokovno prometno presojo Savskega naselja, ki vključi tudi širitev Šmartinske ceste, cesto na Vilharjevi (podhod pri Orto Baru) in ureditev prometa, če bo ob naselju več blokov — da MOL variante predstavi prebivalcem, preden odloči, in da se promet uredi tako, da se onesnaženje ne poveča?",
    "sid": "p-promet"
  },
  {
    "id": "promet-2",
    "temaId": "promet",
    "tema": "Promet skozi naselje",
    "label": "Varne poti ob šoli in vrtcu",
    "vprasanje": "Ali se zavežete, da boste do začetka šolskega leta 2027/28 dali pobudo MOL za varne prehode in umirjanje prometa ob šoli in vrtcu?",
    "sid": "p-promet"
  },
  {
    "id": "promet-3",
    "temaId": "promet",
    "tema": "Promet skozi naselje",
    "label": "Preverjanje motenj s prebivalci",
    "vprasanje": "Ali se kot člani sveta ČS zavežete, da boste s prebivalci, ustreznimi strokovnjaki in odločevalci preverili, kaj jih pri cestah in prometnih ureditvah moti, in poiskali rešitve?",
    "sid": "p-promet"
  },
  {
    "id": "varnost-1",
    "temaId": "varnost",
    "tema": "Igle in droge, občutek varnosti",
    "label": "Srečanja s policijo in redarstvom",
    "vprasanje": "Ali se zavežete, da bo svet ČS vsaj dvakrat na leto sklical srečanje s policijo, Mestnim redarstvom in prebivalci, prvo v 6 mesecih?",
    "sid": "p-varnost"
  },
  {
    "id": "varnost-2",
    "temaId": "varnost",
    "tema": "Igle in droge, občutek varnosti",
    "label": "Odstranjevanje igel",
    "vprasanje": "Ali se zavežete, da boste v prvih 3 mesecih dali pobudo MOL za redne obhode in hitro odstranjevanje igel na mestih, ki jih navajajo prebivalci, in o odgovoru poročali?",
    "sid": "p-varnost"
  },
  {
    "id": "klopi-1",
    "temaId": "klopi",
    "tema": "Več klopi",
    "label": "Predlogi mest za klopi",
    "vprasanje": "Ali se zavežete, da boste pred rokom poziva za mala dela 2028–2029 prebivalce javno povabili, da predlagajo mesta za nove klopi (tudi v senci in ob poteh za starejše)?",
    "sid": "p-klopi"
  },
  {
    "id": "klopi-2",
    "temaId": "klopi",
    "tema": "Več klopi",
    "label": "Pomoč lastnikom pri klopeh",
    "vprasanje": "Ali se zavežete, da boste lastnikom in upravnikom, ki želijo klop na zemljišču ob bloku, v prvem letu mandata ponudili pomoč z informacijami (npr. vzorec sklepa zbora lastnikov)?",
    "sid": "p-klopi"
  },
  {
    "id": "cistoca-1",
    "temaId": "cistoca",
    "tema": "Čistoča in pasji iztrebki",
    "label": "Čistilne akcije",
    "vprasanje": "Ali se zavežete, da bo svet ČS od pomladi 2027 vsaj dvakrat na leto organiziral čistilno akcijo v naselju v dogovoru z Voka Snago in da boste kot člani sveta pri čistilnih akcijah in popravilih tudi sami kdaj sodelovali?",
    "sid": "p-cistoca"
  },
  {
    "id": "cistoca-2",
    "temaId": "cistoca",
    "tema": "Čistoča in pasji iztrebki",
    "label": "Koši za pasje iztrebke",
    "vprasanje": "Ali se zavežete, da boste pri ureditvi čistoče v naselju upoštevali tudi želje skrbnikov psov — da so koši za pasje iztrebke dosegljivi in redno prazni — in da boste spodbujali, da je naselje prijazno do kužkov?",
    "sid": "p-cistoca"
  },
  {
    "id": "zelenje-1",
    "temaId": "zelenje",
    "tema": "Drevesa in zelenice",
    "label": "Pregled dreves in zasaditve",
    "vprasanje": "Ali se zavežete, da boste v prvih 6 mesecih dali pobudo MOL, da pregleda drevesa v naselju (katera so zdrava, katera ne in katera so primerna za posek), predvidi nove zasaditve, za vsako posekano drevo na javni površini zasadi novo in prebivalce o poseku obvesti vnaprej?",
    "sid": "p-zelenje"
  },
  {
    "id": "zelenje-2",
    "temaId": "zelenje",
    "tema": "Drevesa in zelenice",
    "label": "Izbira mest z prebivalci",
    "vprasanje": "Ali se zavežete, da boste prebivalce vključili pri izbiri mest za nova drevesa, preden jih predlagate v plan malih del 2028–2029?",
    "sid": "p-zelenje"
  },
  {
    "id": "dom-1",
    "temaId": "dom",
    "tema": "Dom skupnosti, prostor za druženje",
    "label": "Prostori za skupne dejavnosti",
    "vprasanje": "Ali se kot člani sveta ČS zavežete, da boste v prvem letu pregledali, kateri prostori v Savskem naselju so na voljo za skupne dejavnosti, in da boste uredili prostore v domu skupnosti za souporabo prebivalcev?",
    "sid": "p-dom"
  },
  {
    "id": "dom-2",
    "temaId": "dom",
    "tema": "Dom skupnosti, prostor za druženje",
    "label": "Obnova Belokranjske 6",
    "vprasanje": "Ali se zavežete, da boste v prvem letu dali pobudo MOL, da objavi načrt in rok obnove stavbe na Belokranjski 6, ter da bo urnik doma skupnosti dosegljiv prebivalkam in prebivalcem za souporabo?",
    "sid": "p-dom"
  },
  {
    "id": "zrak-1",
    "temaId": "zrak",
    "tema": "Boljši zrak in hrup",
    "label": "Meritve zraka in hrupa",
    "vprasanje": "Ali se zavežete, da boste v prvih 6 mesecih dali pobudo MOL za meritve zraka in hrupa v naselju ter za objavo rezultatov?",
    "sid": "p-zrak"
  },
  {
    "id": "zrak-2",
    "temaId": "zrak",
    "tema": "Boljši zrak in hrup",
    "label": "Hrup ob železnici in cestah",
    "vprasanje": "Ali ste za to, da se hrup in onesnaženje v Savskem naselju ob železnici in glavnih cestah uredi? Primeri: sklep mestni upravi za protihrupno zaščito ob progi; povabilo MOL in Slovenskih železnic na sejo ČS; umirjanje prometa ali zeleni pas ob cestah; podpora pobudam prebivalcev.",
    "sid": "p-zrak"
  },
  {
    "id": "mladi-1",
    "temaId": "mladi",
    "tema": "Igrišča in prostor za mlade",
    "label": "Odprtost šolskega igrišča",
    "vprasanje": "Ali se zavežete, da boste v prvih 6 mesecih dali pobudo MOL in šoli za popoldansko odprtost šolskega igrišča ter za prostor pod streho za mlade?",
    "sid": "p-mladi"
  },
  {
    "id": "mladi-2",
    "temaId": "mladi",
    "tema": "Igrišča in prostor za mlade",
    "label": "Pregled igrišč z mladimi",
    "vprasanje": "Ali se zavežete, da boste pred novo ureditvijo pregledali igrala, igrišča in možne prostore za mlade v naselju, se pogovorili z otroki in mladimi ter njihove želje in pobude upoštevali pri načrtu, tudi da se poišče prostor za mlade, na primer v Domu skupnosti ali drugem javnem prostoru?",
    "sid": "p-mladi"
  },
  {
    "id": "maladela-1",
    "temaId": "maladela",
    "tema": "Mala dela ČS in prijave poškodb",
    "label": "Predlogi za mala dela",
    "vprasanje": "Ali se zavežete, da boste skupaj s civilno družbo poiskali, kje v Savskem naselju so potrebni predlogi iz ankete (klopi, koši, drevesa, oprema igrišč, kolesarska stojala), in da jih boste predlagali v plan malih del 2028–2029?",
    "sid": "p-maladela"
  },
  {
    "id": "maladela-2",
    "temaId": "maladela",
    "tema": "Mala dela ČS in prijave poškodb",
    "label": "Obvestilo pred rokom",
    "vprasanje": "Ali se zavežete, da boste prebivalce in upravnike v naselju o pozivu za mala dela 2028–2029 obvestili vsaj 3 tedne pred rokom (oglasne deske, e-obvestila, družbena omrežja)?",
    "sid": "p-maladela"
  },
  {
    "id": "maladela-3",
    "temaId": "maladela",
    "tema": "Mala dela ČS in prijave poškodb",
    "label": "Zemljišča, ki niso MOL",
    "vprasanje": "Ali se zavežete, da boste za predloge na zemljiščih, ki niso v lasti MOL (med bloki, v postopku ZVEtL), lastnikom in upravnikom pomagali z informacijami in v prvem letu dali pobudo MOL, da pojasni stanje teh zemljišč?",
    "sid": "p-maladela"
  },
  {
    "id": "obvescanje-1",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Prenos in posnetki sej",
    "vprasanje": "Prenos in posnetki sej: Ali boste kot člani sveta ČS sklenili, da se seje snemajo ali prenašajo v živo (vsaj zvočni posnetek) in da je na voljo vsaj magnetogram oziroma prepis, ter poiskali sredstva in rešitev, skladno z varstvom osebnih podatkov?",
    "sid": "komunikacija"
  },
  {
    "id": "obvescanje-2",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Jasni zapisniki in povzetki",
    "vprasanje": "Jasni zapisniki in povzetki: Ali boste zagotovili, da bodo v zapisnikih jasno zapisani predlogi in glavni argumenti ter da bo v 3 dneh po vsaki seji objavljen kratek povzetek?",
    "sid": "komunikacija"
  },
  {
    "id": "obvescanje-3",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Sprotno obveščanje",
    "vprasanje": "Sprotno obveščanje: Ali boste kot člani sveta ČS odprli lastne družbene kanale, dali pobudo, da se naročanje na novice MOL uredi po ČS, in s pomočjo upravnikov in predstavnikov vhodov obveščali tudi prek oglasnih desk in tiskanih obvestil, s soglasjem prejemnikov?",
    "sid": "komunikacija"
  },
  {
    "id": "obvescanje-4",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Vključevanje pred sejo",
    "vprasanje": "Vključevanje pred sejo: Ali boste zagotovili, da sta dnevni red in gradivo objavljena vsaj 7 dni pred sejo in da je na seji čas za vprašanja občanov?",
    "sid": "komunikacija"
  },
  {
    "id": "obvescanje-5",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Odgovor na pobude in OPPN",
    "vprasanje": "Odgovor na pobude in OPPN: Ali boste zagotovili, da vsak, ki da pobudo ČS, dobi odgovor v določenem roku, da bo javen seznam pobud z njihovim stanjem in da boste prebivalce o spremembah OPPN obveščali že v fazi priprave, ne šele ob javni razgrnitvi?",
    "sid": "komunikacija"
  },
  {
    "id": "obvescanje-6",
    "temaId": "obvescanje",
    "tema": "Obveščanje in komunikacija s ČS",
    "label": "Oseba za stik s prebivalci",
    "vprasanje": "Ali se kot člani sveta ČS zavežete, da boste MOL predlagali in podprli, naj za ČS Bežigrad zagotovi dodatno osebo, ki bo skrbela za koordinacijo in stik s civilno družbo in lokalnimi prebivalci?",
    "sid": "komunikacija"
  },
  {
    "id": "zakaj-3",
    "temaId": "zakaj",
    "tema": "Zakaj glasovati za vas",
    "label": "Delo tudi, če ne bodo izvoljeni",
    "vprasanje": "Če ne boste izvoljeni v svet ČS, se boste še vseeno trudili za Savsko naselje — in kaj boste naredili v tem primeru?",
    "sid": "zakaj"
  }
];

const ODGOVORI = {
  "2": {
    "prioritet": [
      "Pošta, banka in druge storitve",
      "Drevesa in zelenice",
      "Dom skupnosti, prostor za druženje",
      "Boljši zrak in hrup",
      "Igrišča in prostor za mlade"
    ],
    "prioritetId": [
      "storitve",
      "zelenje",
      "dom",
      "zrak",
      "mladi"
    ],
    "counts": {
      "da": 19,
      "delno": 0,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Da",
      "obvescanje-2": "Da",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Da",
      "obvescanje-6": "Da",
      "parkiranje-1": "Da",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Da",
      "zakaj-3": "Da"
    }
  },
  "5": {
    "prioritet": [
      "Parkiranje",
      "Pošta, banka in druge storitve",
      "Igle in droge, občutek varnosti",
      "Drevesa in zelenice",
      "Igrišča in prostor za mlade"
    ],
    "prioritetId": [
      "parkiranje",
      "storitve",
      "varnost",
      "zelenje",
      "mladi"
    ],
    "counts": {
      "da": 30,
      "delno": 1,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Da",
      "obvescanje-2": "Da",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Da",
      "obvescanje-6": "Da",
      "parkiranje-1": "Da",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "promet-1": "Da",
      "promet-2": "Da",
      "promet-3": "Da",
      "varnost-1": "Da",
      "varnost-2": "Da",
      "klopi-1": "Da",
      "klopi-2": "Da",
      "cistoca-1": "Delno",
      "cistoca-2": "Da",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Da",
      "maladela-1": "Da",
      "maladela-2": "Da",
      "maladela-3": "Da",
      "zakaj-3": "Da"
    }
  },
  "7": {
    "prioritet": [
      "Parkiranje",
      "Pošta, banka in druge storitve",
      "Promet skozi naselje",
      "Boljši zrak in hrup",
      "Mala dela ČS in prijave poškodb"
    ],
    "prioritetId": [
      "parkiranje",
      "storitve",
      "promet",
      "zrak",
      "maladela"
    ],
    "counts": {
      "da": 0,
      "delno": 31,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Delno",
      "obvescanje-2": "Delno",
      "obvescanje-3": "Delno",
      "obvescanje-4": "Delno",
      "obvescanje-5": "Delno",
      "obvescanje-6": "Delno",
      "parkiranje-1": "Delno",
      "parkiranje-2": "Delno",
      "storitve-1": "Delno",
      "storitve-2": "Delno",
      "promet-1": "Delno",
      "promet-2": "Delno",
      "promet-3": "Delno",
      "varnost-1": "Delno",
      "varnost-2": "Delno",
      "klopi-1": "Delno",
      "klopi-2": "Delno",
      "cistoca-1": "Delno",
      "cistoca-2": "Delno",
      "zelenje-1": "Delno",
      "zelenje-2": "Delno",
      "dom-1": "Delno",
      "dom-2": "Delno",
      "zrak-1": "Delno",
      "zrak-2": "Delno",
      "mladi-1": "Delno",
      "mladi-2": "Delno",
      "maladela-1": "Delno",
      "maladela-2": "Delno",
      "maladela-3": "Delno",
      "zakaj-3": "Delno"
    }
  },
  "8": {
    "prioritet": [
      "Parkiranje",
      "Pošta, banka in druge storitve",
      "Drevesa in zelenice",
      "Dom skupnosti, prostor za druženje",
      "Mala dela ČS in prijave poškodb"
    ],
    "prioritetId": [
      "parkiranje",
      "storitve",
      "zelenje",
      "dom",
      "maladela"
    ],
    "counts": {
      "da": 29,
      "delno": 2,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Da",
      "obvescanje-2": "Da",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Da",
      "obvescanje-6": "Delno",
      "parkiranje-1": "Da",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "promet-1": "Da",
      "promet-2": "Da",
      "promet-3": "Da",
      "varnost-1": "Da",
      "varnost-2": "Da",
      "klopi-1": "Da",
      "klopi-2": "Da",
      "cistoca-1": "Da",
      "cistoca-2": "Da",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Delno",
      "maladela-1": "Da",
      "maladela-2": "Da",
      "maladela-3": "Da",
      "zakaj-3": "Da"
    }
  },
  "11": {
    "prioritet": [
      "Parkiranje",
      "Pošta, banka in druge storitve",
      "Drevesa in zelenice",
      "Dom skupnosti, prostor za druženje",
      "Igrišča in prostor za mlade"
    ],
    "prioritetId": [
      "parkiranje",
      "storitve",
      "zelenje",
      "dom",
      "mladi"
    ],
    "counts": {
      "da": 31,
      "delno": 0,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Da",
      "obvescanje-2": "Da",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Da",
      "obvescanje-6": "Da",
      "parkiranje-1": "Da",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "promet-1": "Da",
      "promet-2": "Da",
      "promet-3": "Da",
      "varnost-1": "Da",
      "varnost-2": "Da",
      "klopi-1": "Da",
      "klopi-2": "Da",
      "cistoca-1": "Da",
      "cistoca-2": "Da",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Da",
      "maladela-1": "Da",
      "maladela-2": "Da",
      "maladela-3": "Da",
      "zakaj-3": "Da"
    }
  },
  "13": {
    "prioritet": [
      "Parkiranje",
      "Promet skozi naselje",
      "Igle in droge, občutek varnosti",
      "Dom skupnosti, prostor za druženje",
      "Boljši zrak in hrup"
    ],
    "prioritetId": [
      "parkiranje",
      "promet",
      "varnost",
      "dom",
      "zrak"
    ],
    "counts": {
      "da": 31,
      "delno": 0,
      "ne": 0
    },
    "odgovori": {
      "obvescanje-1": "Da",
      "obvescanje-2": "Da",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Da",
      "obvescanje-6": "Da",
      "parkiranje-1": "Da",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "promet-1": "Da",
      "promet-2": "Da",
      "promet-3": "Da",
      "varnost-1": "Da",
      "varnost-2": "Da",
      "klopi-1": "Da",
      "klopi-2": "Da",
      "cistoca-1": "Da",
      "cistoca-2": "Da",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Da",
      "maladela-1": "Da",
      "maladela-2": "Da",
      "maladela-3": "Da",
      "zakaj-3": "Da"
    }
  },
  "15": {
    "prioritet": [
      "Parkiranje",
      "Promet skozi naselje",
      "Čistoča in pasji iztrebki",
      "Drevesa in zelenice",
      "Dom skupnosti, prostor za druženje"
    ],
    "prioritetId": [
      "parkiranje",
      "promet",
      "cistoca",
      "zelenje",
      "dom"
    ],
    "counts": {
      "da": 24,
      "delno": 6,
      "ne": 1
    },
    "odgovori": {
      "obvescanje-1": "Ne",
      "obvescanje-2": "Delno",
      "obvescanje-3": "Da",
      "obvescanje-4": "Da",
      "obvescanje-5": "Delno",
      "obvescanje-6": "Delno",
      "parkiranje-1": "Delno",
      "parkiranje-2": "Da",
      "storitve-1": "Da",
      "storitve-2": "Da",
      "promet-1": "Da",
      "promet-2": "Da",
      "promet-3": "Da",
      "varnost-1": "Da",
      "varnost-2": "Da",
      "klopi-1": "Da",
      "klopi-2": "Da",
      "cistoca-1": "Da",
      "cistoca-2": "Delno",
      "zelenje-1": "Da",
      "zelenje-2": "Da",
      "dom-1": "Da",
      "dom-2": "Da",
      "zrak-1": "Da",
      "zrak-2": "Da",
      "mladi-1": "Da",
      "mladi-2": "Da",
      "maladela-1": "Da",
      "maladela-2": "Da",
      "maladela-3": "Delno",
      "zakaj-3": "Da"
    }
  }
};

const RAZLAGE = {
  "2": {
    "obvescanje-1": "Nisem tehnik, sem pa organizator, komunikator in skrbnik besede, torej bo to moje področje",
    "obvescanje-2": "Po dogodku bom poskrbela za zapis.",
    "obvescanje-3": "kot pisateljica, novinarka...",
    "obvescanje-4": "Ja, zahtevala bom informacije, gradiva in drugo, od pristojnih in jih v kratki obliki in nazorno, da bo besedilo razumel vsakdo.",
    "obvescanje-5": "Ja, obveščanje bo sprotno, pa razlogi zakaj, kdo in kje je zatajil tudi! Poimensko!",
    "obvescanje-6": "Seveda, saj je obseg dela zelo velik in nujno je, da MOL skrbi tudi za četrtne skupnosti, ki so ven iz centra mesta. Te so v primerjavi s centrom zapuščene!\nDovolj je tega, da župan vidi do konice svojega nosu in se zave, da je MOL mesto s 17 četrtnimi skupnostmi.",
    "parkiranje-1": "v optimalnih časovnih gabaritih, po sondiranju terena na MOL in sodelovanju s tamkajšnjimi zaposlenimi in odgovornimi.",
    "parkiranje-2": "S pogovori, pisanjem in komunikacijo s pristojnimi.",
    "storitve-1": "Komunikacija s pošto je zelo težka. Pošta je dolgo ignorirala stanovalce soseke Župančičeve jame, Savskemu naselju pa je pošto celo vzela. Župančičeva jama je zaposljevala veliko oholih, samovšečnih, lenih in neprijaznih ženskih uslužbenk. Zdaj poleg znamk dosti več skorajda ne moreš kupiti, poštnih storitev pa ne opraviti.\nJa, z vso vnemo bom poskrbela za komunikacijo s pošto in drugimi vladnimi institucijami, da se POŠTA ZGODI!\nZavzela se bom, da slovenska pošta ne bo šla po poti Danske in da Savskemu naselju vrnila dolgoletno institucijo",
    "storitve-2": "Komunikacija in sodelovanje z vsemi potrebnimi institucijami, organi,...",
    "zelenje-1": "Komunikacija in sodelovanje z vsemi potrebnimi institucijami, podjetji...",
    "zelenje-2": "S prebivalci in Arboretumom bomo izbrali prava drevesa in prava mesta zanje, toliko bolj, ker ima Arboretum zdaj celo pot dreves, ki so lažje prilagodljiva novodobnim vremenskim pojavom.",
    "dom-1": "Vsekakor je začetek v naboru prostorov, ki so na voljo.\nSledi pogovor s člani sveta ČS, katere dejavnosti bomo izpeljali najprej in katere malo kasneje,\nPotem so na vrsti nositelji projektov, programov...\nIn začetek dela!",
    "dom-2": "Aktivno sodelovanje, prevzem dela po dogovoru.",
    "zrak-1": "Aktivno sodelovanje, prevzem dela po dogovoru.",
    "zrak-2": "Sodelovanje po potrebi.",
    "mladi-1": "V sodelovanju z ostalimi člani bom aktivna na meni določenih nalogah in skrbela za njih uresničitev v najkrajšem možnem času.",
    "mladi-2": "Kjer bo dogovor to dovoljeval.",
    "zakaj-1": "Ker delujemo pod sloganom \"NAZAJ K ČLOVEKU!!\nKer imamo VREDNOTE, spoštujemo DEDIŠČINO, ker nam je ŽIVLJENJE v MIRU, v DRUŽBI, čistem OKOLJU, ob čisti VODI in ZRAKU - SVETO! Ker vabimo celo sosesko v SKUPNO DRUŽINO, kjer bomo poskrbeli, da samote, samosti, velike praznine, občutka zapuščenosti,..., ne bo več!",
    "zakaj-2": "Moja zaveza bo skrb za človeka; moje delovanje bo potekalo pod sloganom: \"Nazaj k člo veku\"! V mislih imam takorekoč \"software\" življenja v Ljubljani, da bo življenje za kanček bolj znosno (vsaj za večino), bolj prijazno, veselo in ne tako prazno, samotno, žalostno, že skoraj nevzdržno.\nZavzela se bom za posameznika, družino, mlade pare in zakonce, mamice, ženske samohranilke in moške samohranilce, otroke, mladostnike in ljudi v zlatih letih. Vzpostavila bom skupino \"živih in radostnih ljudi\" ki bodo živeli sožitje kot je včasih bilo, naredila bom vse, da bo zaživela skupina, ki si bo pomagala (urejanje nakupov za tiste, ki to ne morejo sami, čuvanje živali, ko bodo njihovi lastniki odsotni, skrb za osebe, ki jih v času odsotnosti sorodnikov (invalidi ali nepokretni starejši) ni moč pustiti samih, zalivanje cvetja,...\nOrganizirala bom skupino \"Champagne Station\", za  vse ljubiteljice/ljubitelje penin, za druženje, promocije, izlete...\nDogodke pod naslovom: \"ZLATI PROGRAM ZA ZLATA LETA\"!; za osebe, ki so čez prag aktivnega dela; druženje, izleti, ogled dogodkov,...\nNa kratko: zpostavila bom DRAGULJARNO UŽITKOV in ZATOČIŠČE ZA ČLOVEKA - SANATORIJ ZA DUŠO (poleg vsega že naštetega, spoved za človeške probleme in podporo odvisnikom, ki želijo izstopiti iz pekla drog, alkohola, iger na srečo,..., so že na tej poti in potrebujejo podporo, pohvalo, informacije...\n\nZavzemala se bom, da ne bo samote, praznine, dolgega časa,...; za vse, ki bodo to želeli!\nIn sicer v sklopu obstoječih prostorskih zmogljivosti, kasneje v sodelovanju z različnimi ponudniki, donatorji in sponzorji.",
    "zakaj-3": "Sodelovala tam, kjer bo to potrebno. In kjer bom dobrodošla."
  },
  "5": {
    "obvescanje-1": "Na drugi seji bom predlagal, da so na voljo magnetogrami in prepisi na sejah, če je to zakonsko dopustno. Eanko velja za vse predloge, ki so vezane na transparentnost sej",
    "storitve-1": "Da, to sem storil že večkrat. Lahko ponovno.",
    "varnost-2": "Sam sem na to temo prejšnji mandat že dal predlog za sklic in podobno seja je zaradi pritožb krajanov prejšnji mandat že bila in  lahko ponovno dam predlog, da vidimo ali se je od zadnje seje na to temo kaj spremenilo. Važno je spremeniti odnos MOL do tega vprašanja v celoti",
    "cistoca-1": "Absolutno",
    "zakaj-1": "Mislim, da si smo skozi dosedanje delo pokazali, da se nam lahko zaupa.",
    "zakaj-2": "Od mene lahko pričakujete aktivnost in trud tak kot sem že 8 let do zdaj. Sam bom na voljo in dostopen za vse prebivalce Savskega na Rezultati pa niso odvisni samo od mene. Glede na izkušnje, ki sem si jih nabral, ugotavljam, da so obenem zelo važni dejavniki odzivnost Mestne občine Ljubljana in aktivnost prebivalstva (peticije, pobude) ter pripravljenost na odkrit in iskren dialog."
  },
  "7": {
    "zakaj-1": "Ker smo povsem nedolžni glede škode, ki jo je mestna večina (Županova lista in Svoboda) povzročila prometu, zraku, parkirnim prostorom in vodonosniku Kleče. Hkrati smo edina resna alternativa, ki lahko poenoti opozicijo in s podporo dovolj volilcev pride do večine za prevzem mestne oblasti."
  },
  "8": {
    "obvescanje-1": "Transparentnost odločanja je predpogoj za zagotovitev demokratičnega in participatornega upravljanja mesta. Snemanje sej je logična zahteva, ki onemogoča manipulacije. Sklep o snemanju sej je potrebno sprejeti na prvi sejai Sveta ČS.\nČe trenutna tehnološka oprmeljenost ČS ne omogoča snemanja je to potrebno zagotoviti do naslednje seje.",
    "obvescanje-2": "Snemanje sej v povezavi z umetno inteligenco omogoča hitro pripravo zapisnikov in povzetkov. Objava povzetka seje na spleti strani ČS je sevda nujna in omogoča sprotno odzivanje prebivalk in prebivalcev.",
    "obvescanje-3": "Obveščanje o pomembnih dogodkih, pomembnih odprtih vprašanjih, ki zahtevajo participacijo prebivalk in prebivalcev ter odločitev je smiselno tudi v tiskani obliki npr 1x mesečno (po potrebi tudi večkrat) objavljati na oglasnih deskah,",
    "obvescanje-4": "Dnevni red in gradivo morata biti objavljena pravočasno - najmanj 7dni pred sejo. Seja mora biti odprta za zainteresirane občanke in očane, ki morajo imeti možnost podajanja vprašanj in pripomb.",
    "obvescanje-5": "MOL mora na vsako pobudo podati odgovor. Nujno je potrebno spremembe opn pripraviti pregledno in ločeno po četrtnih skupnosti. Prav takoje potrebno zbrati pobude in odgovore nanje. Ker MOL prejme veliko število pobud je nujno zagotoviti preglednost saj je večina pobud zanimiva za širši krog meščanki in meščanov. \nČe so pobude in odgovori, kot do sedaj predstavljeni po vrstnem redu prispelosti, je preglednost slaba, obveščenost javnosti pa povsem neustrezna.",
    "obvescanje-6": "Odvisno od obsega dela. Glede na precej številčno zasedbo Sveta ČS je verjetno mogoče za komunikacijo zadožiti enega ali več članov Sveta.",
    "parkiranje-1": "Jasna analiza stanja je predpogoj za uspešno reševanje problematike.",
    "parkiranje-2": "Na osnovi analize stanja in javne razprave bodo pripravljeni alternativni predlogi reševanja problematike, ki bodo vključevali argumente za in proti. Odločitev bo sprejeta na skupščini stanovalk in stanovalcev.",
    "storitve-1": "V skladu z doktrino 15minutnega mesta je potrebno zagotoviti osnovne servise za vse prebivalke in prebivalce MOL. Pošta in banka sta osnovni servis, ki mora biti dostopen peš v nekaj minutah. \nOdgovori Pošte in Bnk bodojavno objavljeni.",
    "storitve-2": "Glej prejšnje vprašanje.",
    "promet-1": "Ureditev prometa v naseljih je del celostne prometne strategije MOL. Na osnovi pripomb prebivalk in prebivalcev je v dogovoru s širšo interdisciplinarno skupino strokovnjakov potrebno poiskati ustrezne rešitve in sanirati nevarna mesta.",
    "varnost-1": "Komunikacija prebivalk inprebivalcev s pristojnimi institucijami je nujna za složno sobivanje. Vključevanje ustreznih strokovnjakov omogoča prprečevanje konfliktov in izbiro ustreznih rešitev za odpravoproblemov.",
    "klopi-1": "Participacija prebivalki in prrebivalcev pri urejanju javnih prostorv je nujna. Skladno s predlogi bodo pripravljene rešitve ureditev, ki bodo pred izvedbo javno predstavljene in po potrebi dopolnjene.",
    "cistoca-1": "Čistilne akcije so del povezovanja skupnosti in način ozaveščanja prebivalk in prebivalcev o potreni skrbi za skupno bivalno okolje. Sem sodi seveda tudi ozaveščanje lastnikov psov.",
    "cistoca-2": "Namestitev košev za pasje iztrebke je enostaven poseg, ki omogoča ustrezno higieno javnih odprtih prostorov. Je pa pomembno, da lastniki psov dosledno pobirajo iztrebke svojih kužkov.",
    "zelenje-1": "MOL ima kataster vseh dreves na javnih površinah. Smiselo je vzpostaviti komunikacijski kanal preko katerega bodo lahko meščanke in meščani obveščali O ev. spremebah na drevesih in potrebe po posegih na njih. Vsekakor mora biti javsnost pravočasno obvešečna o vseh posegih na drevju in razlogih zanje. Predlogi novih ureditev morajo biti predmet javne razprave in obravnave predlogov. Spodbijamo večanje števila dreves in zamanjševanje tlakovanih površin, kar zmanjšuje pregrevanjein omogoča ponikovanje deževnice.",
    "zelenje-2": "Prebivalke in prebivalci bodo predlagali lokacije izberemo skupaj z prostorskimi načrtovalci in arboristi.",
    "dom-1": "Ne samo v Savskem naselju ampak v celotni ČS. tudi na tem področju je potrebno narediti analizo vseh nepremičnin v lasti MOL, kakšne in kako velike so in v kakšnem stanju so. Vzpostavitev mreže skupnostnih prostorov, ki so na voljo za brezplačno uporabo vsem meščankam in meščanom je nujna za grajenje skupnosti.",
    "dom-2": "Stavbo je potrebno prenoviti. Urniki vseh skupnostnih prostorov moraj biti javno dostopni na spletni strani ČS, kjer je mogoče turi rezervirati proste termine ob kratkem opisu dogodka.",
    "zrak-1": "Meritve zagotavljajo podatke, potrebne za razmislek o potrebnih ukrepih. Vsakršno preseganje mejnih vrednosti mora sprožiti procese za ustrezne ukrepe.",
    "zrak-2": "Preseganje mejnih vrednosti je potrebno preprečiti z ustreznimi ukrepi. Na pobudo prebivalk in prebivalcev je na izpostavljenih lokacijah potrebno izvesti meritve. Na osnovi meritev ter prostorskih razmer je ob sodelovanju strokovnih institucij potrebnodefinirati zaščitne ukrepe. Nobeno preseganje mejnih vrednosti onesnaženja ni dopusto in ga ne smemo tolerirati. Nujno je zadeve sanirati, saj je to pogoj za zagotovitev normalnih bivalnih razmer za vse prebivalke in prebivalce mesta.",
    "mladi-2": "Prostore je seveda potrebno pregledati, a zeloverjetno med svetniki ČS ne bo ustreznih strokovnjakov. Svet poda pobudo,za izvedbo analize stanja, izvedbo nujnih sanacij in identifikacijo dodatnih ureditev. Zagotovitev prostorov za mlade je del ureditve skupnostnih prostorov v vseh ČS. Mreža skupnostnih prostorov je del javne infrastrukture in osnovnih servisov in mora biti urejena skladno z doktrino 15 minutnega mesta.",
    "maladela-1": "Zbarali bomo pobude prebivalki in prebivalcev ČS, si skupaj z njimi in strokovnimi službami MOL ogledali razmere in predvideli izvedbo potrebnih del. V primeru zahtevnejših prostorskih ureditev bo potrebno angažirati ustrezne strokovnjake. Pred izvedbo mora predlog potrditi lokalna skupnost.",
    "maladela-2": "Pravočasno obveščanje o možnosti sodelovanja v demokratičnih postopkih je predpogoj participativnega in transparentnega upravljanja mesta. Načini zagotavljanja obveščenosti (oglasne deske, spletna stran, družbena omrežja...) morajo biti zapisani v statutu MOL.",
    "maladela-3": "Potrebna je analiza pravnega stanja zemljišč. Podana bo pobuda, da se na državnem nivoju ustrezno prilagodi nekatere člene ZVEtL. Skrajno problematična je namreč privatizacija skupnih delov sosesk, saj lahko vodi v razgradnjo javnega prostora. Nuno je na nivoju MOL sprejeti dogovor o vzdrževanju vseh površin,ki predstavljajo grajeno javno dobro, četudi so skladno z zakonom dodeljene posameznim stavbam in njihovim lastnikom.",
    "zakaj-1": "Ker izhajamo iz civilne družbe in se z delovanjem v različnih civilnih iniciativah že več let borimo proti spornim projektom trenutnega župana. Skozi lastno delovanje smo spoznali ovire, ki jih je potrebno odstraniti, da bi omogočili demokratično upravljanje mesta.",
    "zakaj-2": "Kot izvoljeni predstavniki, se bomo na nivoju MS in tudi na nivoju ČS zavzemali za izboljšanje razmer  v celem mestu. Četrtne skupnosti lahko imajopartikularne probleme, a način reševanja le teh mora biti sistemski. Samo skozi demokratične procese identifikacije, analize in participativnega iskanja odgovorov na vseh nivojih, je mogoče zagotoviti skladen razvoj, ki bo sprejemljiv za čim širši krog prebivalk in prebivalcev mesta.",
    "zakaj-3": "Spodbujali bomo oblikovanje skupnostnih iniciativ in pomagali s svojim znanjem pri spodbujanju demokratičnega delovanja ČS in preprečevanju samovolje posmeznikov."
  },
  "11": {
    "obvescanje-1": "To bomo izpostavili na prvi redni seji. Pred tem bomo stopili v kontakt z ostalimi izvoljenimi četrtnimi svetniki, da lahko v naprej zagotovimo zadostno podporo.",
    "obvescanje-2": "Jasni zapisniki z vsemi znanimi informacijami so predpogoj za učinkovito delovanje četrtne skupnosti. To bomo zagotovili od prve seje dalje.",
    "obvescanje-3": "Takoj ob izvolitvi v svet četrtne skupnosti bomo javnosti v četrti preko naših kanalov razglasili, da bo svet četrtne skupnosti po novem bolj odprt in transparenten. To vključuje uporabo prostorov četrtne skupnosti kot omogočanje prebivalcem, da vse svoj predloge predstavijo na sejah.",
    "obvescanje-4": "To bomo zagotovili že s prvo skupščino.",
    "obvescanje-5": "Že na prvi seji bomo odprli tematiko OPPN-jev. Raziskali bomo vse možne opcije, da se te javnosti predstavijo takoj ko je možno in sproti obvešča o njihovem statusu. Ko bo prišlo do relevantnih sprememb, bomo na seji četrtne skupnosti uvrstili točko diskusije posameznega OPPN-ja na dnevni red in tako vsem prebivalcem dali opcijo, da podajo svoja mnenja.",
    "obvescanje-6": "Ne glede na število mest, ki jih bomo dosegli v svetu četrtne skupnosti, bodo vsi aktivni člani CILJ-a v Bežigradu še naprej skrbeli za stik s civilno družbo in lokalnimi prebivalci, kar je že od začetka temelj našega delovanja kot civilne iniciative.",
    "parkiranje-1": "Parkiranje je eden od najbolj pogosto navedenih problemov, s katerim se soočajo prebivalci Bežigrada. Osnova za rešitev na tem področju so informacije o statusu vseh potencialnih parkirnih mest. CILJ je že dosegel zmago z referendumom o parkiriščih in naprej bomo zagotavljali boljšo parkirno politiko za prebivalce celotne Ljubljane.",
    "parkiranje-2": "Prebivalci Savskega naselja so ekstremno angažirani in najbolje vedo kako bi morala izgledati dobra parkirna politika v njihovi soseski. Zagotovili bomo, da bodo oni v ospredju katerekoli nove ureditve, ki pa je nujna čim prej.",
    "storitve-1": "Volja prebivalcev soseske je jasna. V svetu četrtne skupnosti bomo poskusili zagotoviti odgovore v imenu ČS Bežigrad. V kolikor ostali svetniki ne odobrijo našega predloga, bomo odgovore od pošte in banke terjali kot CILJ. Tematiko bomo naslovili že na prvi seji.",
    "storitve-2": "Pomanjkanje storitev v Savske naselju je nujno nasloviti. Vse predloge iz ankete bomo izpostavili na sejah ČS Bežigrad.",
    "promet-1": "Tovrstna ureditev bi bila smiselna in v skladu z željami Savčanev, zato jo bomo podprli in probali nasloviti na MOL v imenu ČS Bežigrad.",
    "promet-2": "Skupaj s prebivalci soseske bomo šli na pohod ob šoli in vrtcu in identificirali kritične cone, kjer menijo, da je najbolj potrebno umiriti promet.",
    "promet-3": "Enako kot za šole in vrtce gremo lahko s prebivalci na pohod po soseski in identificiramo kritične točke ter potencialne rešitve.",
    "varnost-1": "To bi bilo zagotovo smiselno. Z enoto policije v Bežigradu bomo stopili v stik kmalu po izvolitvi in se pogovorili o varnosti v soseski.",
    "varnost-2": "Igle v Bežigradu videvamo vedno bolj pogosto. Nujno je sprejeti ukrep, ki bo zagotavljal varnost z odstranjevanjem igel, nemudoma ko se pojavijo.",
    "klopi-1": "Sestavili bomo nabor predlogov in pogledali katera mesta so dobila največ pozivov za nove klopi.",
    "cistoca-1": "Uvedli bomo sistem samoorganiziranih čistilnih akcij, kjer lahko v posameznih soseskah ČS Bežigrad prebivalci sami skličejo čistilno akcijo, ko precenijo, da je potrebna. Pri tem bomo na račun MOL zagotovila opremo in orodja, ki jo lahko za to uporabijo.",
    "zelenje-1": "Več zelenja in sence je eden od temeljev našega programa. Zato bomo skupaj s prebicalvi identificirali najbolj kritične točke in na ravni MOL zagovarjali bolj zeleno politiko.",
    "dom-1": "Potreba po tovrstnih prostorih je visoka, vendar prebivalci sploh niso seznanjeni o vseh možnostih, ki so jim na to na voljo. Pomapirali bomo vse skupnostne prostore in prebivalce obvestili o možnosti njihove rabe in primernosti za razne aktivnosti.",
    "mladi-1": "Mladi v soseski vedno bolj poudarjajo, da nimajo svojih prostorov. Nujno jih je čim prej zagotoviti na vse možne načine.",
    "mladi-2": "Prostore lahko zagotovimo tudi s prenovo in začasno rabo zapuščenih prostorov.",
    "maladela-1": "V prvem letu mandata bomo na podlagi te ankete naredili jasen načrt vseh potencialnih malih del, in potem na skupščini s stanovalci soseske sprejeli končne odločitve o tem kako se razporedi mala dela.",
    "maladela-2": "Uporabili bomo vse kanale in vse platforme, ki so nam na voljo. Med drugim bomo zagovarjali ponovno izdajo glasila Bežigrada.",
    "maladela-3": "To je eden od najpomembnejših ciljev za nas v Bežigradu in bomo od prvega dne delali na tem.",
    "zakaj-1": "Ker smo edina lista, ki daje v ospredje četrtne skupnosti, ki so za etablirane politične stranke zgolj formalnost, za MOL pa trenutno samo način širjenja svoje propagande. Mi smo edina lista, ki bo svet četrtne skupnosti uporabila kot glas vseh prebivalcev Bežigrada in jim dala možnost odločati o življenju v njihovih soseskah.",
    "zakaj-2": "Da bomo uslišali vse njihove zahteve in pobude in jim trajno odprli svet četrtne skupnosti, kot organ, kjer bodo enakopravni svetnikom in mestnim oblastem.",
    "zakaj-3": "CILJ ne deluje samo zato, da enkrat na 4 leta kandidira na volitvah. CILJ bo ne glede na rezultat volitev še naprej deloval kot platforma in mreža za vse Ljubljančane, da si izborimo boljšo kvaliteto življenja."
  },
  "13": {
    "obvescanje-1": "Da, demokracija se namreč ne konča na volilni dan. Zavzemamo se za odprto in pregledno upravljanje mesta, v katerem imajo občani pravico vedeti, kako se sprejemajo odločitve, in možnost nanje tudi vplivati. Zato bomo podprli snemanje sej sveta ČS ter javno dostopnost posnetkov in prepisov razprav ob spoštovanju varstva osebnih podatkov. Poiskali bomo tudi ustrezne tehnične in finančne rešitve. Naš županski kandidat dr. Anton Rop zagovarja večjo vlogo četrtnih skupnosti, participativni proračun in uvedbo mestnih državljanskih skupščin po načelih deliberativne demokracije. Prebivalci ne smejo biti zgolj opazovalci odločitev mestne oblasti, temveč morajo pri njih dejansko sodelovati.\n\nO tem dr. Rop govori tudi javno: https://siol.net/novice/slovenija/anton-rop-napoveduje-velik-rez-v-ljubljani-pregledali-bomo-pogodbe-v-vrednosti-skoraj-pol-milijarde-evrov-zupanskikandidati-705706, https://outsider.si/anton-rop-mesto-ni-projekt-mesto-pa-je-ziv-organizem-ki-ga-moramo-soustvarjati/",
    "obvescanje-2": "Da. Občani imajo pravico vedeti, kaj se v njihovem imenu odloča, kdo je kaj predlagal in zakaj je bila določena odločitev sprejeta. Zapisniki zato ne smejo biti zgolj formalnost, iz katere je razvidno le, kateri sklepi so bili potrjeni. Jasno morajo povzeti tudi različna stališča, argumente in izide glasovanj. Podpiramo objavo kratkega povzetka najpozneje v treh dneh po vsaki seji. Če želimo, da ljudje sodelujejo pri upravljanju mesta, jim moramo najprej omogočiti, da vedo, kaj se v mestu in njihovi četrtni skupnosti dogaja. Preglednost ni dobra volja oblasti, ampak njena dolžnost.",
    "obvescanje-3": "Da. Mesto ne more pričakovati, da bodo občani sodelovali pri odločanju, če jih o pomembnih zadevah niti pravočasno ne obvesti. Danes morajo ljudje pogosto sami iskati informacije o tem, kaj se načrtuje v njihovi neposredni okolici. To je treba spremeniti. Podpiramo lastne komunikacijske kanale četrtnih skupnosti, možnost naročanja na novice MOL po posameznih četrtih ter obveščanje prek oglasnih desk in tiskanih obvestil v sodelovanju z upravniki in predstavniki stanovalcev, ob spoštovanju potrebnih soglasij. Ne smemo pozabiti na starejše in vse, ki ne uporabljajo družbenih omrežij. Občani ne smejo za odločitve, ki vplivajo na njihovo življenje, izvedeti šele takrat, ko se začnejo izvajati.",
    "obvescanje-4": "Da. Občani ne smejo biti postavljeni pred izvršena dejstva. Če želimo, da sodelujejo pri odločanju, jim moramo dati možnost, da se z gradivi pravočasno seznanijo, oblikujejo svoja stališča in postavijo vprašanja. Zato bomo zagotovili objavo dnevnega reda in gradiv najmanj sedem dni pred sejo ter čas za vprašanja in pobude občanov. Četrtna skupnost ne sme biti zgolj organ, ki potrjuje že sprejete odločitve mestne oblasti. Biti mora prostor razprave, tudi različnih mnenj. Mesto ni projekt, o katerem odloča peščica ljudi. Mesto soustvarjamo vsi, ki v njem živimo. Zato tudi pravimo: Ljubljana smo vsi.",
    "obvescanje-5": "Da. Vsaka pobuda občanov si zasluži odgovor, ne pa da obleži v predalu mestne uprave. Zato bomo določili jasne roke za odgovore in zagotovili javno evidenco pobud, iz katere bo razvidno, kako se obravnavajo in zakaj so bile posamezne odločitve sprejete.\n\nPri prostorskem načrtovanju pa želimo narediti še korak dlje. Prebivalci morajo biti vključeni že takrat, ko se o prihodnosti njihove soseske šele razmišlja, ne pa šele ob javni razgrnitvi že pripravljenih načrtov. Zato predlagamo tudi uvedbo mestnih državljanskih skupščin po načelih deliberativne demokracije, v katerih bodo prebivalci skupaj s strokovnjaki razpravljali o ključnih razvojnih vprašanjih. Tako lahko namesto odločanja za zaprtimi vrati vzpostavimo prostor za argumentirano razpravo in iskanje rešitev, ki bodo imele širšo podporo prebivalcev.",
    "obvescanje-6": "Da. Četrtne skupnosti morajo dobiti več pristojnosti, pa tudi ljudi in sredstva, da jih bodo lahko izvajale. Danes od njih pričakujemo, da bodo reševale težave prebivalcev, pri tem pa pogosto nimajo ustrezne podpore mestne uprave. Zato bomo predlagali dodatno kadrovsko okrepitev ČS Bežigrad, namenjeno sodelovanju s prebivalci, civilnimi iniciativami in lokalnimi organizacijami. Ne potrebujemo še enega birokratskega položaja, temveč človeka, ki bo poznal težave na terenu, povezoval ljudi in skrbel, da se bodo njihove pobude tudi uresničevale.",
    "parkiranje-1": "Da. Težav s parkiranjem v Savskem naselju ne bomo rešili, dokler ne razčistimo osnovnih vprašanj glede lastništva zemljišč. Zato bom v prvih šestih mesecih zagotovil javno dostopen pregled parkirišč, iz katerega bo jasno razvidno, katera so v lasti MOL, katera pripadajo etažnim lastnikom in za katera potekajo postopki po ZVEtL. Mestna uprava bo v sodelovanju s prebivalci pristopila tudi k razreševanju odprtih lastniških vprašanj. Šele na tej podlagi bomo lahko pripravili dolgoročne rešitve za parkiranje, ki ne bodo šle na račun zelenih površin in kakovosti življenja v naselju.",
    "parkiranje-2": "Da. V prvem letu bomo za Savsko naselje pripravili konkreten načrt ureditve parkiranja, ki bo stanovalcem zagotovil prednost, pločnike in zelenice pa vrnil pešcem. Toda zgolj spreminjanje parkirnega režima ne bo rešilo pomanjkanja parkirnih mest. Zato bomo preverili možnosti obnove obstoječih garaž in gradnje novih garažnih hiš v soseski.\n\nZa Ljubljano smo pripravili program 5.000 novih garažnih mest, tudi z možnostjo javno-zasebnega partnerstva in zadružne gradnje. Naš cilj je, da bi bilo parkirno mesto dostopno po stroškovni ceni okoli 8.000 evrov oziroma za približno 30 evrov mesečne najemnine. O konkretnih lokacijah in načinu izvedbe se bomo dogovorili s prebivalci. Ne bomo jim zgolj zaračunavali parkiranja, ne da bi jim prej zagotovili ustrezne možnosti.",
    "storitve-1": "Da. Pošta in bančne storitve niso razkošje, temveč del osnovne infrastrukture vsakega stanovanjskega naselja. Njihovo ukinjanje najbolj prizadene starejše in ljudi, ki težje dostopajo do storitev drugje. Zato bomo v prvih treh mesecih na podlagi podatkov o potrebah prebivalcev Pošti Slovenije in bankam posredovali konkretno pobudo za ponovno vzpostavitev storitev v Savskem naselju ter njihove odgovore javno objavili.  V pogovore bomo vključil tudi mestno upravo in preveril, kako lahko občina pomaga pri zagotavljanju primernih prostorov. Ne pristajamo na to, da se kakovost življenja v stanovanjskih soseskah zmanjšuje zgolj zaradi poslovnih odločitev posameznih ponudnikov.",
    "storitve-2": "Da. Savsko naselje mora biti soseska, v kateri lahko ljudje večino vsakodnevnih opravkov uredijo v bližini svojega doma. To je še posebej pomembno za starejše prebivalce in družine. Skrbeli bomo, da bo MOL aktivno sodelovala pri vračanju osnovnih storitev v naselje. Pregledali bomo razpoložljive občinske prostore, preverili možnosti ugodnega najema za dejavnosti v javnem interesu ter skupaj s ponudniki in lokalno skupnostjo pripravili pogoje za ponovno vzpostavitev pošte, bančnih storitev in drugih potrebnih dejavnosti, kot so lekarna, trgovina in pekarna. Pri tem bomo uporabili tudi možnosti javnih razpisov in partnerstev. Razvoj Ljubljane ne sme biti osredotočen samo na mestno središče. Kakovost mesta se meri tudi po tem, kako dobro je poskrbljeno za življenje v njegovih soseskah.",
    "promet-1": "Da. Prometnih težav Savskega naselja ne moremo reševati ločeno od razvoja širšega območja Bežigrada. V prvem letu bomo zagotovili celovito strokovno prometno presojo, ki bo upoštevala načrtovano širitev Šmartinske ceste, prometno povezavo na Vilharjevi pri Orto Baru ter vpliv morebitne nove stanovanjske pozidave. Preverili bomo različne prometne scenarije, njihove posledice za pretočnost, varnost, hrup in kakovost zraka. Nobena rešitev ne sme pomeniti, da bomo prometne zastoje z ene ceste preprosto preselili med stanovanjske bloke. Pred sprejetjem odločitev bomo prebivalcem predstavili variante in njihove strokovne utemeljitve ter upoštevali njihovo mnenje. Naš cilj ni zgolj večja pretočnost avtomobilov, temveč manj tranzitnega prometa skozi naselje, učinkovitejši javni prevoz in zdravo bivalno okolje.",
    "promet-2": "Da. Varnost otrok na poti v šolo in vrtec mora imeti absolutno prednost.  Do začetka šolskega leta 2027/28 bomo pregledali in uredili najbolj nevarne prometne točke v okolici šole in vrtca v Savskem naselju. Kjer bo potrebno, bomo uredili varnejše prehode za pešce, izboljšali preglednost križišč, uvedli ukrepe za umirjanje prometa in preprečili nevarno parkiranje. Pri določanju prednostnih ukrepov bomo sodelovali s šolo, vrtcem in starši. Ne potrebujemo še ene prometne študije, ki bo obležala v predalu, temveč konkretne izboljšave, ki jih bodo otroci in starši občutili že na začetku naslednjega šolskega leta.",
    "promet-3": "Da. Prometna ureditev mora izhajati iz dejanskih potreb prebivalcev, ne zgolj iz načrtov prometnih projektantov. Uvedli bi prakso, da se pred večjimi spremembami prometnih režimov opravi terenski ogled s prebivalci, predstavniki četrtne skupnosti in prometnimi strokovnjaki. Na kraju samem bomo preverili, kje prihaja do nepotrebnih zastojev, nevarnih situacij ali nelogičnih prometnih rešitev. Posebej bomo pozorni na predloge ljudi, ki te ceste uporabljajo vsak dan. Tudi manjši, premišljeni posegi lahko bistveno izboljšajo promet, zato bomo poleg dolgoročnih rešitev določili tudi ukrepe, ki jih je mogoče izvesti hitro in brez velikih investicij.",
    "varnost-1": "Da. Odvržene injekcijske igle, uživanje drog na javnih površinah in občutek ogroženosti niso težave, ki bi jih smeli prepustiti prebivalcem, da jih rešujejo sami. Zagotovil bomo redno sodelovanje policije, Mestnega redarstva, četrtne skupnosti in prebivalcev, prvo srečanje najpozneje v šestih mesecih, nato pa najmanj dvakrat letno. Na podlagi prijav in ugotovljenih razmer bomo določili kritične lokacije, okrepili nadzor in zagotovili hitro ter varno odstranjevanje odvrženih igel. Hkrati bomo vključili pristojne socialne in zdravstvene službe, saj samo represija problema odvisnosti ne rešuje. Javne površine morajo biti varne za otroke, starejše in vse prebivalce, pomoč ljudem z odvisnostjo pa mora biti strokovna in dostopna.",
    "varnost-2": "Da. Odvržene injekcijske igle na otroških igriščih, zelenicah in drugih javnih površinah zahtevajo takojšnje ukrepanje. V prvih treh mesecih bomo zagotovili vzpostavitev sistema rednih pregledov izpostavljenih lokacij v Savskem naselju ter jasen protokol za nujno odstranjevanje nevarnih odpadkov. Prebivalcem bomo omogočili enostavno prijavo, brez prelaganja odgovornosti med različnimi občinskimi službami. Za vsako prijavo mora biti jasno, kdo je odgovoren za ukrepanje in v kakšnem času bo nevarnost odpravljena. O izvedenih ukrepih bomo redno in javno poročali. Varnost in čistoča javnega prostora sta osnovni nalogi občine, ne nekaj, za kar bi morali občani vedno znova prositi.",
    "klopi-1": "Da. Klopi niso velik investicijski projekt, lahko pa pomembno prispevajo h kakovosti življenja v soseski, zlasti starejših prebivalcev. Pred pripravo predlogov za mala dela v obdobju 2028–2029 bomo prebivalce javno povabili, da sami označijo lokacije, kjer klopi najbolj potrebujejo. Posebno pozornost bomo namenili senčnim površinam, potem do trgovin, postajališč javnega prevoza in zdravstvenih storitev. Poskrbeli bomo, da bodo predlogi pravočasno vključeni v načrtovanje in da bodo sredstva namenjena tudi takšnim manjšim, a za vsakdanje življenje pomembnim izboljšavam.",
    "klopi-2": "Da. Urejanje prostora med stanovanjskimi bloki je pogosto zapleteno zaradi lastniških razmerij in postopkov odločanja etažnih lastnikov. V prvem letu bomo zato pripravili preprosta navodila in vzorce potrebnih sklepov, s katerimi bomo stanovalcem in upravnikom olajšali postavitev klopi na skupnih zemljiščih. Mestna uprava mora ljudem pomagati pri uresničevanju takšnih pobud, ne pa jih prepuščati birokratskim postopkom. Za postavitev ene klopi res ne bi smeli potrebovati mesecev usklajevanja.",
    "cistoca-1": "Da. Od pomladi 2027 bomo v sodelovanju z VOKA Snago in prebivalci najmanj dvakrat letno organizirali čistilne akcije v Savskem naselju. Pri njih bomo sodelovali tudi sami. Vendar urejenost naselja ne sme biti odvisna od prostovoljnega dela občanov. Mestne službe morajo svoje delo opravljati redno in kakovostno, čistilne akcije pa so priložnost, da skupaj poskrbimo za okolje in okrepimo povezanost soseske. Posebno pozornost bomo v prihodnjem mandatu namenili urejenosti stanovanjskih naselij, ne le mestnega središča. Ljubljana mora biti čista in urejena tudi tam, kjer njeni prebivalci vsak dan živijo, ne samo tam, kjer jo občudujejo turisti.",
    "cistoca-2": "Da. Savsko naselje mora biti prijazno tako do ljudi kot do njihovih štirinožnih spremljevalcev. Zagotovili bomo dovolj košev za pasje iztrebke na lokacijah, kjer jih skrbniki dejansko potrebujejo, njihovo redno praznjenje in brezplačne vrečke za pobiranje pasjih iztrebkov. Preverili bomo tudi možnosti za ureditev primernih površin za sprehajanje in druženje psov. Pri tem pričakujemo odgovorno ravnanje skrbnikov, občina pa mora zagotoviti ustrezne pogoje. Sobivanje v mestu temelji na medsebojnem spoštovanju, ne na nepotrebnih prepovedih.",
    "zelenje-1": "Da. V prvih šestih mesecih bom zagotovil strokovni pregled dreves v Savskem naselju in vključitev ugotovitev v javno dostopen register mestnega drevja. Zaščita zdravih odraslih dreves bo pravilo, njihov posek pa izjema, ki mora biti strokovno utemeljena. Pri pomembnejših posegih bomo zagotovili neodvisno strokovno presojo in prebivalce pravočasno seznanili z razlogi za odstranitev dreves.\n\nPripravili bomo tudi načrt novih zasaditev in izboljšanja rastnih pogojev obstoječih dreves. Za vsako odstranjeno drevo na javni površini bomo zagotovili nadomestno zasaditev, pri čemer bomo upoštevali, da mlado drevo še desetletja ne more nadomestiti odraslega.\n\nPodnebne spremembe od nas zahtevajo bistveno več kot občasno sajenje dreves. Ljubljana se sooča z vse daljšimi vročinskimi valovi, drevesa pa so naša naravna zaščita pred pregrevanjem mesta. Zato bomo pri ozelenjevanju sledili načelu 3–30–300 in posebno pozornost namenili stanovanjskim soseskam, kjer primanjkuje sence. Pri urejanju javnih površin bomo zmanjšali nepotrebno asfaltiranje in betoniranje ter omogočili boljše zadrževanje padavinske vode.\n\nLjubljana mora ostati zeleno mesto ne le po nazivu, temveč predvsem po svojih odločitvah.",
    "zelenje-2": "Da. Prebivalci najbolje vedo, kje v njihovi soseski poleti najbolj pripeka, kje primanjkuje sence in katere javne površine bi bilo treba ozeleniti. Zato bomo pred pripravo načrta malih del za obdobje 2028–2029 organizirali javni poziv, na katerem bodo lahko predlagali konkretne lokacije za zasaditev novih dreves. Predloge bomo skupaj s strokovnjaki pregledali in preverili ustreznost rastnih pogojev ter izbiro drevesnih vrst.\n\nKot sem poudaril že v odgovoru iniciativi Urbani gozd, ozelenjevanje ne sme biti zgolj estetski dodatek, temveč sestavni del prilagajanja Ljubljane podnebnim spremembam. Prednost bomo dali površinam ob stanovanjskih blokih, šolah, vrtcih in pešpoteh, kjer lahko nova drevesa največ prispevajo k zmanjševanju poletne vročine. Pomembno pa ni le, koliko dreves zasadimo, temveč tudi, da jim zagotovimo pogoje za dolgoročno rast.",
    "dom-1": "Da. V prvem letu bomo zagotovili pregled razpoložljivih prostorov v Savskem naselju in pripravil pogoje, da dom skupnosti ponovno postane prostor srečevanja, druženja in skupnih dejavnosti prebivalcev. Pri tem bomo upoštevali potrebe različnih generacij, od otrok in mladih do starejših, ter omogočili uporabo prostorov lokalnim društvom in civilnim iniciativam.\n\nToda pri tem ne gre samo za ureditev prostorov. Gre za drugačno razumevanje mesta in drugačen način njegovega vodenja. Mesto ni projekt. Mesto je skupnost ljudi, njihovih življenj, potreb in odnosov. Njegove uspešnosti zato ne moremo meriti zgolj po številu novih gradenj in velikih investicij, temveč predvsem po kakovosti življenja in povezanosti prebivalcev.\n\nKrepili bomo vlogo četrtnih skupnosti, jim zagotovil več sredstev in omogočil, da bodo prebivalci neposredno odločali o projektih v svojem okolju. Želimo si Ljubljane, v kateri bodo soseske imele svoja središča družbenega življenja, ljudje pa občutek, da mestu pripadajo in lahko vplivajo na njegovo prihodnost.",
    "dom-2": "Da. V prvem letu bomo zagotovili, da MOL javno predstavi načrt obnove stavbe na Belokranjski 6, predvidene roke izvedbe in možnosti njene prihodnje uporabe. Toda o tem, kakšen naj bo dom skupnosti, ne sme odločati zgolj mestna uprava. Najprej bomo prisluhnili prebivalkam in prebivalcem Savskega naselja, jih vključili že v pripravo projekta ter skupaj z njimi oblikovali vsebino in način uporabe prostorov. Zagotovili bomo tudi javno dostopen urnik in pregledna pravila souporabe.\n\nTo je bistvo drugačnega načina vodenja Ljubljane, za katerega se zavzemamo. Mestna oblast ne sme odločati namesto ljudi, temveč mora ustvarjati pogoje, da lahko ti sami sooblikujejo življenje v svoji soseski. Belokranjska 6 naj postane projekt prebivalcev Savskega naselja, ne zgolj še ena pompozna nezaživela investicija mestne občine.",
    "zrak-1": "Da. V prvih šestih mesecih bomo zagotovili izvedbo meritev kakovosti zraka in prometnega hrupa na najbolj obremenjenih območjih Savskega naselja ter javno objavo rezultatov. Že v svojem programu smo predvideli spremljanje kakovosti zraka po posameznih četrtnih skupnostih, saj povprečni podatki za celotno Ljubljano ne povedo dovolj o razmerah, v katerih ljudje dejansko živijo.\n\nPosebno pozornost bomo namenili vplivom prometa, tudi v povezavi z načrtovanimi novimi prometnicami in pozidavo. Meritve ne smejo biti same sebi namen. Na njihovi podlagi bomo določili ukrepe za zmanjševanje onesnaženosti in hrupa ter spremljali njihovo učinkovitost. Čist zrak in mirno bivalno okolje nista privilegij, temveč osnovna pogoja za zdravo življenje.",
    "zrak-2": "Da. Ljubljana potrebuje drugačno prometno politiko, ki ne bo usmerjena zgolj v povečevanje pretočnosti avtomobilov, temveč predvsem v izboljšanje kakovosti življenja. V stanovanjskih soseskah moramo zmanjševati prometne obremenitve, ne pa jih povečevati z novimi cestnimi povezavami in dodatno pozidavo.\n\nZavzemamo se, da se pri prometnih posegih upoštevajo tudi vplivi na zdravje prebivalcev. Prednost bomo dali zmanjševanju hrupa pri njegovem izvoru, izboljšanju javnega potniškega prometa in ozelenjevanju prometno obremenjenih območij. S pristojnimi državnimi institucijami bomo uredili tudi vprašanja, ki presegajo občinske pristojnosti. Ne moremo govoriti o sodobnem in zelenem mestu, če ob tem zanemarjamo življenjske razmere ljudi v stanovanjskih naseljih.",
    "mladi-1": "Da. V prvih šestih mesecih bomo v sodelovanju z vodstvom šole zagotovil dogovor o popoldanski uporabi šolskega igrišča ter preveril možnosti za ureditev pokritega prostora, namenjenega druženju mladih.\n\nV Ljubljani veliko govorimo o velikih investicijah, premalo pa o tem, kaj mladi dejansko potrebujejo v svojem vsakdanjem okolju. Ne potrebujejo vedno novih objektov, temveč predvsem dostopne, varne in urejene prostore, kjer se lahko srečujejo, ukvarjajo s športom in kakovostno preživljajo prosti čas.\n\nPri načrtovanju bomo vključili tudi mlade iz Savskega naselja. Sami naj povedo, kakšen prostor si želijo in kako bi ga uporabljali. Zavzemali se bomo za to, da bodo šolska igrišča in druga javna infrastruktura zunaj časa pouka čim bolj dostopni lokalni skupnosti, ob ustreznem zagotavljanju varnosti in vzdrževanja.",
    "mladi-2": "Da. Zazvezujemo se, da bomo pred načrtovanjem novih ureditev najprej preverili stanje obstoječih igrišč, igral in javnih prostorov v Savskem naselju. Pri tem pa želim predvsem slišati otroke in mlade. Ne smemo namesto njih odločati, kaj potrebujejo, ne da bi jih o tem sploh vprašali.\n\nZato bomo v sodelovanju s šolo, mladinskimi organizacijami in četrtno skupnostjo pripravili srečanja z mladimi ter njihove predloge vključili v načrtovanje. Preverili bomo tudi možnosti, da v Domu skupnosti ali drugih javnih prostorih dobijo svoj prostor za druženje in ustvarjanje.\n\nMesto po meri človeka mora biti tudi mesto po meri otrok in mladih.  Njihove potrebe ne smejo biti na zadnjem mestu, ko se razdelijo sredstva za velike mestne projekte. Pomembno je, da imajo možnost kakovostno preživljati prosti čas v svoji soseski in da se že zgodaj naučijo sodelovati pri odločitvah, ki vplivajo na njihovo življenje.",
    "maladela-1": "Da. V sodelovanju s prebivalci, civilnimi iniciativami in četrtno skupnostjo bomo pripravili konkreten seznam potrebnih izboljšav, določili prednostne lokacije in jih vključili v načrt malih del za obdobje 2028–2029.\n\nToda želim narediti še korak dlje. Ena mojih programskih zavez je uvedba participativnega proračuna, s katerim bodo prebivalci neposredno odločali o delu mestnih sredstev. Prav manjše ureditve javnega prostora so najboljši primer, kako lahko takšen način odločanja deluje v praksi.\n\nČetrtnim skupnostim bomo zagotovili več pristojnosti in sredstev, da ne bodo zgolj posrednice pobud mestni upravi, temveč bodo lahko tudi same uresničevale dogovorjene prednostne naloge. O tem, kaj najbolj potrebuje posamezna soseska, morajo imeti odločilno besedo ljudje, ki v njej živijo.",
    "maladela-2": "Da. Zagotovil bom, da bodo prebivalci in upravniki o pozivu obveščeni najmanj tri tedne pred iztekom roka, in sicer prek različnih komunikacijskih kanalov, tudi oglasnih desk v stanovanjskih stavbah. Posebno pozornost bomo namenili starejšim in tistim, ki ne uporabljajo digitalnih medijev.\n\nToda pravočasno obveščanje je šele prvi korak. Mestna uprava mora prebivalcem tudi pomagati pri pripravi pobud in jim pojasniti, kako se o njih odloča. Zato bomo okrepili neposredno komunikacijo četrtnih skupnosti z občani ter zagotovili pregledne informacije o izboru in izvedbi projektov.\n\nSodelovanje prebivalcev ne sme biti zgolj formalnost, s katero mestna oblast izpolni zakonske obveznosti, temveč mora postati običajen način upravljanja Ljubljane.",
    "maladela-3": "Da. V prvem letu bom zagotovil pregled lastništva zemljišč med stanovanjskimi bloki v Savskem naselju, vključno s tistimi, za katera še potekajo postopki po ZVEtL. Prebivalcem bomo na razumljiv način pojasnili, katera zemljišča so občinska, katera pripadajo etažnim lastnikom in kje lastniška vprašanja še niso razrešena.\n\nMestna uprava bo lastnikom in upravnikom nudila strokovno in pravno pomoč pri pripravi soglasij ter izvedbi manjših ureditev skupnih površin. Kjer bodo postopki še odprti, bomo preverili možnosti za njihovo hitrejše razreševanje v okviru občinskih pristojnosti.\n\nNeurejena lastniška razmerja ne smejo postati izgovor, da se v stanovanjskih soseskah nič ne premakne. Naloga občine je, da prebivalcem pomaga iskati rešitve, ne da jim nalaga dodatne birokratske ovire.",
    "zakaj-1": "Ker verjamemo, da smo Ljubljana vsi: tisti, ki živimo v mestnem središču, in tisti, ki živimo v Savskem naselju, Šiški, Mostah, Fužinah ali drugih ljubljanskih soseskah. Vsi imamo enako pravico do urejenega okolja, kakovostnih javnih storitev in soodločanja o prihodnosti mesta.\n\nZavzemamo se za drugačen način vodenja Ljubljane. Za mestno oblast, ki ljudi ne le posluša, ampak jih tudi sliši in upošteva. Ki spoštuje civilne iniciative, tudi kadar so kritične do njenih odločitev, in jih razume kot partnerje, ne kot nasprotnike.\n\nZato zagovarjamo več pristojnosti in sredstev za četrtne skupnosti, participativni proračun in uvedbo državljanskih skupščin po načelih deliberativne demokracije. Želimo, da se o pomembnih vprašanjih mesta odloča v odprtem dialogu, na podlagi argumentov in ob dejanskem sodelovanju prebivalcev.\n\nMesto ni projekt. Mesto je skupnost. Je preplet ljudi, odnosov in prostorov, v katerih živimo. Njegova prihodnost ne sme biti odvisna od volje enega človeka.\n\nZa našo listo je vredno glasovati, ker ne želimo zgolj drugačnega župana, temveč drugačen odnos mestne oblasti do ljudi. Ker Ljubljana pripada vsem nam.",
    "zakaj-2": "Predvsem lahko pričakujejo drugačen odnos mestne oblasti do ljudi. Verjamemo, da se demokracija ne konča na volilni dan. Takrat se pravzaprav šele začne.\n\nZavzemamo se za odprt dialog, spoštovanje različnih mnenj in dejansko vključevanje prebivalcev v odločanje. Tudi takrat, ko se ne bomo strinjali. Civilne iniciative in kritični občani za nas niso ovira pri razvoju mesta, temveč pomemben glas skupnosti, ki ga mora odgovorna oblast slišati in upoštevati.\n\nOd nas lahko pričakujejo pregledno in odgovorno upravljanje, jasne odgovore na svoje pobude ter odločitve, ki bodo strokovno utemeljene in javno pojasnjene. Predvsem pa lahko pričakujejo rezultate. Ne obljubljamo, da bomo vse težave rešili čez noč, obljubljamo pa, da jih ne bomo ignorirali in da bomo za dogovorjene rešitve prevzeli odgovornost.\n\nNe želimo odločati namesto ljudi, temveč skupaj z njimi. Uspeha ne bomo merili zgolj po številu zaključenih projektov, ampak predvsem po tem, ali ljudje v svojem mestu živijo bolje.\n\nPrebivalci Savskega naselja bodo naši enakovredni sogovorniki pri oblikovanju prihodnosti Ljubljane. Ker... Ljubljana smo vsi.",
    "zakaj-3": "Da. Naša zavezanost Savskemu naselju ni odvisna od volilnega rezultata. Verjamemo, da se odgovornost do skupnosti ne začne in ne konča s politično funkcijo.\n\nTudi če ne bomo izvoljeni, bomo ostali aktivni sogovorniki prebivalcev, podpirali njihove pobude in sodelovali s civilnimi iniciativami. Spremljali bomo uresničevanje obljub mestne oblasti, opozarjali na nerešene težave ter si prizadevali, da bodo predlogi prebivalcev obravnavani in vključeni v mestne načrte in proračun.\n\nPripravljeni bomo sodelovati z vsakim, ki si bo iskreno prizadeval za izboljšanje življenja v Savskem naselju, ne glede na politično pripadnost.\n\nDemokracija ni samo vprašanje, kdo je izvoljen, ampak tudi, kako sodelujemo, kako spoštujemo različna mnenja in kako skupaj prevzemamo odgovornost za prostor, v katerem živimo. Savsko naselje je del naše skupnosti in zanj si bomo prizadevali ne glede na rezultat volitev."
  },
  "15": {
    "obvescanje-2": "Skladno s 4. odstavkom 115. člena Poslovnika Mestnega sveta MOL se zapisniki sej svetov ČS vodijo v obliki skrajšanega zapisnika ali zapisnika sklepov. Morebitno izjemo od tega pa lahko določi svet ČS. Vsak svetnik ali razpravljalec ima pravico predlagati popravek na osnutek zapisnika, ki pa ga svet ČS obravnava šele na naslednji seji. Zato bi bilo objavljanje nepotrjenih zapisnikov (četudi zgolj njihovih izsekov) nepravilno. Ko pa je zapisnik formalno potrjen, je objavljen na uradni spletni strani ČS.",
    "obvescanje-3": "Že do sedaj smo v LZJ to podpirali, je pa tudi ta odločitev v pristojnosti vsakokratnih svetnikov ČS, ki na svoji prvi seji sprejmejo sklep o tem, ali bo ČS imela svoje kanale tudi na socialnih omrežjih, ali pa bo za namene obveščanja uporabljala (le) spletno stran in oglasne deske ČS. \nČS Bežigrad ima že od leta 2012 tudi svoje letno glasilo, ki je naslovljeno na prav vsako gospodinjstvo v ČS,. S to prakso bomo nadaljevali tudi v prihodnje. Odločitev o tem, ali v določenem letu ČS izda glasilo, pa je stvar odločitve celotnega sveta ČS. \n\nSe je pa ob tem treba zavedati, da tako vodenje vsebin na socialnih omrežjih, kot tudi izdajanje glasila od svetnic in svetnikov zahteva precej časa in dela, ki ga opravljajo v svojem prostem času.",
    "obvescanje-4": "Vabilo na redno sejo sveta ČS z dnevnim redom je (na spletni strani ČS) vedno objavljeno vsaj 7 dni pred sejo. \n\nSvet ČS Bežigrad že vsa leta na svojih sejah obravnava vse pobude občanov, ne glede na datum prispetja na ČS, na prvi možni seji, v kolikor je za njih pristojen. Sicer jih odstopi pristojnemu organu. S to prakso bomo nadaljevali tudi v prihodnje.",
    "obvescanje-5": "Poudariti velja, da podajanje odgovorov na pripombe in predloge na OPPN presega pristojnost četrtnih skupnosti. So pa stališča oziroma pripombe sveta ČS na dopolnjen osnutek OPPN javno objavljena v gradivu za sejo Mestnega sveta MOL, na kateri se obravnava PREDLOG OPPN. V njih se mestna uprava tudi opredeli do pripomb sveta ČS.",
    "obvescanje-6": "Občani se že sedaj lahko kadarkoli obračajo na katerokoli izmed svetnic oz. kateregakoli izmed svetnikov ČS, Prav tako tehnično in strokovno pomoč nudijo sodelavci Službe za lokalno samoupravo MOL. Ob tem naj spomnimo, da velikosti posameznih ČS presega velikost številnih občin v Sloveniji.\n\nKar zadeva ožje dele znotraj posamezne ČS, kot so na primer soseske, pa naj omenimo prakso, ki deluje v Štepanjskem naselju. Tam delovno skupino, ki nagovarja izzive posamezne soseske, sestavlja do 5 predstavnikov CI in do 5 svetnikov ČS.",
    "parkiranje-1": "Zemljiška knjiga je javna in do nje lahko že sedaj dostopa vsak občan. Zato je javno dostopna tudi informacija o lastništvu parcel, označeno pa je tudi, ali je parcela s čim obremenjena (npr. teče postopek po ZVEtL). Poleg tega je ZK »živa« in se ves čas spreminja.  Podobno velja za zahtevke po ZVEtL, saj je moč te vložiti kadarkoli. Posledično nekaj, kar velja danes, nujno ne bo veljalo tudi jutri.",
    "parkiranje-2": "Za to si ČS prizadeva ves čas, a iskanje rešitve zahteva sodelovanje številnih deležnikov.",
    "storitve-1": "Tovrstna prizadevanja smo podpirali že do sedaj in tako bomo ravnali tudi v prihodnje. Vendar je treba ob tem spomniti, da so banke v zasebni, Pošta Slovenije pa v državni lasti in ne MOL ne ČS na to nimata neposrednega vpliva.",
    "storitve-2": "V skladu s pristojnostmi MOL in sveta ČS.",
    "varnost-1": "Svet ČS je (skupaj s Policijo in MR) že pripravil sejo, na kateri se je obravnavala varnostna problematika. Vsako leto svet ČS obravnava tudi prioritetne naloge s področja varnosti in jih posreduje MR in PU Ljubljana. Prav tako smo organizirali sestanek z upravniki, predstavniki stanovalcev (nekateri NO), policije in MR ter MOL glede delovanje društva Stigma v Zupančičevi jami in glede problematike zaradi uporabnikov drog.",
    "varnost-2": "Tovrstna prizadevanja smo podpirali že do sedaj in tako bomo ravnali tudi v prihodnje. Javno podjetje VOKA SNAGA to počne že sedaj. Občani lahko to javijo na telefonsko številko 031 659 424, ali ali pošljejo e-sporočilo na vokasnaga@vokasnaga.si.",
    "klopi-1": "Svet ČS Bežigrad je že sedaj vabil občane, naj podajo svoje predloge za izboljšanje bivanja v ČS, poziv za lokacije klopi je zato dobrodošel. Je pa te moč postaviti zgolj na zemljiščih v lasti MOL.",
    "cistoca-1": "Svet ČS je v okviru akcije za lepšo Ljubljana je v Savskem naselju (in drugod) zmeraj podprla čistilne akcije, če je prišla za njih pobuda ali s strani svetnika ali strani občana (poskrbeli smo objavo na spletni strani in FB, zagotovili rokavice, vrečka, pobiralke smeti/tudi drugo orodje, če je bila želja, poskrbeli za odvoz zbranih odpadkov in za malico.",
    "cistoca-2": "Že do sedaj smo aktivno sodelovali v akcijah Človek čuvaj svoje mesto in tako bo tudi v prihodnje. Ob tem računamo na lastnike psov, da za njimi res pospravijo. Spominjamo, da je pasje iztrebke moč odlagati v vse koše za mešane odpadke!",
    "zelenje-1": "Tovrstne pobude smo podpirali že do sedaj in jih bomo tudi v prihodnje. MOL sicer to že počne, je pa tudi tu odvisno od lastništva zemljišča, na katerem drevo stoji.",
    "zelenje-2": "To smo počeli že v tem mandatu, s tem bomo nadaljevali tudi v prihodnje. Ob tem naj spomnimo, da posaditev drevesa zahteva ustrezno strokovno oceno vseh dejavnikov in tveganj, zato zgolj predlog občanov za postavitev drevesa na točno določeni lokaciji ni vedno dovolj.",
    "dom-1": "Svet ČS, v sodelovanju z Oddelkom za ravnanje z nepremičninami MOL in Službo za lokalno samoupravo MOL, že sedaj vodi preglednico prostorov. Skupaj si prizadevamo za njihovo polno zasedenost in ob tem veliko pozornost namenjamo vsebinam, s katerimi se zapolnjujejo ti prostori. Brezplačna uporaba prostorov je odvisna od vsebine aktivnosti.",
    "dom-2": "V skladu s pristojnostmi sveta ČS.",
    "mladi-1": "MOL podpira odprta igrišča, izjema so igrišča, kjer je potrebno zagotavljati posebno stopnjo varnosti (denimo vrtci). Kjer si OŠ deli igrišče z vrtcem, je le to zaprto. Prostor pod streho podpiramo, v kolikor se najde ustrezna lokacija in bo za to sprejet širši konsenz med bližnjimi stanovalci.",
    "maladela-1": "Kot že do sedaj, bodo tudi v prihodnje predlogi za malam dela temeljili na pobudah občanov.",
    "maladela-2": "Obveščanje po kanalih sveta ČS.",
    "maladela-3": "Informacije zemljiške knjige so javne in dostopne vsem zainteresiranim. Svet ČS nima pristojnosti urejanja zadev na parcelah, ki so v zasebni lasti.",
    "zakaj-1": "ZAKO, KER sta župan Zoran Janković in Lista Zorana Jankovića poskrbela za razvoj mesta in dvig kakovosti bivanja v njem. Župan in njegova lista sta porok za to, da se bo mesto razvijalo še naprej. Poleg tega smo, v okviru pristojnosti svetov ČS, podprli vse predloge in pobude občanov, od pristojnih služb MOL in drugih pravnih subjektov pa skušali pridobiti jasne, konkretne odgovore ter bomo tako ravnali tudi v prihodnje.",
    "zakaj-2": "Zavedamo se, da delo še ni končano, saj je mesto živa tvorba, ki se ves čas spreminja. Spreminjajo pa se tudi potrebe prebivalk in prebivalcev, mi pa se zavezujemo, da bomo tem trendom sledili in še naprej uresničevali naš program."
  }
};
