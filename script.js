let charges = [];
let selected = [];

async function loadCharges() {
  const res = await fetch("data/charges.json");
  const data = await res.json();
  charges = data;
  renderCharges();
}

function renderCharges() {
  const zwykle = document.getElementById("zwykle");
  const federalne = document.getElementById("federalne");

  zwykle.innerHTML = "";
  federalne.innerHTML = "";

  charges.zwykle.forEach((item, index) => {
    zwykle.innerHTML += `
      <label><input type="checkbox" value="z-${index}">${item.nazwa}</label>`;
  });

  charges.federalne.forEach((item, index) => {
    federalne.innerHTML += `
      <label><input type="checkbox" value="f-${index}">${item.nazwa}</label>`;
  });
}

function pokazZarzuty() {
  const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  let grzywna = 0;
  let wiezienie = 0;
  let zarzuty = [];

  checkboxes.forEach((cb) => {
    const [type, index] = cb.value.split("-");
    const item = charges[type === "z" ? "zwykle" : "federalne"][index];
    zarzuty.push(item.nazwa);
    grzywna += item.grzywna;
    wiezienie += item.wiezienie;
  });

  document.getElementById("wynik").innerHTML = `
    <h3>Zarzuty:</h3>
    <ul>${zarzuty.map(z => `<li>${z}</li>`).join("")}</ul>
    <p><strong>Łączna grzywna:</strong> $${grzywna}</p>
    <p><strong>Łączne miesiące więzienia:</strong> ${wiezienie}</p>
  `;
}

function wyczyscZarzuty() {
  document.querySelectorAll("input[type='checkbox']").forEach(cb => cb.checked = false);
  document.getElementById("wynik").innerHTML = "";
}

loadCharges();
