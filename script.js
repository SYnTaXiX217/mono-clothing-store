const BRAND = "Моно";
const FREE_FROM = 15000;
const C = { fog:["Туман","#b3bab5"], moss:["Мох","#55644f"], coal:["Уголь","#2b2e2f"], sand:["Песок","#c8b697"], clay:["Глина","#8d6a5b"], ink:["Чернила","#2f3d55"], white:["Молочный","#ece8de"] };
const col = ks => ks.map(k => ({ n:C[k][0], c:C[k][1] }));
const CLOTH = ["XS","S","M","L","XL"];

const products = [
  { id:1, name:"Пальто «Дымка»", cat:"Верхняя одежда", type:"coat", price:38900, colors:col(["fog","moss","coal","sand"]), sizes:CLOTH, badge:"Хит", desc:"Прямой силуэт из плотной шерсти. Скрытые пуговицы, два глубоких кармана, подкладка из вискозы." },
  { id:2, name:"Куртка «Холод»", cat:"Верхняя одежда", type:"jacket", price:24500, colors:col(["coal","moss","sand"]), sizes:CLOTH, desc:"Лёгкая куртка с капюшоном и водоотталкивающей пропиткой. Подходит на межсезонье." },
  { id:3, name:"Свитер «Мох»", cat:"Трикотаж", type:"knit", price:12400, colors:col(["moss","fog","clay","ink"]), sizes:CLOTH, badge:"Новинка", desc:"Мериносовая шерсть, плотная вязка. Не колется и не скатывается." },
  { id:4, name:"Лонгслив «Ровный»", cat:"Трикотаж", type:"knit", price:5900, colors:col(["white","coal","fog"]), sizes:CLOTH, desc:"Хлопок высокой плотности. Хорошо держит форму после стирки." },
  { id:5, name:"Рубашка «Лён»", cat:"Рубашки", type:"shirt", price:8900, colors:col(["sand","white","ink"]), sizes:CLOTH, desc:"Свободный крой из 100% льна. С каждой стиркой становится мягче." },
  { id:6, name:"Брюки «Шов»", cat:"Брюки", type:"pants", price:14200, colors:col(["coal","fog","ink"]), sizes:["28","30","32","34","36"], desc:"Шерстяной габардин, высокая посадка, стрелки. Идут и к рубашке, и к свитеру." },
  { id:7, name:"Брюки «Прямые»", cat:"Брюки", type:"pants", price:9800, colors:col(["sand","moss","clay"]), sizes:["28","30","32","34","36"], desc:"Плотный хлопок, прямой крой на каждый день." },
  { id:8, name:"Шарф «Тишина»", cat:"Аксессуары", type:"scarf", price:9600, colors:col(["fog","clay","coal"]), sizes:["Один размер"], desc:"Кашемир, 200 × 40 см. Тёплый и очень лёгкий." },
];

