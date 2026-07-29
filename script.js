// سبد خرید مشترک بین صفحات (localStorage)
let cart = JSON.parse(localStorage.getItem('zarnagar_cart') || '[]');

function saveCart() {
  localStorage.setItem('zarnagar_cart', JSON.stringify(cart));
}

function formatPrice(num) {
  return num.toLocaleString('fa-IR') + ' تومان';
}

function getCategoryName(cat) {
  const map = { ring: 'انگشتر', necklace: 'گردنبند', bracelet: 'دستبند', earring: 'گوشواره' };
  return map[cat] || cat;
}

/**
 * نمایش محصولات
 * @param {string} filter - دسته
 * @param {string} gridId - آیدی المنت گرید
 * @param {number|null} limit - محدودیت تعداد
 * @param {string} searchQuery - متن جستجو
 */
function renderProducts(filter = 'all', gridId = 'productGrid', limit = null, searchQuery = '') {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  let list = filter === 'all' ? [...products] : products.filter(p => p.category === filter);

  // جستجو
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      getCategoryName(p.category).includes(searchQuery)
    );
  }

  if (limit) list = list.slice(0, limit);

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = list.length === 0 ? 'block' : 'none';
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
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
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!countEl || !itemsEl || !totalEl) return;

  countEl.textContent = cart.reduce((s, i) => s + i.qty, 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">سبد خرید شما خالی است</p>';
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
    `).join('');
  }

  totalEl.textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.qty, 0));
}

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('productModal');
  const body = document.getElementById('modalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="modal-image"><img src="${p.image}" alt="${p.name}"></div>
    <h2>${p.name}</h2>
    <div class="modal-price">${formatPrice(p.price)}</div>
    <p class="modal-desc">${p.desc}</p>
    <button class="btn btn-primary btn-block" onclick="addToCart(${p.id}); closeModal();">افزودن به سبد خرید</button>
    <br><br>
    <a href="${p.paymentLink}" target="_blank" class="btn btn-outline btn-block" style="text-align:center;display:block;">خرید مستقیم (درگاه پرداخت)</a>
  `;
  modal.classList.add('show');
  document.getElementById('overlay')?.classList.add('show');
}

function closeModal() {
  document.getElementById('productModal')?.classList.remove('show');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) {
    document.getElementById('overlay')?.classList.remove('show');
  }
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

// Event listeners مشترک
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const q = document.getElementById('searchInput')?.value.trim() || '';
      renderProducts(btn.dataset.filter, 'productGrid', null, q);
    });
  });

  document.getElementById('cartBtn')?.addEventListener('click', () => {
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('overlay')?.classList.add('show');
  });

  document.getElementById('closeCart')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', () => { closeCart(); closeModal(); });
  document.getElementById('modalClose')?.addEventListener('click', closeModal);

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) return alert('سبد خرید خالی است');
    alert('برای اتصال واقعی به زرین‌پال، لینک paymentLink هر محصول را در products-data.js با لینک درگاه خودت عوض کن.');
  });
});
