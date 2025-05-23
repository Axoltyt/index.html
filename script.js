const users = {
  fib: "avenuefib",
  fibhc: "fibavenue1432",
};

let taryfikator = {
  zwykle: [
    { nazwa: "Kradzież", grzywna: 500, wiezienie: 3 },
    { nazwa: "Pobicie", grzywna: 700, wiezienie: 6 },
    { nazwa: "Posiadanie narkotyków", grzywna: 1500, wiezienie: 12 },
    { nazwa: "Korupcja", grzywna: 5000, wiezienie: 18 },
    { nazwa: "Zdrada stanu", grzywna: 10000, wiezienie: 60 },
  ],
  federalne: [
    { nazwa: "Przemyt broni", grzywna: 10000, wiezienie: 48 },
    { nazwa: "Terrorystyczne zagrożenie", grzywna: 20000, wiezienie: 120 },
    { nazwa: "Pranie brudnych pieniędzy", grzywna: 15000, wiezienie: 72 },
    { nazwa: "Szpiegostwo", grzywna: 25000, wiezienie: 96 },
  ],
};

let wybraneZarzuty = [];
let rola = null;

function zaloguj() {
  const login = document.getElementById("login").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (login === "fib" && pass === users.fib) {
    rola = "user";
  } else if (login === "fibhc" && pass === users.fibhc) {
    rola = "admin";
  } else {
    document.getElementById("login-error").textContent = "Nieprawidłowy login lub hasło.";
    return;
  }
  localStorage.setItem("rola", rola);
  pokazAplikacje(rola);
}

function pokazAplikacje(rola) {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "block";

  if (rola === "admin") {
    document.querySelector("button[data-tab='admin']").style.display = "inline-block";
    pokazAdminZarzuty();
  }
  pokazTaryfikator();
  ustawZakladki();
}

function ustawZakladki() {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll(".tab-content").forEach((el) => (el.style.display = "none"));
      document.querySelectorAll(".tab-btn").forEach((el) => el.classList.remove("active"));

      const tab = btn.getAttribute("data-tab");
      document.getElementById(tab).style.display = "block";
      btn.classList.add("active");

      if (tab === "taryfikator") {
        pokazTaryfikator();
      } else if (tab === "raporty") {
        pokazRaporty();
      } else if (tab === "admin") {
        pokazAdminZarzuty();
      }
    };
  });
  // Ustaw domyślnie taryfikator
  document.querySelector(".tab-btn[data-tab='taryfikator']").click();
}

function pokazTaryfikator() {
  const zwykleDiv = document.getElementById("zwykle");
  const federalneDiv = document.getElementById("federalne");
  zwykleDiv.innerHTML = "";
  federalneDiv.innerHTML = "";

  taryfikator.zwykle.forEach((z) => {
    zwykleDiv.appendChild(createChargeCheckbox(z));
  });
  taryfikator.federalne.forEach((z) => {
    federalneDiv.appendChild(createChargeCheckbox(z));
  });
}

function createChargeCheckbox(zarzut) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = zarzut.nazwa;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(` ${zarzut.nazwa}`));
  return label;
}

function pokazZarzuty() {
  wybraneZarzuty = [];
  const checkboxes = document.querySelectorAll("#zwykle input[type=checkbox], #federalne input[type=checkbox]");
  checkboxes.forEach((cb) => {
    if (cb.checked) {
      const zarzut = znajdzZarzut(cb.value);
      if (zarzut) wybraneZarzuty.push(zarzut);
    }
  });
  if (wybraneZarzuty.length === 0) {
    alert("Nie wybrano żadnych zarzutów!");
    return;
  }
  let wynik = "Wybrane zarzuty:\n\n";
  wybraneZarzuty.forEach((z) => {
    wynik += `${z.nazwa} — Grzywna: $${z.grzywna}, Więzienie: ${z.wiezienie} miesięcy\n`;
  });
  document.getElementById("wynik").textContent = wynik;
}

function wyczyscZarzuty() {
  wybraneZarzuty = [];
  document.getElementById("wynik").textContent = "";
  const checkboxes = document.querySelectorAll("#zwykle input[type=checkbox], #federalne input[type=checkbox]");
  checkboxes.forEach((cb) => (cb.checked = false));
}

function znajdzZarzut(nazwa) {
  return taryfikator.zwykle.find((z) => z.nazwa === nazwa) || taryfikator.federalne.find((z) => z.nazwa === nazwa);
}

