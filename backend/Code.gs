/**
 * Savska anketa – sprejem odgovorov (Google Apps Script spletna aplikacija)
 *
 * Skripta je vezana na preglednico »Savska anketa – odgovori«.
 * Shranjuje v tri ločene zavihke:
 *   Odgovori     – anonimni odgovori ankete (ena vrstica = en izpolnjen vprašalnik)
 *   Sodelovanje  – »Bi sodelovali?«, »Koliko časa« ter obveščenost (seje_cs, oppn_obvescenost) (ločeno, brez povezave z odgovori)
 *   Prostovoljci – modri listek: kontakt (e-pošta ali telefon), način obveščanja, pri čem, soglasje,
 *                  neobvezno ime ali vzdevek (samo v tem zavihku),
 *                  neobvezen poštni naslov za dostavo (samo s posebnim soglasjem_naslov; brez poštne številke)
 *
 * Zasebnost: skripta NE shranjuje IP naslovov (Apps Script jih niti ne posreduje),
 * brskalnika ali drugih metapodatkov. Ime/vzdevek z modrega listka gre samo v zavihek Prostovoljci.
 * Zavihka Sodelovanje in Prostovoljci hranita samo datum (brez ure), vrstice pa se
 * vstavljajo na naključno mesto, da jih ni mogoče povezati z vrsticami v »Odgovori«.
 */

var TEME = ['promet','parkiranje','dvigala','klopi','zelenje','varnost','cistoca','hrup','dom','mladi','druzenje','koledar','zrak','zdravstvo','drugo'];

var STOLPCI = {
  Odgovori: ['cas_oddaje','kanal','dobro','dobro_drugo','izboljsati','izbor','drugo_tema']
    .concat(TEME.map(function (t) { return 'pogostost_' + t; }))
    .concat(['polja',
      'kraj1_polje','kraj1_tema','kraj1_opis',
      'kraj2_polje','kraj2_tema','kraj2_opis',
      'kraj3_polje','kraj3_tema','kraj3_opis',
      'kraj4_polje','kraj4_tema','kraj4_opis',
      'kraj5_polje','kraj5_tema','kraj5_opis',
      'starost','ulica','bivanje','dvigalo','enosmerna','cistilni_cetrtek','vozila_st','parkiranje_tezave','garaza_zelja','garaza_cena','garaza_najem','prevoz_dnevni',
      'storitve_manjka','storitve_drugo','ohladitev',
      'upravnik_poznam','upr_odzivnost','upr_vzdrzevanje','upr_stroski','upr_obvescanje','hisnik_poznam','zbori_udelezba','zbori_ovire','predstavnik_vhoda',
      'zdr_ocena','zdr_manjka','zdr_dvigalo',
      'm65_stopnice','m65_dvigalo','m65_klop','m65_klop_kje','m65_trgovina','m65_zdravnik','m65_pogovor','m65_pomoc',
      'm25_parkiranje','m25_ureditev','m25_otroci','m25_pot','m25_pot_kje','m25_dom','m25_skupina',
      'm15_kje','m15_manjka','m15_drugo','m15_varnost']),
  Sodelovanje: ['datum','kanal','sod_zelja','sod_cas','seje_cs','oppn_obvescenost'],
  Prostovoljci: ['datum','kanal','kontakt','kako','pricem','soglasje','ime','naslov_ulica','naslov_stanovanje','dostava_na_dom','soglasje_naslov']
};
var TIP_V_ZAVIHEK = { odgovori: 'Odgovori', sodelovanje: 'Sodelovanje', listek: 'Prostovoljci' };

var KANALI = ['splet','papir','telefon','osebno'];
var STAROSTI = ['mlajši od 15 let','15–24','25–34','35–49','50–64','65–74','75 ali več'];
var POGOSTOST = ['Skoraj vsak dan','Vsak teden','Nekajkrat na mesec','Redko'];
var MAX_DOLZINA = 2000;      // največ znakov na celico
var MIN_CAS_S = 3;           // hitrejša oddaja celotne ankete = verjetno robot

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var p = (e && e.parameter) || {};

    // 1) Past za robote (honeypot): ljudje tega polja ne vidijo, zato mora biti prazno.
    if (p.spletna_stran) return odgovor_(true, 'ok'); // tiho zavrži

    // 2) Osnovna preverjanja
    var zavihek = TIP_V_ZAVIHEK[p.tip];
    if (!zavihek) return odgovor_(false, 'neznan tip');
    var kanal = p.kanal || 'splet';
    if (KANALI.indexOf(kanal) < 0) return odgovor_(false, 'neveljaven kanal');
    if (p.tip === 'odgovori') {
      if (Number(p.cas_izpolnjevanja_s || 0) < MIN_CAS_S && kanal === 'splet') return odgovor_(true, 'ok'); // prehitro, tiho zavrži
      if (p.starost && STAROSTI.indexOf(p.starost) < 0) return odgovor_(false, 'neveljavna starost');
      for (var i = 0; i < TEME.length; i++) {
        var v = p['pogostost_' + TEME[i]];
        if (v && POGOSTOST.indexOf(v) < 0) return odgovor_(false, 'neveljavna pogostost');
      }
      var vsebina = STOLPCI.Odgovori.slice(2).some(function (k) { return p[k]; });
      if (!vsebina) return odgovor_(false, 'prazna anketa');
    }
    if (p.tip === 'listek') {
      if (!p.kontakt) return odgovor_(false, 'manjka kontakt');
      if (p.soglasje !== 'da') return odgovor_(false, 'manjka soglasje');
      // Poštni naslov samo s posebno privolitvijo 6(1)(a); brez nje naslovna polja zavržemo.
      if (p.soglasje_naslov !== 'da' || !p.naslov_ulica) {
        p.naslov_ulica = ''; p.naslov_stanovanje = ''; p.dostava_na_dom = ''; p.soglasje_naslov = '';
      }
    }

    // 3) Sestavi vrstico (samo dovoljeni stolpci za ta zavihek; vse ostalo se zavrže)
    var zdaj = new Date();
    var tz = Session.getScriptTimeZone() || 'Europe/Ljubljana';
    lock.waitLock(10000);
    var sh = zavihek_(zavihek);
    var glava = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var vrstica = glava.map(function (k) {
      if (STOLPCI[zavihek].indexOf(k) < 0) return '';
      if (k === 'cas_oddaje') return Utilities.formatDate(zdaj, tz, 'yyyy-MM-dd HH:mm:ss');
      if (k === 'datum') return Utilities.formatDate(zdaj, tz, 'yyyy-MM-dd');
      if (k === 'kanal') return kanal;
      return ocisti_(p[k]);
    });

    // 4) Zapiši
    if (zavihek === 'Odgovori') {
      sh.appendRow(vrstica);
    } else {
      // naključno mesto, da vrstni red ne razkrije povezave z odgovori
      var zadnja = sh.getLastRow(); // 1 = glava
      var poz = 1 + Math.floor(Math.random() * zadnja); // vstavi za vrstico 1..zadnja
      sh.insertRowAfter(poz);
      sh.getRange(poz + 1, 1, 1, vrstica.length).setValues([vrstica]);
    }
    return odgovor_(true, 'ok');
  } catch (err) {
    return odgovor_(false, 'napaka: ' + err);
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('Savska anketa: sprejem odgovorov deluje.');
}

