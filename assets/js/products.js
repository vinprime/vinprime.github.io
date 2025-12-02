// products.js
function applyTranslations() {
  if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
    window.i18n.applyLanguage();
  }
}

class ProductsSection {
  constructor() {
    this.productsData = null;
    this.jsonUrl = 'assets/data/products.json';
  }

  async init() {
    try {
      await this.loadData();
      this.render();
    } catch (error) {
      console.error('Error loading products:', error);
      this.renderFallback();
    }
  }

  async loadData() {
    const response = await fetch(this.jsonUrl);
    if (!response.ok) throw new Error('Failed to load products data');
    this.productsData = await response.json();
  }

  render() {
    const section = document.getElementById('home-products');
    if (!section || !this.productsData) return;

    section.innerHTML = this.createHTML();
    applyTranslations();
  }

  createHTML() {
    const { i18nKeyTitle, i18nKeySubtitle, groups } = this.productsData;
    return `
            <div class="products-container"  id="get-products">
                <div class="products-header"> 
                    <h2 data-i18n="${i18nKeyTitle}" class="section-title">SẢN PHẨM CHÍNH</h2>
                    <p data-i18n="${i18nKeySubtitle}" class="section-subtitle">Nguyên liệu chất lượng cao cho chăn nuôi và công nghiệp</p>
                </div>
                
                <div class="products-grid">
                    ${groups.map(group => this.createGroupCardHTML(group)).join('')}
                </div>
            </div>
        `;
  }

  // Trong createGroupCardHTML
  createGroupCardHTML(group) {
    const productCount = group.products.length;
    const visibleProducts = group.products.slice(0, 3);
    return `
        <a href="product-group-detail.html?id=${group.slug}" class="product-group-card" data-group-slug="${group.slug}">
            <div class="group-image">
                <img src="${group.image}" 
                     data-i18n-alt="${group.i18nKeyGroup}"
                     loading="lazy"
                     onerror="this.src='/assets/images/products/default-group.jpg'">
            </div>
            
            <div class="group-content">
                <h3 data-i18n="${group.i18nKeyGroup}" class="group-title">${group.i18nKeyGroup}</h3>
                
                <div class="product-count">
                      <span data-i18n="products.count" 
                            data-i18n-params='{"count": ${group.productCount}}'>
                          5 products
                      </span>
                </div>
                
                <ul class="product-list">
                    ${visibleProducts.map(product => `
                        <li>
                            <span data-i18n="${product.i18nKey}">${product.i18nKey}</span>
                        </li>
                    `).join('')}
                    
                    ${productCount > 3 ? `
                        <li class="more-item">
                            <span data-i18n="[html]products.more" data-i18n-params='{"count": ${productCount - 3}}'>
                                +${productCount - 3} sản phẩm khác
                            </span>
                        </li>
                    ` : ''}
                </ul>
                
                <div class="view-all">
                    <span data-i18n="products.view_all">Xem tất cả sản phẩm</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        </a>
    `;
  }

  renderFallback() {
    const section = document.getElementById('home-products');
    if (!section) return;

    section.innerHTML = `
            <div class="products-container">
                <div class="products-header"> 
                    <h2 class="section-title">SẢN PHẨM CHÍNH</h2>
                    <p class="section-subtitle">Nguyên liệu chất lượng cao cho chăn nuôi và công nghiệp</p>
                </div>
                
                <div class="products-grid">
                    <a href="/san-pham/corn" class="product-group-card">
                        <div class="group-image">
                            <div class="image-placeholder"></div>
                        </div>
                        <div class="group-content">
                            <h3>CORN</h3>
                            <div class="product-count">3 sản phẩm</div>
                            <ul class="product-list">
                                <li>CORN SILAGE</li>
                                <li>CORN COB MEAL</li>
                                <li>CORN COB PELLET</li>
                            </ul>
                            <div class="view-all">
                                <span>Xem tất cả sản phẩm</span>
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const productsSection = new ProductsSection();
  productsSection.init();
});