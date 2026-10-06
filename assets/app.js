// Catalogue 100 % fictif : noms, effets et prix inventés pour un projet de formation.
const PRODUCTS = [
  { id: "ptl-derm", name: "Peptalis Derma", cat: "Dermatologie", icon: "🧴", price: 89, rx: true,
    short: "Peptide fictif imaginé pour accompagner la cicatrisation cutanée.",
    long: "Produit imaginaire créé pour le projet. Il illustre un futur médicament à base de peptides qui aurait obtenu une autorisation de mise sur le marché (AMM). Aucune donnée clinique réelle." },
  { id: "ptl-meta", name: "Peptalis Meta", cat: "Métabolisme", icon: "⚖️", price: 149, rx: true,
    short: "Peptide fictif à visée métabolique, suivi médical obligatoire.",
    long: "Produit imaginaire. Il représente la famille des traitements métaboliques à base de peptides, un marché déjà réel aujourd'hui sur ordonnance. Aucune donnée clinique réelle." },
  { id: "ptl-joint", name: "Peptalis Articula", cat: "Articulations", icon: "🦴", price: 119, rx: true,
    short: "Peptide fictif imaginé pour le confort articulaire.",
    long: "Produit imaginaire servant à tester l'offre « récupération » de la boutique. Aucune donnée clinique réelle." },
  { id: "ptl-kit", name: "Kit de suivi Peptalis", cat: "Accessoires", icon: "📋", price: 24, rx: false,
    short: "Carnet de suivi et conseils d'utilisation (non médicamenteux).",
    long: "Accessoire fictif sans principe actif : carnet de suivi, guide patient, rappel de rendez-vous avec le médecin." },
  { id: "ptl-cons", name: "Téléconsultation pharmacien", cat: "Services", icon: "💬", price: 0, rx: false,
    short: "Échange gratuit avec un pharmacien partenaire (service fictif).",
    long: "Service imaginaire : un pharmacien répond aux questions avant toute commande." }
];

const fmt = n => n === 0 ? "Gratuit" : n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function getCart() { try { return JSON.parse(localStorage.getItem("peptalis-cart")) || {}; } catch { return {}; } }
function setCart(c) { try { localStorage.setItem("peptalis-cart", JSON.stringify(c)); } catch {} updateBadge(); }
function addToCart(id) { const c = getCart(); c[id] = (c[id] || 0) + 1; setCart(c); alert("Ajouté au panier (démo)"); }
function updateBadge() {
  const n = Object.values(getCart()).reduce((a, b) => a + b, 0);
  document.querySelectorAll(".cart-badge").forEach(b => b.textContent = n);
}

function card(p) {
  return `<article class="card">
    <div class="thumb">${p.icon}</div>
    <span class="tag ${p.rx ? "rx" : ""}">${p.rx ? "Sur ordonnance" : p.cat}</span>
    <h3>${p.name}</h3>
    <p class="muted">${p.short}</p>
    <div class="price">${fmt(p.price)}</div>
    <a class="btn ghost" href="produit.html?id=${p.id}">Voir le produit</a>
  </article>`;
}

function renderGrid(el, list) { el.innerHTML = list.map(card).join(""); }

function initCatalogue() {
  const grid = document.getElementById("catalogue");
  if (!grid) return;
  const cats = ["Tous", ...new Set(PRODUCTS.map(p => p.cat))];
  const bar = document.getElementById("filters");
  bar.innerHTML = cats.map((c, i) => `<button class="${i ? "" : "on"}" data-cat="${c}">${c}</button>`).join("");
  bar.addEventListener("click", e => {
    const c = e.target.dataset.cat; if (!c) return;
    bar.querySelectorAll("button").forEach(b => b.classList.toggle("on", b === e.target));
    renderGrid(grid, c === "Tous" ? PRODUCTS : PRODUCTS.filter(p => p.cat === c));
  });
  renderGrid(grid, PRODUCTS);
}

function initHome() {
  const el = document.getElementById("featured");
  if (el) renderGrid(el, PRODUCTS.slice(0, 3));
}

function initProduct() {
  const el = document.getElementById("product");
  if (!el) return;
  const p = PRODUCTS.find(x => x.id === new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
  document.title = `${p.name} · Peptalis`;
  el.innerHTML = `<div class="thumb">${p.icon}</div>
    <div>
      <span class="tag ${p.rx ? "rx" : ""}">${p.rx ? "Médicament sur ordonnance (fictif)" : p.cat}</span>
      <h1>${p.name}</h1>
      <p>${p.long}</p>
      <p class="price">${fmt(p.price)}</p>
      ${p.rx ? `<div class="alert"><strong>Ordonnance obligatoire.</strong> Dans ce scénario futur, la commande n'est validée qu'après vérification de l'ordonnance par un pharmacien. Aujourd'hui en France, un médicament sur ordonnance ne peut pas être vendu en ligne (voir <a href="legal.html">Cadre légal</a>).</div>` : ""}
      <p><button class="btn" onclick="addToCart('${p.id}')">Ajouter au panier</button></p>
    </div>`;
}

function initCart() {
  const el = document.getElementById("cart");
  if (!el) return;
  const c = getCart();
  const lines = Object.entries(c).map(([id, q]) => ({ p: PRODUCTS.find(x => x.id === id), q })).filter(l => l.p);
  if (!lines.length) { el.innerHTML = `<p class="box">Ton panier est vide. <a href="catalogue.html">Voir le catalogue</a></p>`; return; }
  const total = lines.reduce((s, l) => s + l.p.price * l.q, 0);
  const needRx = lines.some(l => l.p.rx);
  el.innerHTML = `<table>
      <tr><th>Produit</th><th>Qté</th><th>Prix</th><th></th></tr>
      ${lines.map(l => `<tr><td>${l.p.name}${l.p.rx ? ' <span class="tag rx">Rx</span>' : ""}</td><td>${l.q}</td><td>${fmt(l.p.price * l.q)}</td>
        <td><button class="btn ghost" onclick="removeItem('${l.p.id}')">Retirer</button></td></tr>`).join("")}
      <tr><th colspan="2">Total</th><th colspan="2">${fmt(total)}</th></tr>
    </table>
    ${needRx ? `<div class="box" style="margin-top:1rem">
      <h3>Étape ordonnance</h3>
      <p class="muted">Ton panier contient un produit sur ordonnance. Dépose ton ordonnance (démo : aucun fichier n'est envoyé).</p>
      <input type="file" id="rx" accept=".pdf,.jpg,.png">
    </div>` : ""}
    <p style="margin-top:1rem"><button class="btn" id="pay" ${needRx ? "disabled" : ""}>Valider la commande (démo)</button></p>`;
  const rx = document.getElementById("rx"), pay = document.getElementById("pay");
  if (rx) rx.addEventListener("change", () => pay.disabled = !rx.files.length);
  pay.addEventListener("click", () => {
    alert("Démo terminée : aucune commande réelle n'est passée. Dans le scénario, un pharmacien vérifierait l'ordonnance avant expédition.");
    setCart({}); initCart();
  });
}
function removeItem(id) { const c = getCart(); delete c[id]; setCart(c); initCart(); }

document.addEventListener("DOMContentLoaded", () => { updateBadge(); initHome(); initCatalogue(); initProduct(); initCart(); });
