// Render product list and product detail
(async function() {
  const products = await window.loadProductsData();

  // home featured
  const homeList = document.getElementById('home-products');
  if (homeList && products.length) {
    homeList.innerHTML = products.slice(0,3).map(p => `
      <article class="card">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <a class="btn" href="products.html">Xem tất cả</a>
      </article>
    `).join('');
  }

  // products page
  const list = document.getElementById('product-list');
  if (list) {
    list.innerHTML = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <a class="btn" href="product-detail.html?id=${p.id}">Xem chi tiết</a>
      </div>
    `).join('');
  }

  // product detail page
  const detail = document.getElementById('productDetail');
  if (detail) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const p = products.find(x => x.id === id);
    if (!p) {
      detail.innerHTML = '<p>Sản phẩm không tồn tại.</p>';
      return;
    }

    detail.innerHTML = `
      <div class="product-detail-grid">
        <div class="gallery">
          ${p.images.map(i => `<img src="${i}" alt="${p.name}" />`).join('')}
        </div>
        <div class="info">
          <h1>${p.name}</h1>
          <p>${p.description}</p>
          <h4>Thông số</h4>
          <table>
            ${Object.entries(p.specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
          </table>
          <h4>Ứng dụng</h4>
          <ul>${p.applications.map(a => `<li>${a}</li>`).join('')}</ul>
          <a class="btn" href="contact.html">Liên hệ báo giá</a>
        </div>
      </div>
    `;
  }
})();