// Силуэты одежды
function shape(type, c) {
  const s = `fill="${c}" stroke="rgba(0,0,0,.32)" stroke-width="1.3" stroke-linejoin="round"`;
  const d = `fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1.2" stroke-linecap="round"`;
  const g = {
    coat: `<path ${s} d="M72 24 L44 38 L16 172 L40 180 L58 112 L58 252 L142 252 L142 112 L160 180 L184 172 L156 38 L128 24 L100 74Z"/><path ${d} d="M100 74 L100 252 M72 24 L88 96 M128 24 L112 96 M62 150 L62 170 M138 150 L138 170"/>`,
    jacket: `<path ${s} d="M70 34 L44 46 L14 170 L40 178 L58 112 L58 236 L142 236 L142 112 L160 178 L186 170 L156 46 L130 34Z"/><ellipse ${s} cx="100" cy="30" rx="30" ry="18"/><path ${d} d="M100 48 L100 236 M58 214 L142 214"/>`,
    knit: `<path ${s} d="M72 30 L48 40 L14 160 L40 168 L58 104 L58 232 L142 232 L142 104 L160 168 L186 160 L152 40 L128 30 Q100 54 72 30Z"/><path ${d} d="M58 216 L142 216 M72 30 Q100 54 128 30"/>`,
    shirt: `<path ${s} d="M72 30 L46 42 L14 150 L40 158 L58 104 L58 236 L142 236 L142 104 L160 158 L186 150 L154 42 L128 30 L100 52Z"/><path ${d} d="M72 30 L88 56 L100 52 L112 56 L128 30 M100 52 L100 236 M96 90 L96 92 M96 130 L96 132 M96 170 L96 172"/>`,
    pants: `<path ${s} d="M60 20 L140 20 L150 248 L108 248 L100 96 L92 248 L50 248Z"/><path ${d} d="M60 34 L140 34 M100 34 L100 96"/>`,
    scarf: `<path ${s} d="M70 26 Q100 10 130 26 L130 62 Q100 80 70 62Z"/><path ${s} d="M82 66 L66 238 L104 246 L112 74Z"/><path ${s} d="M112 74 L122 224 L150 214 L130 62Z"/><path ${d} d="M76 150 L100 154 M74 190 L98 194"/>`,
  };
  return `<svg viewBox="0 0 200 270" role="img" aria-hidden="true">${g[type]}</svg>`;
}

const $ = id => document.getElementById(id);
const rub = n => n.toLocaleString("ru-RU") + " ₽";
const veil = $("veil"), modal = $("modal"), drawer = $("drawer");

// ===== Каталог =====
let filter = "Все";
const cats = ["Все", ...new Set(products.map(p => p.cat))];
$("tabs").innerHTML = cats.map(c => `<button type="button" aria-pressed="${c === filter}">${c}</button>`).join("");
$("tabs").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  filter = b.textContent;
  [...$("tabs").children].forEach(x => x.setAttribute("aria-pressed", x === b));
  renderGrid();
});
function renderGrid() {
  const list = products.filter(p => filter === "Все" || p.cat === filter);
  $("grid").innerHTML = list.map((p, i) => `
    <article class="card" tabindex="0" data-id="${p.id}" style="animation-delay:${i * 60}ms" aria-label="${p.name}, ${rub(p.price)}">
      <div class="ph">${p.badge ? `<span class="badge">${p.badge}</span>` : ""}${shape(p.type, p.colors[0].c)}<span class="quick">Быстрый просмотр</span></div>
      <div class="meta"><h3>${p.name}</h3><span>${rub(p.price)}</span></div>
      <div class="sub">${p.colors.map(c => `<i class="dot" style="--c:${c.c}"></i>`).join("")}<span>${p.cat}</span></div>
    </article>`).join("");
}
$("grid").addEventListener("click", e => { const c = e.target.closest(".card"); if (c) openModal(+c.dataset.id); });
$("grid").addEventListener("keydown", e => { if (e.key === "Enter") { const c = e.target.closest(".card"); if (c) openModal(+c.dataset.id); } });
$("heroArt").addEventListener("click", () => openModal(1));
renderGrid();

// ===== Окно товара =====
let cur = null;
function openModal(id) {
  const p = products.find(x => x.id === id);
  cur = { p, color: p.colors[0], size: null };
  drawModal();
  veil.classList.add("on"); modal.classList.add("on"); document.body.classList.add("lock");
  modal.querySelector(".x").focus();
}
function drawModal() {
  const { p, color, size } = cur;
  modal.innerHTML = `
    <button class="x" type="button" aria-label="Закрыть">×</button>
    <div class="ph">${shape(p.type, color.c)}</div>
    <div class="pane">
      <h2>${p.name}</h2><div class="pr">${rub(p.price)}</div><p>${p.desc}</p>
      <div class="lbl"><span>Цвет: ${color.n}</span></div>
      <div class="opts">${p.colors.map(c => `<button type="button" class="cl" style="--c:${c.c}" data-c="${c.n}" aria-label="${c.n}" aria-pressed="${c.n === color.n}"></button>`).join("")}</div>
      <div class="lbl"><span>Размер</span></div>
      <div class="opts">${p.sizes.map(s => `<button type="button" class="sz" data-s="${s}" aria-pressed="${s === size}">${s}</button>`).join("")}</div>
      <p class="msg" id="pmsg" role="status"></p>
      <button class="btn" type="button" id="addBtn">Добавить в корзину</button>
    </div>`;
}
modal.addEventListener("click", e => {
  if (e.target.closest(".x")) return closeAll();
  const c = e.target.closest(".cl"), s = e.target.closest(".sz");
  if (c) { cur.color = cur.p.colors.find(x => x.n === c.dataset.c); drawModal(); }
  if (s) { cur.size = s.dataset.s; drawModal(); }
  if (e.target.id === "addBtn") {
    if (!cur.size) { $("pmsg").textContent = "Выберите размер."; return; }
    addToCart(cur.p.id, cur.color.n, cur.size);
    closeAll(); openDrawer();
  }
});

