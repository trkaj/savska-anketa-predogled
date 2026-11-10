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
  9: { logo: "logo/09-nsi.png", web: "https://nsi.si/" },
  10: { logo: "logo/10-sd.png", web: "https://socialnidemokrati.si/" },
  11: { logo: "logo/11-cilj.png", web: "https://www.cilj.org/" },
  12: { logo: "logo/12-straza.png", web: "https://strazar.si/" },
  13: { logo: "logo/13-lsv.svg", web: "https://ljubljanasmovsi.si/" },
  14: { logo: "logo/14-resnica.png", web: "https://stranka-resnica.si/" },
  15: { logo: "logo/15-lzj.png", web: "https://zoranjankovic.si/ljubljana/projekti-po-cetrtnih-skupnostih/bezigrad" }
};

const LISTE_IME = {
  1: "Gibanje Svoboda",
  2: "Slovenska ljudska stranka",
  3: "Demokrati. Anžeta Logarja",
  4: "Pirati",
  5: "Levica",
  6: "Prerod – stranka Vladimirja Prebiliča",
  7: "Slovenska demokratska stranka – SDS",
  8: "Vesna – zelena stranka",
  9: "Nova Slovenija in Fokus",
  10: "Socialni demokrati",
  11: "Cilj – Bežigrad",
  12: "Stranka Straža – katoliška narodna stranka",
  13: "Ljubljana smo vsi – lista mag. Urške Klakočar Zupančič in dr. Antona Ropa",
  14: "Državljansko gibanje Resni.ca",
  15: "Lista Zorana Jankovića"
};

function imeListe(n) {
  const ime = (typeof LISTE_IME !== "undefined" && LISTE_IME[n])
    || (typeof LISTE_KRATKO !== "undefined" && LISTE_KRATKO[n])
    || ("Lista " + n);
  return n + ". " + ime;
}

function razlagaListe(n, qid) {
  if (typeof RAZLAGE === "undefined") return "";
  const block = RAZLAGE[n] || RAZLAGE[String(n)] || {};
  return block[qid] || "";
}

function skrajsajBesedilo(s, max) {
  s = String(s || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  const base = (sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[.,;:\s]+$/, "");
  return base + "…";
}


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

function vstaviPovezaveNaKartice() {
  for (let n = 1; n <= 15; n++) {
    const card = document.getElementById("lista-" + n);
    if (!card) continue;
    const title = card.querySelector("h2, h3");
    if (!title) continue;
    const href = stranListe(n);
    if (!href) continue;
    if (title.children.length === 1 && title.firstElementChild && title.firstElementChild.tagName === "A") {
      title.firstElementChild.setAttribute("href", href);
      continue;
    }
    const a = document.createElement("a");
    a.href = href;
    while (title.firstChild) {
      const node = title.firstChild;
      if (node.nodeType === 1 && node.tagName === "A") {
        while (node.firstChild) a.appendChild(node.firstChild);
        title.removeChild(node);
      } else {
        a.appendChild(node);
      }
    }
    title.appendChild(a);
  }
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
    const host = title.querySelector("a") || title;
    host.appendChild(img);
  }
}

function pripraviListo(n, h2Selector) {
  vstaviKandidate(n, h2Selector);
  vstaviLogoInSplet(n, h2Selector);
  vstaviPovzetek(n);
  vstaviPrioKazalo();
  vstaviTemeIds();
  vstaviPrimerjajPovezave();
  vstaviSidraVprasanj();
}
function escHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function stranListe(n) {
  const map = {1: "lista-1.html", 2: "lista-2.html", 4: "lista-4.html", 5: "lista-5.html", 6: "lista-6.html", 7: "lista-7.html", 8: "lista-8.html", 10: "lista-10.html", 11: "lista-11.html", 12: "lista-12.html", 13: "lista-13.html", 15: "lista-15.html"};
  return map[n] || ("lista.html?n=" + n);
}

function vstaviPovzetek(n) {
  if (document.getElementById("povzetek")) return;
  const data = (typeof ODGOVORI !== "undefined") ? ODGOVORI[n] : null;
  let html;
  if (!data) {
    html = '<aside class="povzetek" id="povzetek"><p>Odgovora še ni. Liste lahko odgovorijo do torka, 10. 11. 2026, do 24.00.</p></aside>';
  } else {
    const c = data.counts;
    html = '<aside class="povzetek" id="povzetek">';
    html += '<p class="povzetek-st">' + c.da + ' × <span class="odg da">Da</span> · ' + c.delno + ' × <span class="odg delno">Delno</span> · ' + c.ne + ' × <span class="odg ne">Ne</span></p>';
    html += '<div class="tags povzetek-prio">';
    (data.prioritet || []).forEach(function (name, i) {
      const tid = data.prioritetId[i];
      const sid = (typeof TEMA_SID !== "undefined" && TEMA_SID[tid]) ? TEMA_SID[tid] : ("p-" + tid);
      html += '<a class="tag" href="#' + sid + '"><span class="roka" aria-hidden="true">🖐️</span>' + (i + 1) + ". " + escHtml(name) + "</a>";
    });
    html += "</div></aside>";
  }
  const after = document.querySelector(".lista-splet")
    || document.querySelector("main h2")
    || document.getElementById("naslov");
  if (after) after.insertAdjacentHTML("afterend", html);
}

