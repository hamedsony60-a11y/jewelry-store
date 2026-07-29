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

function renderProducts(filter = 'all', gridId = 'productGrid', limit = null, searchQuery = '', collection = null) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  if (!collection) {
    const params = new URLSearchParams(window.location.search);
    collection = params.get('collection');
  }

  let list = [...products];

  if (collection) {
    list = list.filter(p => p.collection === collection);
  } else if (filter && filter !== 'all') {
    list = list.filter(p => p.category === filter);
  }

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
  if (noResults) noResults.style.display = list.length === 0 ? 'block' : 'none';

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

function bounceCartSummary() {
  const footer = document.getElementById('cartFooter');
  if (!footer) return;
  footer.classList.remove('cart-bounce');
  // reflow برای ری‌استارت انیمیشن
  void footer.offsetWidth;
  footer.classList.add('cart-bounce');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartUI(true);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI(true);
}

function updateCartUI(animate = false) {
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

  if (animate) bounceCartSummary();
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

function initHeaderSearch() {
  const wrap = document.getElementById('headerSearch');
  const toggle = document.getElementById('searchToggle');
  const input = document.getElementById('headerSearchInput');
  if (!wrap || !toggle || !input) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrap.classList.toggle('open');
    if (isOpen) input.focus();
    else input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = input.value.trim();
      if (q) goToPage('products.html?q=' + encodeURIComponent(q));
    }
  });

  input.addEventListener('input', () => {
    if (document.getElementById('productGrid')) {
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
      renderProducts(activeFilter, 'productGrid', null, input.value.trim());
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) wrap.classList.remove('open');
  });
}

function goToPage(url) {
  const overlay = document.getElementById('pageTransition');
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 280);
  } else {
    window.location.href = url;
  }
}

function initPageTransitions() {
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;
      e.preventDefault();
      goToPage(href);
    });
  });
  requestAnimationFrame(() => document.body.classList.add('page-ready'));
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  initHeaderSearch();
  initPageTransitions();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const q = document.getElementById('headerSearchInput')?.value.trim() || '';
      renderProducts(btn.dataset.filter, 'productGrid', null, q, null);
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
    alert('برای اتصال واقعی به زرین‌پال، لینک paymentLink هر محصول را در products-data.js عوض کن.');
  });
});
