/* Imena in priimki s seznama MVK MOL za svet ČS Bežigrad, VE 01.
   Vir: https://www.ljubljana.si/assets/Mestni-svet/Lokalne-volitve-2026/Kandidature/Cetrtna-skupnost-Bezigrad.pdf
   Namerno brez letnic rojstva, naslovov in drugih osebnih podatkov. */
const MOL_SEZNAM_URL = "https://www.ljubljana.si/assets/Mestni-svet/Lokalne-volitve-2026/Kandidature/Cetrtna-skupnost-Bezigrad.pdf";
const KANDIDATI = {
  1: ["dr. Simona Gerenčer", "Lars Arrigler Demirović", "Vanja Meglič", "Tim Kiseljak", "Martina Furlan", "dr. Črt Poglajen", "Karmen Habič"],
  2: ["Renata Picej"],
  3: ["Matjaž Vede"],
  4: ["Rok Deželak"],
  5: ["Tomo Barić Ravbar", "Julijana Jovanić", "mag. Damir Cibic", "Tjaša Stanić Gjorgjievska", "Peter Rondaij", "dr. Petja Grafenauer", "Marko Ocvirk", "Maja Ziherl", "Bronislav Prusnik", "Darja Hočevar Mlinarič", "Tadej Mauhar", "Martina Mauhar", "dr. Aleksander Sašo Slaček Brlek", "Irena Zorko Novak", "Sandi Mavrič", "Katja Sluga", "Leo Novak"],
  6: ["Jasna Gorenšek"],
  7: ["dr. Bojan Rotar", "Simona Kaučič", "Klemen Traven", "Anica Elizabeta Hmelak", "Alenka Traven", "Milan Novak"],
  8: ["mag. Arne Vehovar", "dr. Jasminka Dedić", "Ibrahim Nouhoum", "Kaja Lipnik Vehovar", "Mario Azinović", "Bojana Ropoša", "Diana Ternav"],
  9: ["Mateja Drobnič", "Alojz Peterle", "Vera Devetak", "dr. Janez Dular"],
  10: ["Luka Rotar", "Avguština Zupančič", "Boris Makoter", "Petra Koritnik", "Danilo Tomšič", "Polonca Bratož Opaškar"],
  11: ["Metod Miklič", "Gordana Sredojević", "Tilen Mauhar", "Mila Sredojević", "Marcel Mauhar", "Laura Vrhovnik", "Filip Janžekovič", "Iris Vinski", "mag. Tita (Tita Marija) Guček", "Almir Daljac"],
  12: ["Andraž Vučko"],
  13: ["Matej Bertoša", "Andrejka Kejžar", "Gregor Grošelj", "Urša Bertoša", "mag. Zore Lukin"],
  14: ["Gregor Hribar"],
  15: ["Stanko Furlan", "Alenka Žibert", "Dejan Mikuš", "Tanja Hižak Furlan", "Matic Kos", "Kaja Furlan", "Drago Bratun", "Breda Bertole", "Igor Gajser", "Breda Vidonja", "Oton Furlan", "Doris Kos", "Otilija Helena Mikuš"],
};

function kandidatiSectionHtml(n) {
  const names = KANDIDATI[n];
  if (!names || !names.length) return "";
  const items = names.map(function (name) {
    return "<li>" + name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</li>";
  }).join("");
  return '<section class="kandidati-box" id="kandidati">'
    + '<h3 class="sek">Kandidati na listi</h3>'
    + '<ol class="kandidati">' + items + "</ol>"
    + '<p class="kandidati-vir"><a href="' + MOL_SEZNAM_URL + '" target="_blank" rel="noopener noreferrer">Uradni seznam kandidatov (MOL)</a></p>'
    + "</section>";
}

function vstaviKandidate(n, afterSelector) {
  const html = kandidatiSectionHtml(n);
  const el = document.querySelector(afterSelector);
  if (el && html) el.insertAdjacentHTML("afterend", html);
}

