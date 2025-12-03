import { showLoading, hideLoading } from './utils.js';

class AllProductsPage {
    constructor() {
        this.groups = [];
        this.allProducts = [];
        this.totalProducts = 0;
        this.bindLanguageChange();
        this.init();
    }

    bindLanguageChange() {
        document.addEventListener('languageChanged', () => {
            console.log('🌐 Language changed event received in AllProductsPage');
            this.updateContentLanguage();
        });

        document.addEventListener('i18n:languageChanged', (event) => {
            console.log('🌐 i18n:languageChanged event received', event.detail);
            this.updateContentLanguage();
        });
    }

    updateContentLanguage() {
        this.init();
    }

    async init() {
        try {
            showLoading();
            await this.loadProductsData();
            this.renderBreadcrumb();
            this.renderPageContent();
            this.setupEventListeners();

            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true,
                    offset: 100
                });
            }

            this.highlightActiveGroupFromHash();
            this.setupHashChangeListener();

            hideLoading();
        } catch (error) {
            console.error('Error initializing all products page:', error);
            this.showError();
        }
    }

    loadProductsData() {
        // Lấy dữ liệu từ i18n
        const productsData = window.i18n.translations.products;
        if (!productsData || !productsData.groups) {
            throw new Error('Products data not found in i18n');
        }

        // Lấy danh sách nhóm
        this.groups = Object.keys(productsData.groups).map(groupKey => {
            const group = productsData.groups[groupKey];
            return {
                key: groupKey,
                name: group.name,
                description: group.description,
                children: group.children || []
            };
        });

        // Lấy tất cả sản phẩm chi tiết
        const details = productsData.details || {};
        this.totalProducts = 0;

        this.groups.forEach(group => {
            group.products = [];
            group.children.forEach(productKey => {
                if (details[productKey]) {
                    const productName = productsData[productKey] || productKey;
                    group.products.push({
                        key: productKey,
                        name: productName,
                        ...details[productKey]
                    });
                    this.totalProducts++;
                }
            });
        });

        return { groups: this.groups, totalProducts: this.totalProducts };
    }

    renderBreadcrumb() {
        // const breadcrumb = document.getElementById('products-breadcrumb');
        // if (!breadcrumb) return;
        // breadcrumb.innerHTML = `
        //     <a href="index.html" data-i18n="site.name">${window.i18n.t('site.name').toUpperCase()}</a> &gt;
        //     <span data-i18n="products.title">${window.i18n.t('products.title')}</span>
        // `;
    }

    renderPageContent() {
        const contentEl = document.querySelector('.all-products-content');
        if (!contentEl) return;

        // Hiển thị content
        contentEl.style.display = 'block';

        // Ẩn skeleton loading
        document.querySelector('.all-products-loading')?.classList.remove('active');

        // Cập nhật summary
        this.updateProductsSummary();

        // Render navigation
        this.renderGroupNavigation();

        // Render all groups với thông tin đầy đủ
        this.renderAllGroups();
    }

    updateProductsSummary() {
        const totalGroupsEl = document.getElementById('total-groups');
        const totalProductsEl = document.getElementById('total-products');

        if (totalGroupsEl) {
            totalGroupsEl.textContent = `${this.groups.length} nhóm sản phẩm`;
        }

        if (totalProductsEl) {
            totalProductsEl.textContent = `${this.totalProducts} sản phẩm`;
        }
    }

    renderGroupNavigation() {
        const navEl = document.getElementById('group-navigation');
        if (!navEl) return;

        if (this.groups.length === 0) {
            navEl.innerHTML = '';
            return;
        }

        navEl.innerHTML = `
        <div class="navigation-title">
            <i class="fas fa-list"></i>
            <span>${window.i18n.t('misc.groupNavigation')}</span>
        </div>
        <div class="group-nav-links">
            ${this.groups.map((group, index) => `
                <a href="#product-group-${index + 1}" 
                   class="group-nav-link" 
                   data-group="${group.key}">
                    ${group.name}
                </a>
            `).join('')}
        </div>
    `;
    }

    renderAllGroups() {
        const container = document.getElementById('products-container');
        if (!container) return;

        if (this.groups.length === 0) {
            container.innerHTML = `
                <div class="empty-products" data-aos="fade-up">
                    <i class="fas fa-box-open"></i>
                    <h3>Không có nhóm sản phẩm nào</h3>
                    <p>Hiện không có nhóm sản phẩm nào để hiển thị.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.groups.map((group, index) => `
            <section class="product-group-section" 
                     id="product-group-${index + 1}" 
                     data-group="${group.key}"
                     data-aos="fade-up">
                ${this.renderGroupHeader(group, index + 1)}
                ${this.renderGroupDescription(group)}
                ${this.renderGroupProducts(group)}
            </section>
        `).join('');
    }

    renderGroupHeader(group, groupNumber) {
        const productsCount = group.products?.length || 0;
        const countText = window.i18n.t('products.count', { count: productsCount });

        return `
            <div class="group-header">
                <div class="group-title-container">
                    <div class="group-title">
                        <i class="fas fa-layer-group"></i>
                        ${group.name}
                    </div>
                    <div class="group-count">
                        <i class="fas fa-cube"></i>
                        ${countText}
                    </div>
                </div>
            </div>
        `;
    }

    renderGroupDescription(group) {
        if (!group.description) return '';

        return `
            <div class="group-description" data-aos="fade-up" data-aos-delay="100">
                <div class="group-description-content">
                    ${group.description}
                </div>
            </div>
        `;
    }

    renderGroupProducts(group) {
        const products = group.products || [];

        if (products.length === 0) {
            return `
                <div class="products-full-grid">
                    <div class="empty-products">
                        <i class="fas fa-box-open fa-3x"></i>
                        <h3>${window.i18n.t('misc.noProductsInGroup')}</h3>
                        <p>${window.i18n.t('misc.productsUpdating')}</p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="products-full-grid">
                ${products.map(product => this.renderFullProductCard(product)).join('')}
            </div>
        `;
    }

    renderFullProductCard(product) {
        const images = product.images || [];
        const imageUrl = images.length > 0 ? images[0] : '/assets/images/placeholder.jpg';
        const description = product.description || '';
        const key = product.key || '';
        // Parse description để trích xuất thông tin
        const parsedInfo = this.parseProductDescription(description);
        const hasProcess = parsedInfo.processSteps.length > 0;
        const hasPackaging = parsedInfo.packagingInfo !== '';

        return `
            <div class="product-full-card" data-aos="fade-up" data-aos-delay="200" id="${key}">
                <!-- Product Header -->
                <div class="product-full-header">
                    <h2 class="product-full-name">
                        <i class="fas fa-cube"></i>
                        ${product.name}
                    </h2>
                    <div class="product-badges">
                        <span class="badge high-quality">
                            <i class="fas fa-award"></i>
                            ${window.i18n.t('products.highQuality')}
                        </span>
                        <span class="badge export">
                            <i class="fas fa-globe"></i>
                            ${window.i18n.t('products.exportStandard')}
                        </span>
                    </div>
                </div>

                <!-- Product Gallery -->
                <div class="product-full-gallery">
                    <img src="${imageUrl}" 
                         alt="${product.name}" 
                         class="main-product-image"
                         loading="lazy"
                         onerror="this.src='/assets/images/placeholder.jpg'">
                    ${images.length > 1 ? `
                        <div class="image-counter">
                            <i class="fas fa-images"></i>
                            ${images.length} ảnh
                        </div>
                    ` : ''}
                </div>

                <!-- Product Details -->
                <div class="product-full-details">
                    <!-- Mô tả chi tiết -->
                    <div class="product-full-description">
                        ${this.formatProductDescription(description)}
                    </div>

                    <!-- Thông số kỹ thuật (nếu có) -->
                    ${parsedInfo.specifications.length > 0 ? `
                        <div class="product-specifications">
                            <h5><i class="fas fa-clipboard-check"></i> ${window.i18n.t('products.technicalspecs')}</h5>
                            ${parsedInfo.specifications.map(spec => `
                                <div class="spec-row">
                                    <span class="spec-label">${spec.label}:</span>
                                    <span class="spec-value">${spec.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Quy trình sản xuất (nếu có) -->
                    ${hasProcess ? `
                        <div class="product-process-steps">
                            <h5 class="process-title">
                                <i class="fas fa-industry"></i>
                                ${window.i18n.t('products.process')}
                            </h5>
                            <div class="process-steps">
                                ${parsedInfo.processSteps.map((step, index) => `
                                    <div class="process-step">
                                        <div class="step-number">${index + 1}</div>
                                        <div class="step-content">
                                            <h6>${step.title || `Bước ${index + 1}`}</h6>
                                            <p>${step.content}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Thông tin đóng gói (nếu có) -->
                    ${hasPackaging ? `
                        <div class="packaging-info">
                            <h5 class="packaging-title">
                                <i class="fas fa-box"></i>
                                ${window.i18n.t('products.packaging')}
                            </h5>
                            <p class="packaging-details">${parsedInfo.packagingInfo}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    parseProductDescription(description) {
        const result = {
            specifications: [],
            processSteps: [],
            packagingInfo: '',
            mainDescription: ''
        };

        if (!description) return result;

        // Phân tích description để tìm thông tin
        const lines = description.split('\n');
        let currentSection = 'main';
        let currentProcessStep = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Bỏ qua dòng trống
            if (!line) continue;

            // Tìm thông số kỹ thuật (dạng "Parameter: Value")
            const specMatch = line.match(/^(.*?):\s*(.+)$/);
            if (specMatch && !line.includes('http') && line.length < 100) {
                result.specifications.push({
                    label: specMatch[1].trim(),
                    value: specMatch[2].trim()
                });
                continue;
            }

            // Tìm quy trình (dạng "1/ TITLE" hoặc "Step X: Content")
            const processMatch = line.match(/^(\d+)\/?\s*(.+)$/);
            if (processMatch) {
                if (currentProcessStep) {
                    result.processSteps.push(currentProcessStep);
                }
                currentProcessStep = {
                    title: processMatch[2].trim(),
                    content: ''
                };
                currentSection = 'process';
                continue;
            }

            // Tìm thông tin đóng gói
            if (line.toLowerCase().includes('packing') ||
                line.toLowerCase().includes('packaging') ||
                line.includes('Jumbo bag') ||
                line.includes('PP bag') ||
                line.includes('40 HC')) {
                result.packagingInfo = line;
                currentSection = 'packaging';
                continue;
            }

            // Thêm nội dung vào section hiện tại
            switch (currentSection) {
                case 'main':
                    result.mainDescription += (result.mainDescription ? '\n' : '') + line;
                    break;
                case 'process':
                    if (currentProcessStep) {
                        currentProcessStep.content += (currentProcessStep.content ? ' ' : '') + line;
                    }
                    break;
                case 'packaging':
                    result.packagingInfo += (result.packagingInfo && !result.packagingInfo.includes(line) ? ' ' : '') + line;
                    break;
            }
        }

        // Thêm process step cuối cùng nếu có
        if (currentProcessStep) {
            result.processSteps.push(currentProcessStep);
        }

        return result;
    }

    formatProductDescription(description) {
        if (!description) return '';

        // Xử lý định dạng markdown đơn giản
        let formatted = description;

        // Xử lý headings
        formatted = formatted.replace(/Process:\n/g, `<h4><i class="fas fa-cogs"></i> ${window.i18n.t('products.process')}</h4>\n`);
        formatted = formatted.replace(/Packing style:/g, `<h4><i class="fas fa-box"></i> ${window.i18n.t('products.packaging')}</h4>\n`);

        // Xử lý numbered lists
        formatted = formatted.replace(/(\d+)\/([^\n]+)/g, '<strong>$1/ $2</strong>');

        // Xử lý bullet points
        formatted = formatted.replace(/^- /g, '• ');

        // Giữ nguyên các dòng mới
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    setupEventListeners() {
        // Navigation click handlers
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('.group-nav-link');
            if (navLink) {
                e.preventDefault();
                const targetId = navLink.getAttribute('href');
                this.scrollToGroup(targetId);
            }
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // Click to scroll top
        const backToTopBtn = document.querySelector('.back-to-top-btn');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    handleScroll() {
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('.product-group-section');
        const navLinks = document.querySelectorAll('.group-nav-link');

        let currentSection = null;
        let minDistance = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - 100); // Khoảng cách từ top của section đến top viewport + offset

            if (distance < minDistance) {
                minDistance = distance;
                currentSection = section;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === `#${currentSection.id}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToGroup(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 120;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    highlightActiveGroupFromHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }

    setupHashChangeListener() {
        window.addEventListener('hashchange', () => {
            this.highlightActiveGroupFromHash();
        });
    }

    showError() {
        const loadingEl = document.querySelector('.all-products-loading');
        if (!loadingEl) return;

        loadingEl.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 60vh !important;
            padding: 40px 20px !important;
            text-align: center !important;
        `;

        loadingEl.innerHTML = `
            <i class="fas fa-exclamation-triangle fa-3x" style="color: #dc3545; margin-bottom: 20px;"></i>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">Đã xảy ra lỗi</h2>
            <p style="color: #666; margin-bottom: 30px; max-width: 500px; line-height: 1.6;">
                Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.
            </p>
            <button onclick="window.location.reload()" class="btn btn-primary">
                <i class="fas fa-redo"></i>
                Tải lại trang
            </button>
        `;

        loadingEl.classList.remove('active');
    }
}

// Khởi tạo khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof i18n !== 'undefined' && window.i18n.initialized) {
        new AllProductsPage();
    } else {
        const checkI18n = setInterval(() => {
            if (typeof i18n !== 'undefined' && window.i18n.initialized) {
                clearInterval(checkI18n);
                new AllProductsPage();
            }
        }, 100);
    }
});
// Đợi trang load xong
document.addEventListener('DOMContentLoaded', function () {
    const hash = window.location.hash; // #product-key123
    if (hash) {
        // Đợi thêm chút để đảm bảo mọi thứ render xong
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Thêm highlight
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        }, 500);
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToId = urlParams.get('scrollTo');

    if (scrollToId) {
        setTimeout(() => {
            const element = document.getElementById(scrollToId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Thêm highlight
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        }, 800); // Thời gian chờ dài hơn cho trang load hoàn tất
    }
});
// Export cho các module khác sử dụng
export { AllProductsPage };