function vstaviTemeIds() {
  document.querySelectorAll("section.prio-box, section.tema-box").forEach(function (box) {
    if (box.id) return;
    const h3 = box.querySelector("h3.sek");
    if (!h3) return;
    const clone = h3.cloneNode(true);
    clone.querySelectorAll(".prio-lab").forEach(function (el) { el.remove(); });
    const name = clone.textContent.replace(/\s+/g, " ").trim();
    box.id = prioId(name);
  });
}

function vstaviPrimerjajPovezave() {
  const blocks = document.querySelectorAll("section.prio-box, section.tema-box, section.blok-komunikacija, section.zakaj-box");
  blocks.forEach(function (box) {
    const h3 = box.querySelector("h3.sek");
    if (!h3 || h3.querySelector(".primerjaj")) return;
    let sid = box.id;
    if (!sid && box.classList.contains("blok-komunikacija")) sid = "komunikacija";
    if (!sid && box.classList.contains("zakaj-box")) sid = "zakaj";
    if (!sid) {
      const clone = h3.cloneNode(true);
      clone.querySelectorAll(".prio-lab").forEach(function (el) { el.remove(); });
      sid = prioId(clone.textContent.replace(/\s+/g, " ").trim());
    }
    const temaKey = Object.keys(typeof TEMA_SID !== "undefined" ? TEMA_SID : {}).find(function (k) {
      return TEMA_SID[k] === sid;
    }) || (sid || "").replace(/^p-/, "");
    const a = document.createElement("a");
    a.className = "primerjaj";
    a.href = "index.html#pv-" + temaKey;
    a.textContent = "Primerjaj";
    h3.appendChild(document.createTextNode(" "));
    h3.appendChild(a);
  });
}


function vstaviPrimerjavo() {
  const mount = document.getElementById("primerjava-wrap");
  if (!mount || typeof VPRASANJA === "undefined") return;
  const lists = [];
  for (let n = 1; n <= 15; n++) lists.push(n);

  function badge(n, q) {
    const data = ODGOVORI[n] || ODGOVORI[String(n)];
    const prioIdx = data && data.prioritetId ? data.prioritetId.indexOf(q.temaId) : -1;
    const prio = prioIdx !== -1;
    const prioN = prio ? prioIdx + 1 : 0;
    const odg = data && data.odgovori ? data.odgovori[q.id] : null;
    const cls = odg === "Da" ? "da" : (odg === "Delno" ? "delno" : (odg === "Ne" ? "ne" : ""));
    const label = imeListe(n) + ", " + (odg || "Odgovora še ni") + (prioN ? ", " + prioN + ". prioriteta te liste" : "");
    const pill = odg
      ? '<span class="odg ' + cls + '" aria-hidden="true">' + escHtml(odg) + "</span>"
      : '<span class="celica-prazna" aria-hidden="true">–</span>';
    const st = prioN
      ? '<span class="prio-st" aria-hidden="true">' + prioN + "</span>"
      : '<span class="prio-st prio-st-prazno" aria-hidden="true"></span>';
    return { prio: !!prio, prioN: prioN, html: '<button type="button" class="celica-tip" aria-expanded="false" aria-haspopup="dialog" data-lista="' + n + '" data-qid="' + escHtml(q.id) + '" aria-label="' + escHtml(label) + '">' + st + pill + "</button>" };
  }

  let html = '<div class="primerjava-scroll" tabindex="0">';
  html += '<table class="primerjava">';
  html += "<thead><tr><th scope=\"col\">Vprašanje</th>";
  lists.forEach(function (n) {
    const meta = (typeof LISTE_META !== "undefined" && LISTE_META[n]) ? LISTE_META[n] : {};
    const ime = LISTE_KRATKO[n] || n;
    const logo = meta.logo ? '<img class="lista-logo" src="' + meta.logo + '" alt="">' : "";
    html += '<th scope="col" class="colhead"><a href="' + stranListe(n) + '"><span class="nr">' + n + ".</span> " + logo + "<br>" + escHtml(ime) + "</a></th>";
  });
  html += "</tr></thead><tbody>";

  let lastTema = "";
  VPRASANJA.forEach(function (q) {
    if (q.tema !== lastTema) {
      lastTema = q.tema;
      html += '<tr class="pv-skupina" id="pv-' + q.temaId + '"><th colspan="16"><span class="pv-naslov">' + escHtml(q.tema) + "</span></th></tr>";
    }
    html += "<tr>";
    html += '<th scope="row"><span title="' + escHtml(q.vprasanje) + '">' + escHtml(q.label) + "</span></th>";
    lists.forEach(function (n) {
      const c = badge(n, q);
      html += '<td' + (c.prio ? ' class="ima-prio"' : "") + ">" + c.html + "</td>";
    });
    html += "</tr>";
  });
  html += "</tbody></table></div>";
  mount.innerHTML = html;
  vstaviOblacke();
}

