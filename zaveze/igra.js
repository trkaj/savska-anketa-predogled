/* Nevtralna igrifikacija branja zavez. Samo localStorage, brez analitike. */
(function () {
  "use strict";

  var KLJUC = "savskaZavezeIgra.v1";
  var SKUPAJ = 15;
  var JAVNA = "https://anketa.savska.org/";
  var SHARE_BASE = "https://anketa.savska.org/zaveze/";
  var SHARE_TXT = "Kaj liste za svet ČS Bežigrad obljubljajo Savskemu naselju? Preberi odgovore vseh 15 list.";
  var SHARE_NASLOV = "Zaveze kandidatnih list · Savsko naselje";
  var IZP = { 1: 1, 2: 1, 5: 1, 7: 1, 8: 1, 11: 1, 13: 1, 15: 1 };

  var ZNACKE = [
    { id: "prvi-korak", ime: "Prvi korak", opis: "Prebrana prva lista." },
    { id: "primerjalec", ime: "Primerjalec/ka", opis: "Prebrane tri liste." },
    { id: "tema", ime: "Pogledal/a sem svojo temo", opis: "Ogled primerjalne tabele tem." },
    { id: "pol-poti", ime: "Pol poti", opis: "Prebranih osem list." }
  ];

  var stanje = nalozi();
  var zacetniZnacki = stanje.znacke.slice();

  function prazno() {
    return {
      prebrane: [],
      znacke: [],
      tema: false
    };
  }

  function nalozi() {
    try {
      var s = localStorage.getItem(KLJUC);
      if (!s) return prazno();
      var o = JSON.parse(s);
      var prebrane = [];
      (o.prebrane || []).forEach(function (n) {
        n = parseInt(n, 10);
        if (n >= 1 && n <= SKUPAJ && prebrane.indexOf(n) === -1) prebrane.push(n);
      });
      prebrane.sort(function (a, b) { return a - b; });
      var znacke = [];
      (o.znacke || []).forEach(function (id) {
        if (ZNACKE.some(function (z) { return z.id === id; }) && znacke.indexOf(id) === -1) znacke.push(id);
      });
      return {
        prebrane: prebrane,
        znacke: znacke,
        tema: !!o.tema
      };
    } catch (e) {
      return prazno();
    }
  }

  function shrani() {
    try {
      localStorage.setItem(KLJUC, JSON.stringify(stanje));
    } catch (e) { /* zasebni način ali poln prostor */ }
  }

  function trenutnaLista() {
    var pot = location.pathname || "";
    var m = pot.match(/lista-(\d+)\.html$/);
    if (m) {
      var n = parseInt(m[1], 10);
      return n >= 1 && n <= SKUPAJ ? n : null;
    }
    if (/lista\.html$/.test(pot)) {
      var q = parseInt(new URLSearchParams(location.search).get("n") || "", 10);
      if (!(q >= 1 && q <= SKUPAJ)) return null;
      if (IZP[q]) return null;
      return q;
    }
    return null;
  }

  function zeliManjGibanja() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function oznaciPrebrano(n) {
    n = parseInt(n, 10);
    if (!(n >= 1 && n <= SKUPAJ)) return false;
    if (stanje.prebrane.indexOf(n) !== -1) return false;
    stanje.prebrane.push(n);
    stanje.prebrane.sort(function (a, b) { return a - b; });
    shrani();
    return true;
  }

  function oznaciTemo() {
    if (stanje.tema) return false;
    stanje.tema = true;
    shrani();
    return true;
  }

  function preveriZnacke() {
    var nove = [];
    var st = stanje.prebrane.length;
    var pogoji = {
      "prvi-korak": st >= 1,
      "primerjalec": st >= 3,
      "tema": !!stanje.tema,
      "pol-poti": st >= 8
    };
    ZNACKE.forEach(function (z) {
      if (pogoji[z.id] && stanje.znacke.indexOf(z.id) === -1) {
        stanje.znacke.push(z.id);
        nove.push(z);
      }
    });
    if (nove.length) shrani();
    return nove;
  }

  function sporoci(besedilo) {
    var el = document.getElementById("igra-zivo");
    if (!el) return;
    el.textContent = "";
    setTimeout(function () { el.textContent = besedilo; }, 40);
  }

  function vstaviPas() {
    if (document.getElementById("igra-pas")) return;
    var hd = document.querySelector("header.hd");
    var pas = document.createElement("div");
    pas.id = "igra-pas";
    pas.className = "igra-pas";
    pas.setAttribute("role", "region");
    pas.setAttribute("aria-label", "Napredek branja zavez");
    pas.innerHTML =
      '<div class="igra-pas-vrstica">' +
        '<div class="igra-pas-meter" id="igra-meter" role="progressbar" aria-valuemin="0" aria-valuemax="' + SKUPAJ + '" aria-valuenow="0">' +
          '<span class="igra-pas-fill" id="igra-fill"></span>' +
        '</div>' +
        '<p class="igra-pas-txt" id="igra-txt"></p>' +
      '</div>' +
      '<ul class="igra-znacke" id="igra-znacke"></ul>' +
      '<div id="igra-zivo" class="igra-sr" aria-live="polite"></div>';
    if (hd && hd.parentNode) {
      hd.insertAdjacentElement("afterend", pas);
    } else {
      document.body.insertAdjacentElement("afterbegin", pas);
    }
    document.body.classList.add("igra-ima-pas");
    osveziPas(false);
  }

  function osveziPas(najavi) {
    var st = stanje.prebrane.length;
    var txt = "Prebral/a si " + st + " od " + SKUPAJ + " list";
    var meter = document.getElementById("igra-meter");
    var fill = document.getElementById("igra-fill");
    var p = document.getElementById("igra-txt");
    if (meter) {
      meter.setAttribute("aria-valuenow", String(st));
      meter.setAttribute("aria-label", txt);
    }
    if (fill) fill.style.width = (100 * st / SKUPAJ) + "%";
    if (p) p.textContent = txt;
    var ul = document.getElementById("igra-znacke");
    if (ul) {
      ul.innerHTML = ZNACKE.map(function (z) {
        var ima = stanje.znacke.indexOf(z.id) !== -1;
        return '<li class="igra-znacka' + (ima ? " je" : "") + '"' +
          (ima ? "" : " aria-disabled=\"true\"") +
          ' title="' + z.opis + '">' +
          (ima ? '<span class="igra-znacka-ok" aria-hidden="true"></span>' : "") +
          '<span>' + z.ime + "</span></li>";
      }).join("");
    }
    oznaciKartice();
    if (najavi) sporoci(txt);
    meriPas();
  }

  function meriPas() {
    var pas = document.getElementById("igra-pas");
    if (!pas) return;
    document.documentElement.style.setProperty("--igra-pas-h", pas.offsetHeight + "px");
  }

  function oznaciKartice() {
    stanje.prebrane.forEach(function (n) {
      var card = document.getElementById("lista-" + n);
      if (!card || card.querySelector(".igra-ok")) return;
      card.classList.add("igra-prebrana");
      var ok = document.createElement("span");
      ok.className = "igra-ok";
      ok.textContent = "prebrano";
      card.appendChild(ok);
    });
  }

  function pokaziToast(nove) {
    if (!nove.length) return;
    var star = document.getElementById("igra-toast");
    if (star) star.remove();
    var imena = nove.map(function (z) { return z.ime; }).join(", ");
    var t = document.createElement("div");
    t.id = "igra-toast";
    t.className = "igra-toast";
    t.setAttribute("role", "status");
    t.innerHTML = '<p class="igra-toast-k">Nova značka</p><p class="igra-toast-i">' + imena + "</p>";
    document.body.appendChild(t);
    sporoci("Prebral/a si " + stanje.prebrane.length + " od " + SKUPAJ + " list. Nova značka: " + imena + ".");
    if (!zeliManjGibanja()) konfeti();
    setTimeout(function () {
      t.classList.add("skrij");
      setTimeout(function () { t.remove(); }, 400);
    }, 2800);
  }

  function konfeti() {
    if (zeliManjGibanja()) return;
    var stari = document.getElementById("igra-konfeti");
    if (stari) stari.remove();
    var c = document.createElement("canvas");
    c.id = "igra-konfeti";
    c.className = "igra-konfeti";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    var ctx = c.getContext("2d");
    var w, h, kosi = [], zacetek = performance.now();
    function meri() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    }
    meri();
    var barve = ["#0b3d24", "#0b5d2e", "#f5c400", "#fff4c2", "#ffffff"];
    for (var i = 0; i < 70; i++) {
      kosi.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 80,
        s: 5 + Math.random() * 7,
        v: 2.2 + Math.random() * 3.2,
        vx: -1.4 + Math.random() * 2.8,
        r: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        b: barve[i % barve.length],
        kvadrat: i % 2 === 0
      });
    }
    function ris(t) {
      var dt = Math.min(32, t - (ris._t || t));
      ris._t = t;
      ctx.clearRect(0, 0, w, h);
      kosi.forEach(function (p) {
        p.x += p.vx * (dt / 16);
        p.y += p.v * (dt / 16);
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.b;
        if (p.kvadrat) ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (t - zacetek < 1400) requestAnimationFrame(ris);
      else c.remove();
    }
    requestAnimationFrame(ris);
    setTimeout(function () { window.removeEventListener("resize", meri); }, 1500);
    window.addEventListener("resize", meri);
  }

  function javniUrlListe(n) {
    if (!(n >= 1 && n <= SKUPAJ)) return SHARE_BASE;
    if (IZP[n]) return SHARE_BASE + "lista-" + n + ".html";
    return SHARE_BASE + "lista.html?n=" + n;
  }

  function preveriJavniUrl(url) {
    if (!url || url.indexOf("/zaveze/") === -1) return SHARE_BASE;
    return url;
  }

  function htmlDeliBloka(url, besedilo) {
    url = preveriJavniUrl(url || SHARE_BASE);
    besedilo = besedilo || SHARE_TXT;
    var e = encodeURIComponent;
    var t = besedilo + " " + url;
    var nativeBtn = navigator.share
      ? '<button type="button" class="gumb" data-deli="native">Deli</button>'
      : "";
    return (
      '<div class="deli-razdelek">' +
        "<h3>Deli naprej</h3>" +
        '<div class="deli-gumbi">' +
          nativeBtn +
          '<a class="gumb" href="https://www.facebook.com/sharer/sharer.php?u=' + e(url) + '" target="_blank" rel="noopener noreferrer">Facebook</a>' +
          '<a class="gumb" href="https://wa.me/?text=' + e(t) + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
          '<a class="gumb" href="viber://forward?text=' + e(t) + '">Viber</a>' +
          '<a class="gumb" href="https://twitter.com/intent/tweet?text=' + e(besedilo) + "&amp;url=" + e(url) + '" target="_blank" rel="noopener noreferrer">X</a>' +
          '<a class="gumb" href="mailto:?subject=' + e(SHARE_NASLOV) + "&amp;body=" + e(t) + '">E-pošta</a>' +
          '<button type="button" class="gumb" data-deli="kopiraj">Kopiraj povezavo</button>' +
        "</div>" +
        '<p class="deli-stanje" role="status"></p>' +
      "</div>"
    );
  }

  function narediDeliBlok(url, besedilo, kompakten) {
    url = preveriJavniUrl(url || SHARE_BASE);
    var wrap = document.createElement("div");
    wrap.innerHTML = htmlDeliBloka(url, besedilo);
    var blok = wrap.firstElementChild;
    if (kompakten) {
      blok.classList.add("deli-kompakt");
      var h = blok.querySelector("h3");
      if (h) h.remove();
    }
    poveziDeliBlok(blok, url, besedilo);
    return blok;
  }

  function poveziDeliBlok(koren, url, besedilo) {
    if (!koren || koren.getAttribute("data-deli-vezan") === "1") return;
    koren.setAttribute("data-deli-vezan", "1");
    url = preveriJavniUrl(url || SHARE_BASE);
    besedilo = besedilo || SHARE_TXT;
    koren.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-deli]");
      if (!btn || !koren.contains(btn)) return;
      e.preventDefault();
      var stanjeEl = koren.querySelector(".deli-stanje");
      if (btn.getAttribute("data-deli") === "native") {
        if (navigator.share) {
          navigator.share({ title: SHARE_NASLOV, text: besedilo, url: url }).then(function () {
            if (stanjeEl) stanjeEl.textContent = "Hvala, ker deliš.";
          }).catch(function (err) {
            if (err && err.name === "AbortError") return;
            kopirajUrl(url, stanjeEl);
          });
        } else kopirajUrl(url, stanjeEl);
      } else if (btn.getAttribute("data-deli") === "kopiraj") {
        kopirajUrl(url, stanjeEl);
      }
    });
  }

  function kopirajUrl(url, stanjeEl) {
    url = preveriJavniUrl(url || SHARE_BASE);
    function uspeh() {
      if (stanjeEl) stanjeEl.textContent = "Povezava je kopirana.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(uspeh, function () {
        if (stanjeEl) stanjeEl.textContent = "Kopiraj povezavo: " + url;
      });
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = url;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); uspeh(); }
    catch (e) { if (stanjeEl) stanjeEl.textContent = "Kopiraj povezavo: " + url; }
    ta.remove();
  }

  function vstaviAnketoPovezavo() {
    document.querySelectorAll("p.webar, footer").forEach(function (el) {
      if (el.querySelector("a.igra-anketa") || /Izpolni anketo/.test(el.textContent)) return;
      el.appendChild(document.createTextNode(" · "));
      var a = document.createElement("a");
      a.className = "igra-anketa";
      a.href = JAVNA;
      a.textContent = "Izpolni anketo";
      el.appendChild(a);
    });
  }

  function vstaviDeliNaStran() {
    var n = trenutnaLista();
    if (n == null) {
      vstaviDeliNaKartice();
      return;
    }
    if (document.querySelector("main .deli-razdelek")) return;
    var url = javniUrlListe(n);
    var blok = narediDeliBlok(url, SHARE_TXT, false);
    var p = document.createElement("p");
    p.className = "deli-anketa-povezava";
    p.innerHTML = '<a class="igra-anketa" href="' + JAVNA + '">Izpolni anketo</a>';
    blok.appendChild(p);
    var navs = document.querySelectorAll("nav.listnav");
    var target = navs.length ? navs[navs.length - 1] : null;
    if (target && target.parentNode) target.insertAdjacentElement("afterend", blok);
    else {
      var main = document.querySelector("main");
      if (main) main.appendChild(blok);
    }
  }

  function vstaviDeliNaKartice() {
    for (var n = 1; n <= SKUPAJ; n++) {
      var card = document.getElementById("lista-" + n);
      if (!card || card.querySelector(".deli-kartica")) continue;
      var det = document.createElement("details");
      det.className = "deli-kartica";
      var sum = document.createElement("summary");
      sum.textContent = "Deli naprej";
      det.appendChild(sum);
      det.appendChild(narediDeliBlok(javniUrlListe(n), SHARE_TXT, true));
      card.appendChild(det);
    }
  }

  function poNapredku(spremenjeno) {
    var nove = preveriZnacke();
    osveziPas(spremenjeno);
    if (nove.length) pokaziToast(nove);
  }

  function jeNaKoncu() {
    var doc = document.documentElement;
    var telo = document.body;
    var visina = Math.max(doc.scrollHeight, telo ? telo.scrollHeight : 0);
    return (window.innerHeight + window.scrollY) >= (visina - 220);
  }

  function poskusiOznaciti() {
    var n = trenutnaLista();
    if (n == null) return;
    if (!jeNaKoncu()) return;
    if (oznaciPrebrano(n)) poNapredku(true);
  }

  function poslusajListo() {
    var n = trenutnaLista();
    if (n == null) return;
    var tick = function () { poskusiOznaciti(); };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    document.querySelectorAll("nav.listnav a.next, a.next").forEach(function (a) {
      a.addEventListener("click", function () {
        if (oznaciPrebrano(n)) {
          preveriZnacke();
          shrani();
        }
      });
    });
    if (document.readyState === "complete") setTimeout(tick, 50);
    else window.addEventListener("load", function () { setTimeout(tick, 50); });
    setTimeout(tick, 200);
  }

  function poslusajTemo() {
    function zadetek() {
      if (oznaciTemo()) poNapredku(true);
    }
    var wrap = document.getElementById("primerjava-wrap") || document.querySelector(".primerjava-scroll") || document.getElementById("primerjava");
    if (wrap && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (vpisi) {
        vpisi.forEach(function (v) {
          if (v.isIntersecting && v.intersectionRatio > 0.12 && window.scrollY > 48) zadetek();
        });
      }, { threshold: [0.12, 0.25] });
      io.observe(wrap);
    }
    if (wrap) {
      wrap.addEventListener("scroll", function () {
        if (wrap.scrollLeft > 8 || wrap.scrollTop > 8) zadetek();
      }, { passive: true });
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a");
      if (a) {
        var href = a.getAttribute("href") || "";
        if (/#pv-|#p-|primerjava/.test(href) || a.classList.contains("primerjaj")) zadetek();
        return;
      }
      if (wrap && wrap.contains(e.target)) zadetek();
    });
    if (location.hash && /#?(pv-|p-|primerjava)/.test(location.hash)) zadetek();
  }

  function zagon() {
    vstaviPas();
    window.addEventListener("resize", meriPas);
    vstaviAnketoPovezavo();
    vstaviDeliNaStran();
    poslusajListo();
    poslusajTemo();
    var noveObNalaganju = [];
    ZNACKE.forEach(function (z) {
      if (stanje.znacke.indexOf(z.id) !== -1 && zacetniZnacki.indexOf(z.id) === -1) noveObNalaganju.push(z);
    });
    osveziPas(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", zagon);
  } else {
    zagon();
  }
})();
