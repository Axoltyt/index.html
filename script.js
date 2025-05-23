// Przykładowe przestępstwa (zwykłe i federalne)
const zwyklePrzestepstwa = [
  { id: "kradziez", nazwa: "Kradzież", grzywna: 1000, wiezienie: 3 },
  { id: "napad", nazwa: "Napad", grzywna: 5000, wiezienie: 12 },
  { id: "posiadanie_narkotykow", nazwa: "Posiadanie narkotyków", grzywna: 2000, wiezienie: 6 },
  { id: "zniewaga", nazwa: "Zniewaga funkcjonariusza", grzywna: 1500, wiezienie: 2 },
  { id: "korupcja", nazwa: "Korupcja", grzywna: 10000, wiezienie: 24 },
  { id: "zdrada_stanu", nazwa: "Zdrada stanu", grzywna: 50000, wiezienie: 120 },
  { id: "nielegalne_posiadanie_broni", nazwa: "Nielegalne posiadanie broni", grzywna: 8000, wiezienie: 18 }
];

const federalnePrzestepstwa = [
  { id: "terrorystyczne_akty", nazwa: "Akty terrorystyczne", grzywna: 100000, wiezienie: 240 },
  { id: "pranie_pieniedzy", nazwa: "Pranie pieniędzy", grzywna: 20000, wiezienie: 36 },
  { id: "handel_narkotykami", nazwa: "Handel narkotykami", grzywna: 30000, wiezienie: 48 },
  { id: "fałszerstwo", nazwa: "Fałszerstwo dokumentów", grzywna: 15000, wiezienie: 24 },
  { id: "szpiegostwo", nazwa: "Szpiegostwo", grzywna: 50000, wiezienie: 60 }
];

let wybraneZarzuty = [];

// Funkcja generująca listę przestępstw jako checkboxy
function wypelnijTaryfikator() {
  const zwykleDiv = document.getElementById("zwykle");
  const federalneDiv = document.getElementById("federalne");

  zwykleDiv.innerHTML = "";
  federalneDiv.innerHTML = "";

  zwyklePrzestepstwa.forEach((z) => {
    const el = document.createElement("div");
    el.className = "zarzut-item";
    el.innerHTML = `
      <label>
        <input type="checkbox" value="${z.id}" />
        <strong>${z.nazwa}</strong><br />
        Grzywna: $${z.grzywna} | Więzienie: ${z.wiezienie} miesięcy
      </label>
    `;
    zwykleDiv.appendChild(el);
  });

  federalnePrzestepstwa.forEach((z) => {
    const el = document.createElement("div");
    el.className = "zarzut-item";
    el.innerHTML = `
      <label>
        <input type="checkbox" value="${z.id}" />
        <strong>${z.nazwa}</strong><br />
        Grzywna: $${z.grzywna} | Więzienie: ${z.wiezienie} miesięcy
      </label>
    `;
    federalneDiv.appendChild(el);
  });
}

// Znajdź zarzut po id
function znajdzZarzut(id) {
  return (
    zwyklePrzestepstwa.find((z) => z.id === id) ||
    federalnePrzestepstwa.find((z) => z.id === id)
  );
}

// Pokaż wybrane zarzuty w alert (można zmienić na inne UI)
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

// Wyczyść wszystkie zaznaczone checkboxy
function wyczyscZarzuty() {
  const checkboxes = document.querySelectorAll(
    "#zwykle input[type=checkbox], #federalne input[type=checkbox]"
  );
  checkboxes.forEach((cb) => {
    cb.checked = false;
  });
  wybraneZarzuty = [];
  document.getElementById("wynik").textContent = "";
  wyczyscFormularz();
}

// Wyczyść formularz raportu
function wyczyscFormularz() {
  document.getElementById("formularz-raportu").reset();
  document.getElementById("wynik").textContent = "";
}

// Generowanie pliku raportu zatrzymania
function generujPlik() {
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
    alert("Wybierz co najmniej jeden zarzut!");
    return;
  }

  const zatrzymujacy = document.getElementById("zatrzymujacy").value.trim();
  const podpisZatrzymujacego = document
    .getElementById("podpisZatrzymujacego")
    .value.trim();
  const zatrzymany = document.getElementById("zatrzymany").value.trim();
  const data = document.getElementById("dataZatrzymania").value;
  const miejsce = document.getElementById("miejsceZatrzymania").value.trim();
  const opis = document.getElementById("opisZatrzymania").value.trim();
  const uwagi = document.getElementById("uwagi").value.trim();

  if (
    !zatrzymujacy ||
    !podpisZatrzymujacego ||
    !zatrzymany ||
    !data ||
    !miejsce ||
    !opis
  ) {
    alert("Wypełnij wszystkie pola oznaczone jako wymagane.");
    return;
  }

  let tresc = `=== RAPORT ZATRZYMANIA ===\n\n`;
  tresc += `Data: ${data}\n`;
  tresc += `Miejsce zatrzymania: ${miejsce}\n\n`;

  tresc += `Zatrzymujący:\n  Imię i nazwisko: ${zatrzymujacy}\n  Podpis: ${podpisZatrzymujacego}\n\n`;

  tresc += `Zatrzymany:\n  Imię i nazwisko: ${zatrzymany}\n\n`;

  tresc += `Opis zatrzymania:\n${opis}\n\n`;

  tresc += `Zarzuty:\n`;
  wybraneZarzuty.forEach((z, i) => {
    tresc += `  ${i + 1}. ${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} miesięcy\n`;
  });

  if (uwagi) {
    tresc += `\nDodatkowe uwagi:\n${uwagi}\n`;
  }

  tresc += `\n--- Koniec raportu ---\n`;

  document.getElementById("wynik").textContent = tresc;

  // Pobierz plik txt z raportem
  const blob = new Blob([tresc], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Raport_zatrzymania_${zatrzymany}_${data}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Inicjalizacja po załadowaniu strony
window.onload = () => {
  wypelnijTaryfikator();
};
