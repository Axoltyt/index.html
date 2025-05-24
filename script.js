// Dane taryfikatora - przykładowe przestępstwa (możesz rozbudować)
const zarzutyZwykle = [
  { nazwa: "Kradzież", grzywna: 1500, wiezienie: 3 },
  { nazwa: "Pobicie", grzywna: 3000, wiezienie: 6 },
  { nazwa: "Posiadanie narkotyków", grzywna: 2000, wiezienie: 4 },
  { nazwa: "Zniszczenie mienia", grzywna: 2500, wiezienie: 5 },
  { nazwa: "Podszywanie sie pod frakcje", grzywna: 12000, wiezienie: 36 }
  // dodaj więcej...
];

const zarzutyFederalne = [
  { nazwa: "Przemyt broni", grzywna: 15000, wiezienie: 48 },
  { nazwa: "Terroryzm", grzywna: 50000, wiezienie: 120 },
  { nazwa: "Pranie brudnych pieniędzy", grzywna: 30000, wiezienie: 60 },
  { nazwa: "Szpiegostwo", grzywna: 40000, wiezienie: 100 },
  { nazwa: "Obraza Funkcjonariusza Federalnego", grzywna: 0, wiezienie: Kara Smierći },
  { nazwa: "Zdrada stanu", grzywna: 12000, wiezienie: 36 },
  { nazwa: "Korupcja", grzywna: 8000, wiezienie: 24 }
  // dodaj więcej...
];

let wybraneZarzuty = [];

function wypelnijTaryfikator() {
  const divZwykle = document.getElementById("zwykle");
  const divFederalne = document.getElementById("federalne");

  zarzutyZwykle.forEach((z, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${z.nazwa}" /> ${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} mies.`;
    divZwykle.appendChild(label);
  });

  zarzutyFederalne.forEach((z, i) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${z.nazwa}" /> ${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} mies.`;
    divFederalne.appendChild(label);
  });
}

function znajdzZarzut(nazwa) {
  return (
    zarzutyZwykle.find((z) => z.nazwa === nazwa) ||
    zarzutyFederalne.find((z) => z.nazwa === nazwa)
  );
}

function pokazZarzuty() {
  wybraneZarzuty = [];
  const checkboxes = document.querySelectorAll(
    "#zwykle input[type=checkbox], #federalne input[type=checkbox]"
  );
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      const zarzut = znajdzZarzut(cb.value);
      if (zarzut) wybraneZarzuty.push(zarzut);
    }
  });

  if (wybraneZarzuty.length === 0) {
    alert("Nie wybrano żadnych zarzutów.");
    return;
  }

  let tekst = "Wybrane zarzuty:\n\n";
  wybraneZarzuty.forEach((z, i) => {
    tekst += `${i + 1}. ${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} miesięcy\n`;
  });
  alert(tekst);
}

function wyczyscZarzuty() {
  const checkboxes = document.querySelectorAll(
    "#zwykle input[type=checkbox], #federalne input[type=checkbox]"
  );
  checkboxes.forEach((cb) => (cb.checked = false));
  wybraneZarzuty = [];
  document.getElementById("wynik").innerHTML = "";
  wyczyscFormularz();
}

// Generowanie raportu zatrzymania i linku do udostępnienia

function generujPlik() {
  if (wybraneZarzuty.length === 0) {
    alert("Najpierw wybierz przynajmniej jeden zarzut z taryfikatora!");
    return;
  }

  const zatrzymujacy = document.getElementById("zatrzymujacy").value.trim();
  const podpisZatrzymujacego = document.getElementById("podpisZatrzymujacego").value.trim();
  const zatrzymany = document.getElementById("zatrzymany").value.trim();
  const dataZatrzymania = document.getElementById("dataZatrzymania").value;
  const miejsceZatrzymania = document.getElementById("miejsceZatrzymania").value.trim();
  const opisZatrzymania = document.getElementById("opisZatrzymania").value.trim();
  const uwagi = document.getElementById("uwagi").value.trim();

  if (!zatrzymujacy || !podpisZatrzymujacego || !zatrzymany || !dataZatrzymania || !miejsceZatrzymania || !opisZatrzymania) {
    alert("Proszę wypełnić wszystkie wymagane pola.");
    return;
  }

  let tresc = "";
  tresc += "==== RAPORT ZATRZYMANIA ====\n\n";
  tresc += `Zatrzymujący: ${zatrzymujacy}\n`;
  tresc += `Podpis zatrzymującego: ${podpisZatrzymujacego}\n`;
  tresc += `Zatrzymany: ${zatrzymany}\n`;
  tresc += `Data zatrzymania: ${dataZatrzymania}\n`;
  tresc += `Miejsce zatrzymania: ${miejsceZatrzymania}\n\n`;
  tresc += `Opis zatrzymania:\n${opisZatrzymania}\n\n`;

  tresc += "Zarzuty:\n";
  wybraneZarzuty.forEach((z, i) => {
    tresc += `  ${i + 1}. ${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} miesięcy\n`;
  });

  if (uwagi) {
    tresc += `\nDodatkowe uwagi:\n${uwagi}\n`;
  }

  tresc += "\n===========================\n";

  // Kodowanie do URL
  const encoded = encodeURIComponent(tresc);
  const dataUrl = `data:text/plain;charset=utf-8,${encoded}`;

  const wynik = document.getElementById("wynik");

  const linkHTML = `
    <p><strong>Link do raportu (kliknij, by otworzyć):</strong></p>
    <input type="text" value="${dataUrl}" id="linkRaportu" readonly style="width:100%; padding:5px; font-family: monospace;" />
    <button onclick="skopiujLink()">Skopiuj link</button><br><br>
    <a href="${dataUrl}" target="_blank" style="color:#4af;">➡️ Otwórz raport w nowej karcie</a>
  `;

  wynik.innerHTML = `
    <div class="raport-z-tlem">
      <pre>${tresc}</pre>
    </div>
    ${linkHTML}
  `;
}

function skopiujLink() {
  const input = document.getElementById("linkRaportu");
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value).then(() => {
    alert("Link został skopiowany!");
  });
}

function wyczyscFormularz() {
  document.getElementById("formularz-raportu").reset();
  document.getElementById("wynik").innerHTML = "";
  wyczyscZarzuty();
}

window.onload = () => {
  wypelnijTaryfikator();
};
