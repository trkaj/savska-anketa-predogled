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