const LISTE_META = {
  1: { logo: "logo/01-svoboda.svg", web: "https://gibanjesvoboda.si/obcina/mestna-obcina-ljubljana/" },
  2: { logo: "logo/02-sls.png", web: "https://sls.si/" },
  3: { logo: "logo/03-demokrati.svg", web: "https://www.demokrati.si/" },
  4: { logo: "logo/04-pirati.png", web: "https://piratskastranka.si/" },
  5: { logo: "logo/05-levica.png", web: "https://www.levica.si/" },
  6: { logo: "logo/06-prerod.png", web: "https://prerod.si/" },
  7: { logo: "logo/07-sds.png", web: "https://www.sds.si/" },
  8: { logo: "logo/08-vesna.png", web: "https://www.vesnazelenastranka.si/" },
  9: { logo: "", web: "" },
  10: { logo: "logo/10-sd.png", web: "https://socialnidemokrati.si/" },
  11: { logo: "logo/11-cilj.png", web: "https://www.cilj.org/" },
  12: { logo: "logo/12-straza.png", web: "https://strazar.si/" },
  13: { logo: "logo/13-lsv.svg", web: "https://ljubljanasmovsi.si/" },
  14: { logo: "logo/14-resnica.png", web: "https://stranka-resnica.si/" },
  15: { logo: "logo/15-lzj.png", web: "https://zoranjankovic.si/ljubljana/projekti-po-cetrtnih-skupnostih/bezigrad" }
};

const PRIO_ID = {
  "Parkiranje": "p-parkiranje",
  "Pošta, banka in druge storitve": "p-storitve",
  "Promet skozi naselje": "p-promet",
  "Igle in droge, občutek varnosti": "p-varnost",
  "Varnost": "p-varnost",
  "Več klopi": "p-klopi",
  "Čistoča in pasji iztrebki": "p-cistoca",
  "Drevesa in zelenice": "p-zelenje",
  "Dom skupnosti, prostor za druženje": "p-dom",
  "Boljši zrak in hrup": "p-zrak",
  "Igrišča in prostor za mlade": "p-mladi",
  "Mala dela ČS in prijave poškodb": "p-maladela"
};

function prioId(name) {
  if (PRIO_ID[name]) return PRIO_ID[name];
  return "p-" + name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function vstaviLogoInSplet(n, h2Selector) {
  const meta = LISTE_META[n] || {};
  const h2 = document.querySelector(h2Selector);
  if (!h2) return;
  if (meta.logo && !h2.querySelector(".lista-logo")) {
    const img = document.createElement("img");
    img.className = "lista-logo";
    img.src = meta.logo;
    img.alt = "";
    h2.appendChild(img);
  }
  if (meta.web && !document.querySelector(".lista-splet")) {
    const p = document.createElement("p");
    p.className = "lista-splet";
    const a = document.createElement("a");
    a.href = meta.web;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Spletna stran";
    p.appendChild(a);
    h2.insertAdjacentElement("afterend", p);
  }
}

function vstaviPrioKazalo() {
  const h2 = document.getElementById("pet-prioritet");
  if (!h2 || document.querySelector(".prio-kazalo")) return;
  const boxes = document.querySelectorAll("section.prio-box");
  if (!boxes.length) return;
  const ol = document.createElement("ol");
  ol.className = "prio-kazalo";
  boxes.forEach(function (box) {
    const h3 = box.querySelector("h3.sek");
    if (!h3) return;
    const clone = h3.cloneNode(true);
    clone.querySelectorAll(".prio-lab").forEach(function (el) { el.remove(); });
    const name = clone.textContent.replace(/\s+/g, " ").trim();
    if (!box.id) box.id = prioId(name);
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + box.id;
    a.textContent = name;
    li.appendChild(a);
    ol.appendChild(li);
  });
  h2.insertAdjacentElement("afterend", ol);
}

function vstaviLogotipeNaKartice() {
  for (let n = 1; n <= 15; n++) {
    const card = document.getElementById("lista-" + n);
    const meta = LISTE_META[n];
    if (!card || !meta || !meta.logo) continue;
    const title = card.querySelector("h2, h3");
    if (!title || title.querySelector(".lista-logo")) continue;
    const img = document.createElement("img");
    img.className = "lista-logo";
    img.src = meta.logo;
    img.alt = "";
    title.appendChild(img);
  }
}

function pripraviListo(n, h2Selector) {
  vstaviKandidate(n, h2Selector);
  vstaviLogoInSplet(n, h2Selector);
  vstaviPrioKazalo();
}