/** Odstrani presledke, skrajša in onemogoči formule (=, +, -, @) v celicah. */
function ocisti_(v) {
  if (v == null) return '';
  var s = String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (s.length > MAX_DOLZINA) s = s.slice(0, MAX_DOLZINA);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

/** Vrne zavihek; če ga ni, ga ustvari z glavo. */
function zavihek_(ime) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ime);
  if (!sh) {
    sh = ss.insertSheet(ime);
    sh.appendRow(STOLPCI[ime]);
    sh.setFrozenRows(1);
  }
  // manjkajoče stolpce (npr. nov stolpec »ime«) samodejno dodaj na konec glave
  var glava = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
  STOLPCI[ime].forEach(function (k) {
    if (glava.indexOf(k) < 0) {
      sh.getRange(1, glava.length + 1).setValue(k).setFontWeight('bold');
      glava.push(k);
      dopolniSifrant_(ss, ime, k);
    }
  });
  return sh;
}

/** Ob novem stolpcu doda vrstico v zavihek Šifrant (če obstaja in vrstice še ni). */
function dopolniSifrant_(ss, zavihek, stolpec) {
  var opis = SIFRANT_NOVO[zavihek + '.' + stolpec];
  var sif = ss.getSheetByName('Šifrant');
  if (!opis || !sif) return;
  var obstojece = sif.getDataRange().getValues();
  for (var i = 0; i < obstojece.length; i++) if (obstojece[i][0] === zavihek && obstojece[i][1] === stolpec) return;
  sif.appendRow([zavihek, stolpec].concat(opis));
}
var SIFRANT_NOVO = {
  'Odgovori.prevoz_dnevni': ['Najpogostejše prevozno sredstvo za vsakodnevne poti', 'Peš / Kolo / JPP (avtobus) / Avto / Drugo', '', 'vozila'],
  'Odgovori.storitve_manjka': ['Katere storitve v bližini pogrešate', 'Banka; Pošta; Trgovina; Lekarna; Drugo', '', 'storitve'],
  'Odgovori.storitve_drugo': ['Storitve – drugo (prosto)', 'prosto besedilo', '', 'storitve'],
  'Odgovori.cistilni_cetrtek': ['Podpora čistilnim akcijam (Čistilni četrtek)', 'Da, 1-krat na mesec / teden / leto / Drugo: … / Ne podpiram', '', 'za vse'],
  'Odgovori.ohladitev': ['Kam se greste v soseski poleti ohlajat', 'Park / Dom skupnosti / Ob Savi / Nikamor / Drugo: …', '', 'storitve'],
  'Prostovoljci.ime': ['Ime ali vzdevek (neobvezno; OSEBNI PODATEK – samo ta zavihek)', 'prosto besedilo', '', 'modri listek'],
  'Prostovoljci.naslov_ulica': ['Ulica in hišna številka (OSEBNI PODATEK; samo s soglasje_naslov; dostop samo upravljavec)', 'prosto besedilo', '', 'modri listek'],
  'Prostovoljci.naslov_stanovanje': ['Št. stanovanja in nadstropje (neobvezno; OSEBNI PODATEK)', 'prosto besedilo', '', 'modri listek'],
  'Prostovoljci.dostava_na_dom': ['Želi obvestila prinesena na dom', 'da / prazno', '', 'modri listek'],
  'Prostovoljci.soglasje_naslov': ['Posebna privolitev 6(1)(a) za naslov; izbris ob preklicu ali 24 mes. po zadnjem stiku', 'da / prazno', '', 'modri listek']
};

function odgovor_(ok, sporocilo) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, sporocilo: sporocilo }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Ročni preizkus v urejevalniku: izberite »preizkus« in kliknite Zaženi. */
function preizkus() {
  var r = doPost({ parameter: { tip: 'odgovori', kanal: 'splet', cas_izpolnjevanja_s: '60', dobro: 'mir; zelenje in drevesa', starost: '35–49', ulica: 'Savska', izboljsati: 'TEST – izbrišite to vrstico' } });
  Logger.log(r.getContent());
}
