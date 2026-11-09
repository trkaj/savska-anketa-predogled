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
  }
};