// ===== Корзина =====
let cart = [];
try { cart = JSON.parse(localStorage.getItem("mono-cart") || "[]"); } catch (e) {}
const save = () => { try { localStorage.setItem("mono-cart", JSON.stringify(cart)); } catch (e) {} };
function addToCart(id, color, size) {
  const f = cart.find(i => i.id === id && i.color === color && i.size === size);
  f ? f.qty++ : cart.push({ id, color, size, qty: 1 });
  save(); renderCart();
}
function renderCart() {
  const items = cart.map(i => ({ ...i, p: products.find(p => p.id === i.id) }));
  const total = items.reduce((s, i) => s + i.p.price * i.qty, 0);
  $("count").textContent = items.reduce((s, i) => s + i.qty, 0);
  $("total").textContent = rub(total);
  $("bar").style.width = Math.min(100, total / FREE_FROM * 100) + "%";
  $("free").firstChild.textContent = total >= FREE_FROM ? "Доставка бесплатная." : `До бесплатной доставки: ${rub(FREE_FROM - total)}`;
  $("checkout").disabled = !items.length;
  $("list").innerHTML = items.length ? items.map((i, n) => `
    <li class="li"><div class="ph">${shape(i.p.type, i.p.colors.find(c => c.n === i.color).c)}</div>
      <div><h3>${i.p.name}</h3><small>${i.color}, ${i.size}</small><small>${rub(i.p.price)}</small>
        <div class="qty"><button type="button" data-a="-" data-n="${n}" aria-label="Меньше">−</button><span>${i.qty}</span><button type="button" data-a="+" data-n="${n}" aria-label="Больше">+</button></div></div>
      <button class="rm" type="button" data-a="x" data-n="${n}">Убрать</button></li>`).join("")
    : `<li class="empty">В корзине пока пусто. Выберите вещь в каталоге.</li>`;
}
$("list").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const n = +b.dataset.n, a = b.dataset.a;
  if (a === "+") cart[n].qty++;
  if (a === "-") cart[n].qty--;
  if (a === "x" || cart[n].qty <= 0) cart.splice(n, 1);
  save(); renderCart();
});
$("checkout").addEventListener("click", () => {
  cart = []; save(); renderCart();
  $("free").firstChild.textContent = "Заказ принят. Это демо-сайт, оплаты нет.";
});

// ===== Панели =====
function openDrawer() { veil.classList.add("on"); drawer.classList.add("on"); document.body.classList.add("lock"); }
function closeAll() { veil.classList.remove("on"); modal.classList.remove("on"); drawer.classList.remove("on"); document.body.classList.remove("lock"); }
$("cartBtn").addEventListener("click", openDrawer);
$("closeCart").addEventListener("click", closeAll);
veil.addEventListener("click", closeAll);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
renderCart();

// ===== Подписка =====
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("email").value.trim(), m = $("formMsg");
  if (!/^\S+@\S+\.\S+$/.test(v)) { m.textContent = "Введите почту в формате name@mail.ru."; return; }
  m.textContent = "Готово. Расскажем о новой коллекции первыми."; e.target.reset();
});