function vstaviSidraVprasanj() {
  if (typeof VPRASANJA === "undefined") return;
  const rvs = document.querySelectorAll("div.rv");
  if (!rvs.length) return;

  function norm(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }
  function variants(q) {
    const v = norm(q.vprasanje);
    const out = [v];
    const label = norm(q.label || "");
    if (label && v.indexOf(label + ":") === 0) out.push(norm(v.slice(label.length + 1)));
    return out;
  }

  const extras = [
    { id: "zakaj-1", vprasanje: "Zakaj naj prebivalka ali prebivalec Savskega naselja glasuje prav za vašo listo?", label: "" },
    { id: "zakaj-2", vprasanje: "Kaj lahko prebivalci Savskega naselja pričakujejo prav od vas, če boste izvoljeni?", label: "" }
  ];
  const all = VPRASANJA.concat(extras);
  const used = {};

  rvs.forEach(function (rv) {
    if (rv.id) {
      used[rv.id] = true;
      return;
    }
    const t = norm(rv.textContent);
    let best = null;
    let bestLen = 0;
    all.forEach(function (q) {
      if (used[q.id]) return;
      variants(q).forEach(function (v) {
        if (v && t.indexOf(v) !== -1 && v.length > bestLen) {
          best = q.id;
          bestLen = v.length;
        }
      });
    });
    if (best) {
      rv.id = best;
      used[best] = true;
    }
  });

  const hash = (location.hash || "").replace(/^#/, "");
  if (hash) {
    const cilj = document.getElementById(hash);
    if (cilj && cilj.scrollIntoView) {
      requestAnimationFrame(function () { cilj.scrollIntoView({ block: "start" }); });
    }
  }
}

function vstaviOblacke() {
  const wrap = document.getElementById("primerjava-wrap");
  if (!wrap) return;
  if (wrap.getAttribute("data-oblacek") === "1") return;
  wrap.setAttribute("data-oblacek", "1");

  let openBtn = null;
  let pinned = false;
  let closeTimer = null;
  let dismissedBtn = null;
  const box = document.createElement("div");
  box.className = "oblacek";
  box.id = "oblacek-primerjava";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-labelledby", "oblacek-naslov");
  box.hidden = true;
  document.body.appendChild(box);

  function dataListe(n) {
    return (typeof ODGOVORI !== "undefined" && (ODGOVORI[n] || ODGOVORI[String(n)])) || null;
  }

  function vsebina(n, qid) {
    const data = dataListe(n);
    const odg = data && data.odgovori ? data.odgovori[qid] : null;
    const cls = odg === "Da" ? "da" : (odg === "Delno" ? "delno" : (odg === "Ne" ? "ne" : ""));
    const href = stranListe(n) + "#" + qid;
    let html = '<p class="oblacek-ime" id="oblacek-naslov">' + escHtml(imeListe(n)) + "</p>";
    if (odg) {
      html += '<p class="oblacek-odg">Odgovor: <span class="odg ' + cls + '">' + escHtml(odg) + "</span></p>";
      let prioN = 0;
      if (data && data.prioritetId && typeof VPRASANJA !== "undefined") {
        const q = VPRASANJA.find(function (x) { return x.id === qid; });
        if (q) {
          const i = data.prioritetId.indexOf(q.temaId);
          if (i !== -1) prioN = i + 1;
        }
      }
      if (prioN) html += '<p class="oblacek-prio">Prioriteta liste: ' + prioN + ".</p>";
      const raz = razlagaListe(n, qid);
      if (raz) {
        const full = raz.replace(/\s+/g, " ").trim();
        const short = skrajsajBesedilo(raz, 300);
        html += '<div class="oblacek-razl"><span class="razl-lab">Razlaga zaveze</span>' + escHtml(short) + "</div>";
      }
    } else {
      html += '<p class="oblacek-odg">Odgovora še ni</p>';
    }
    html += '<a class="oblacek-vec" href="' + href + '">Celoten odgovor liste →</a>';
    return html;
  }

  function umesti(btn) {
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const m = 8;
    box.style.visibility = "hidden";
    box.style.display = "block";
    box.style.left = "0px";
    box.style.top = "0px";
    const bw = box.offsetWidth;
    const bh = box.offsetHeight;
    let left = r.left + r.width / 2 - bw / 2;
    left = Math.max(m, Math.min(left, vw - bw - m));
    let top = r.bottom + 8;
    if (top + bh > vh - m && r.top - 8 - bh >= m) top = r.top - 8 - bh;
    if (top + bh > vh - m) top = Math.max(m, vh - bh - m);
    if (top < m) top = m;
    box.style.left = Math.round(left) + "px";
    box.style.top = Math.round(top) + "px";
    box.style.visibility = "visible";
  }

  function zapri() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    box.hidden = true;
    box.style.display = "none";
    box.innerHTML = "";
    if (openBtn) {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.removeAttribute("aria-controls");
    }
    const prev = openBtn;
    openBtn = null;
    pinned = false;
    return prev;
  }

  function odpri(btn, pin) {
    if (dismissedBtn && btn === dismissedBtn && !pin) return;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    if (dismissedBtn && btn !== dismissedBtn) dismissedBtn = null;
    const n = btn.getAttribute("data-lista");
    const qid = btn.getAttribute("data-qid");
    if (openBtn && openBtn !== btn) {
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.removeAttribute("aria-controls");
    }
    box.innerHTML = vsebina(n, qid);
    box.hidden = false;
    box.style.display = "block";
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-controls", box.id);
    openBtn = btn;
    if (pin) pinned = true;
    umesti(btn);
  }

  function jeFine() {
    return window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  wrap.addEventListener("click", function (e) {
    const btn = e.target.closest && e.target.closest(".celica-tip");
    if (!btn || !wrap.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();
    if (openBtn === btn && pinned) {
      const prev = zapri();
      if (prev) prev.focus();
    } else {
      odpri(btn, true);
    }
  });

  document.addEventListener("click", function (e) {
    if (!openBtn) return;
    if (box.contains(e.target) || openBtn.contains(e.target)) return;
    zapri();
  });

  document.addEventListener("keydown", function (e) {
    if (!openBtn) return;
    if (e.key === "Escape") {
      const prev = zapri();
      dismissedBtn = prev;
      e.preventDefault();
      if (prev) prev.focus({ preventScroll: true });
      return;
    }
    if (e.key === "Tab" && !e.shiftKey && document.activeElement === openBtn) {
      const link = box.querySelector(".oblacek-vec");
      if (link && !box.hidden) {
        e.preventDefault();
        link.focus();
      }
    } else if (e.key === "Tab" && e.shiftKey && box.contains(document.activeElement)) {
      e.preventDefault();
      openBtn.focus();
    }
  });

  wrap.addEventListener("pointerover", function (e) {
    if (!jeFine()) return;
    const btn = e.target.closest && e.target.closest(".celica-tip");
    if (!btn || !wrap.contains(btn)) return;
    if (pinned && openBtn && openBtn !== btn) return;
    odpri(btn, false);
  });

  wrap.addEventListener("pointerout", function (e) {
    const btn = e.target.closest && e.target.closest(".celica-tip");
    const rel = e.relatedTarget;
    if (btn && dismissedBtn === btn && !(rel && btn.contains(rel))) dismissedBtn = null;
    if (!openBtn || pinned || !jeFine()) return;
    if (!btn) return;
    if (rel && (box.contains(rel) || (openBtn && openBtn.contains(rel)))) return;
    closeTimer = setTimeout(function () {
      if (!pinned) zapri();
    }, 220);
  });

  box.addEventListener("pointerenter", function () {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  });
  box.addEventListener("pointerleave", function () {
    if (!pinned) {
      closeTimer = setTimeout(function () {
        if (!pinned) zapri();
      }, 220);
    }
  });

  wrap.addEventListener("focusin", function (e) {
    const btn = e.target.closest && e.target.closest(".celica-tip");
    if (!btn || !wrap.contains(btn)) return;
    if (dismissedBtn && btn === dismissedBtn) return;
    odpri(btn, true);
  });

  function premakni() {
    if (openBtn && !box.hidden) umesti(openBtn);
  }
  window.addEventListener("resize", premakni);
  window.addEventListener("scroll", premakni, { passive: true });
  const sc = wrap.querySelector(".primerjava-scroll");
  if (sc) sc.addEventListener("scroll", premakni, { passive: true });
}
