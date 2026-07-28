// ==============================
//  محصولات - برای اضافه کردن محصول جدید فقط یک آبجکت جدید اینجا اضافه کن
// ==============================
const products = [
  {
    id: 1,
    name: "انگشتر الماس کلاسیک",
    category: "ring",
    price: 48500000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80",
    badge: "پرفروش",
    desc: "انگشتر طلای ۱۸ عیار با نگین الماس طبیعی. طراحی کلاسیک و ظریف.",
    paymentLink: "https://zarinp.al/" // لینک درگاه پرداخت خودت رو اینجا بگذار
  },
  {
    id: 2,
    name: "گردنبند طلای ظریف",
    category: "necklace",
    price: 32000000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80",
    badge: "جدید",
    desc: "گردنبند زنجیری ظریف از طلای زرد ۱۸ عیار. مناسب استفاده روزانه.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 3,
    name: "دستبند طلای لوکس",
    category: "bracelet",
    price: 67500000,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    badge: "",
    desc: "دستبند طلای سفید و زرد با طراحی مدرن و شیک.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 4,
    name: "گوشواره میخی الماس",
    category: "earring",
    price: 28900000,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80",
    badge: "",
    desc: "گوشواره میخی با نگین الماس. سبک و مناسب استفاده روزانه.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 5,
    name: "انگشتر یاقوت سرخ",
    category: "ring",
    price: 52000000,
    image: "https://images.unsplash.com/photo-1603561596112-0a132b757044?w=500&q=80",
    badge: "ویژه",
    desc: "انگشتر طلای زرد با نگین یاقوت سرخ طبیعی و الماس‌های کناری.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 6,
    name: "گردنبند مروارید",
    category: "necklace",
    price: 41000000,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80",
    badge: "",
    desc: "گردنبند مروارید اصل با قفل طلای ۱۸ عیار.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 7,
    name: "دستبند تنیس الماس",
    category: "bracelet",
    price: 89000000,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=80",
    badge: "لوکس",
    desc: "دستبند تنیس با ردیف الماس‌های برلیان. درخشش فوق‌العاده.",
    paymentLink: "https://zarinp.al/"
  },
  {
    id: 8,
    name: "گوشواره آویز طلا",
    category: "earring",
    price: 24500000,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500&q=80",
    badge: "جدید",
    desc: "گوشواره آویز ظریف از طلای زرد ۱۸ عیار.",
    paymentLink: "https://zarinp.al/"
  }
];

// ==============================
//  سبد خرید و منطق سایت
// ==============================
let cart = [];

function formatPrice(num) {
  return num.toLocaleString("fa-IR") + " تومان";
}

function getCategoryName(cat) {
  const map = { ring: "انگشتر", necklace: "گردنبند", bracelet: "دستبند", earring: "گوشواره" };
  return map[cat] || cat;
}

function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="category">${getCategoryName(p.category)}</div>
        <div class="product-bottom">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => openModal(parseInt(card.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-cart">سبد خرید شما خالی است</p>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${item.image}" alt=""></div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${formatPrice(item.price)} × ${item.qty}</span>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
      </div>
    `).join("");
  }

  totalEl.textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById("productModal");
  document.getElementById("modalBody").innerHTML = `
    <div class="modal-image"><img src="${p.image}" alt="${p.name}"></div>
    <h2>${p.name}</h2>
    <div class="modal-price">${formatPrice(p.price)}</div>
    <p class="modal-desc">${p.desc}</p>
    <button class="btn btn-primary btn-block" onclick="addToCart(${p.id}); closeModal();">افزودن به سبد خرید</button>
    <br><br>
    <a href="${p.paymentLink}" target="_blank" class="btn btn-outline btn-block" style="text-align:center;">خرید مستقیم (درگاه پرداخت)</a>
  `;
  modal.classList.add("show");
  document.getElementById("overlay").classList.add("show");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show");
  if (!document.getElementById("cartDrawer").classList.contains("open")) {
    document.getElementById("overlay").classList.remove("show");
  }
}

// Event listeners
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", () => {
    const f = card.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === f));
    renderProducts(f);
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("cartBtn").addEventListener("click", () => {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
});
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", () => { closeCart(); closeModal(); });
document.getElementById("modalClose").addEventListener("click", closeModal);

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("سبد خرید خالی است");
  // اینجا می‌تونی لینک درگاه کلی بگذاری یا به صفحه پرداخت هدایت کنی
  alert("برای اتصال واقعی به زرین‌پال، لینک paymentLink هر محصول را در script.js با لینک درگاه خودت عوض کن.");
});

// Start
renderProducts();