function generujPlik() {
  if (wybraneZarzuty.length === 0) {
    alert("Wybierz zarzuty przed wygenerowaniem pliku.");
    return;
  }
  const zatrzymujacy = document.getElementById("zatrzymujacy").value.trim();
  const zatrzymany = document.getElementById("zatrzymany").value.trim();
  const data = document.getElementById("dataZatrzymania").value;

  if (!zatrzymujacy || !zatrzymany || !data) {
    alert("Wypełnij wszystkie pola formularza zatrzymania.");
    return;
  }

  let tresc = `Raport zatrzymania\n\n`;
  tresc += `Zatrzymujący: ${zatrzymujacy}\n`;
  tresc += `Zatrzymany: ${zatrzymany}\n`;
  tresc += `Data: ${data}\n\n`;
  tresc += `Zarzuty:\n`;
  wybraneZarzuty.forEach((z) => {
    tresc += `- ${z.nazwa}: grzywna $${z.grzywna}, więzienie ${z.wiezienie} miesięcy\n`;
  });

  // Zapisywanie raportu w localStorage (lista raportów)
  let raporty = JSON.parse(localStorage.getItem("raporty") || "[]");
  raporty.push({
    zatrzymujacy,
    zatrzymany,
    data,
    zarzuty: [...wybraneZarzuty],
    tekst: tresc,
  });
  localStorage.setItem("raporty", JSON.stringify(raporty));

  // Tworzenie i pobieranie pliku txt
  const blob = new Blob([tresc], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Raport_${zatrzymany}_${data}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  alert("Plik z raportem został wygenerowany i pobrany.");
}

function pokazRaporty() {
  const lista = document.getElementById("lista-raportow");
  lista.innerHTML = "";
  let raporty = JSON.parse(localStorage.getItem("raporty") || "[]");
  if (raporty.length === 0) {
    lista.innerHTML = "<p>Brak raportów.</p>";
    return;
  }
  raporty.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "raport-item";
    div.innerHTML = `<strong>${r.data}</strong> - Zatrzymany: ${r.zatrzymany} - Zatrzymujący: ${r.zatrzymujacy}<br/><button onclick="pobierzRaport(${i})">Pobierz</button> <button onclick="usunRaport(${i})">Usuń</button>`;
    lista.appendChild(div);
  });
}

function pobierzRaport(idx) {
  let raporty = JSON.parse(localStorage.getItem("raporty") || "[]");
  if (!raporty[idx]) return alert("Raport nie istnieje.");
  const tresc = raporty[idx].tekst;

  const blob = new Blob([tresc], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Raport_${raporty[idx].zatrzymany}_${raporty[idx].data}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function usunRaport(idx) {
  let raporty = JSON.parse(localStorage.getItem("raporty") || "[]");
  raporty.splice(idx, 1);
  localStorage.setItem("raporty", JSON.stringify(raporty));
  pokazRaporty();
}

function wyczyscRaporty() {
  if (confirm("Czy na pewno chcesz usunąć wszystkie raporty?")) {
    localStorage.removeItem("raporty");
    pokazRaporty();
  }
}

// --- Panel admina ---

function pokazAdminZarzuty() {
  const container = document.getElementById("admin-zarzuty");
  container.innerHTML = "";

  const all = [...taryfikator.zwykle, ...taryfikator.federalne];
  all.forEach((z, i) => {
    const div = document.createElement("div");
    div.className = "admin-zarzut-item";
    div.innerHTML = `
      <input type="text" data-type="nazwa" data-index="${i}" value="${z.nazwa}" />
      <input type="number" data-type="grzywna" data-index="${i}" value="${z.grzywna}" min="0" />
      <input type="number" data-type="wiezienie" data-index="${i}" value="${z.wiezienie}" min="0" />
      <button onclick="usunZarzut(${i})">Usuń</button>
    `;
    container.appendChild(div);
  });
}

function dodajZarzut() {
  const nazwa = document.getElementById("new-nazwa").value.trim();
  const grzywna = Number(document.getElementById("new-grzywna").value);
  const wiezienie = Number(document.getElementById("new-wiezienie").value);
  const kategoria = document.getElementById("new-kategoria").value;

  if (!nazwa || isNaN(grzywna) || isNaN(wiezienie)) {
    alert("Wypełnij poprawnie wszystkie pola.");
    return;
  }

  taryfikator[kategoria].push({ nazwa, grzywna, wiezienie });
  document.getElementById("new-nazwa").value = "";
  document.getElementById("new-grzywna").value = "";
  document.getElementById("new-wiezienie").value = "";
  pokazAdminZarzuty();
}

function usunZarzut(idx) {
  // idx od 0 do length-1, podzielmy na kategorie
  const zwykleLen = taryfikator.zwykle.length;
  if (idx < zwykleLen) {
    taryfikator.zwykle.splice(idx, 1);
  } else {
    taryfikator.federalne.splice(idx - zwykleLen, 1);
  }
  pokazAdminZarzuty();
}

function zapiszTaryfikator() {
  // Wczytanie danych z inputów admina
  const inputs = document.querySelectorAll("#admin-zarzuty input");
  inputs.forEach((input) => {
    const type = input.getAttribute("data-type");
    const idx = Number(input.getAttribute("data-index"));
    if (idx < taryfikator.zwykle.length) {
      taryfikator.zwykle[idx][type] = type === "nazwa" ? input.value : Number(input.value);
    } else {
      const fIdx = idx - taryfikator.zwykle.length;
      taryfikator.federalne[fIdx][type] = type === "nazwa" ? input.value : Number(input.value);
    }
  });
  alert("Taryfikator zapisany (na chwilę w pamięci aplikacji)");
  pokazTaryfikator();
}

// --- Inicjalizacja ---

window.onload = () => {
  const savedRole = localStorage.getItem("rola");
  if (savedRole === "user" || savedRole === "admin") {
    rola = savedRole;
    pokazAplikacje(rola);
  }
};

function wyloguj() {
  localStorage.removeItem("rola");
  location.reload();
};
