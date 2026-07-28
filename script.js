// ===== Product Data =====
const products = [
  { id: 1, name: "انگشتر الماس کلاسیک", category: "ring", price: 48500000, icon: "fa-ring", badge: "پرفروش", desc: "انگشتر طلای ۱۸ عیار با نگین الماس طبیعی ۰.۵ قیراط. طراحی کلاسیک و ظریف مناسب استفاده روزانه و مجالس." },
  { id: 2, name: "گردنبند زنجیری طلا", category: "necklace", price: 32000000, icon: "fa-gem", badge: "جدید", desc: "گردنبند زنجیری ظریف از طلای زرد ۱۸ عیار. طول ۴۵ سانتی‌متر با قفل ایمن." },
  { id: 3, name: "دستبند کارتیر", category: "bracelet", price: 67500000, icon: "fa-link", badge: "", desc: "دستبند الهام‌گرفته از طراحی کارتیر با طلای سفید و زرد. نماد عشق و تعهد." },
  { id: 4, name: "گوشواره میخی الماس", category: "earring", price: 28900000, icon: "fa-circle", badge: "", desc: "گوشواره میخی با نگین الماس برلیان. مناسب استفاده روزانه و بسیار سبک." },
  { id: 5, name: "انگشتر یاقوت سرخ", category: "ring", price: 52000000, icon: "fa-ring", badge: "ویژه", desc: "انگشتر طلای زرد با نگین یاقوت سرخ طبیعی و الماس‌های کناری." },
  { id: 6, name: "گردنبند مروارید", category: "necklace", price: 41000000, icon: "fa-gem", badge: "", desc: "گردنبند مروارید اصل با قفل طلای ۱۸ عیار. طراحی شیک و کلاسیک." },
  { id: 7, name: "دستبند تنیس الماس", category: "bracelet", price: 89000000, icon: "fa-link", badge: "لوکس", desc: "دستبند تنیس با ردیف الماس‌های برلیان. درخشش فوق‌العاده در نور." },
  { id: 8, name: "گوشواره آویز طلا", category: "earring", price: 24500000, icon: "fa-circle", badge: "جدید", desc: "گوشواره آویز ظریف از طلای زرد ۱۸ عیار با حرکت نرم و زیبا." },
];

let cart = [];
let currentFilter = "all";

// ===== Render Products =====
function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <i class="fas ${p.icon}"></i>
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

  // Click to open modal
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      openModal(id);
    });
  });
}

function getCategoryName(cat) {
  const map = { ring: "انگشتر", necklace: "گردنبند", bracelet: "دستبند", earring: "گوشواره" };
  return map[cat] || cat;
}

function formatPrice(num) {
  return num.toLocaleString("fa-IR") + " تومان";
}

// ===== Filter =====
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderProducts(currentFilter);
  });
});

// Category cards also filter
document.querySelectorAll(".cat-card").forEach(card => {
  card.addEventListener("click", () => {
    const filter = card.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });
    currentFilter = filter;
    renderProducts(filter);
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
});

// ===== Cart =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
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

  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-cart">سبد خرید شما خالی است</p>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img"><i class="fas ${item.icon}"></i></div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${formatPrice(item.price)} × ${item.qty}</span>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  totalEl.textContent = formatPrice(total);
}

// Cart open/close
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");

cartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
});

closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("سبد خرید خالی است");
    return;
  }
  alert("با تشکر! در نسخه دمو امکان پرداخت واقعی وجود ندارد.\nجمع کل: " + document.getElementById("cartTotal").textContent);
});

// ===== Modal =====
function openModal(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const modal = document.getElementById("productModal");
  const body = document.getElementById("modalBody");

  body.innerHTML = `
    <div class="modal-image"><i class="fas ${product.icon}"></i></div>
    <h2>${product.name}</h2>
    <div class="modal-price">${formatPrice(product.price)}</div>
    <p class="modal-desc">${product.desc}</p>
    <button class="btn btn-primary btn-block" onclick="addToCart(${product.id}); closeModal();">
      افزودن به سبد خرید
    </button>
  `;

  modal.classList.add("show");
  overlay.classList.add("show");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show");
  // only remove overlay if cart is also closed
  if (!cartDrawer.classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", () => {
  closeModal();
  closeCartDrawer();
});

// ===== Init =====
renderProducts();
