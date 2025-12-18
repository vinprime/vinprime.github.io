import { showLoading, hideLoading } from './utils.js';

class ProductGroupDetail {
    constructor() {
        this.groupId = this.getGroupIdFromURL();
        this.groupData = null;
        this.products = [];
        this.swiperInstances = {};
        this.bindLanguageChange();
        this.init();
    }

    bindLanguageChange() {
        // Lắng nghe sự kiện thay đổi ngôn ngữ
        document.addEventListener('languageChanged', () => {
            console.log('🌐 Language changed event received in ProductGroupDetail');
            this.updateContentLanguage();
        });

        // Hoặc với tên event khác nếu bạn dùng i18n:languageChanged
        document.addEventListener('i18n:languageChanged', (event) => {
            console.log('🌐 i18n:languageChanged event received', event.detail);
            this.updateContentLanguage();
        });
    }
    updateContentLanguage() {
        this.init();
    }
    getGroupIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id'); // id ở đây là group id (ví dụ: "corn")
    }

    async init() {
        try {
            showLoading();
            await this.loadGroupData();
            if (!this.groupData) {
                this.showGroupNotFound();
                hideLoading();
                return;
            }

            await this.renderGroupDetail();
            this.initSwiper();
            this.setupEventListeners();

            if (typeof AOS !== 'undefined') {
                AOS.init();
            }

            hideLoading();
        } catch (error) {
            console.error('Error initializing group detail:', error);
            this.showError();
        }
    }

    loadGroupData() {
        // Lấy dữ liệu từ i18n
        const productsData = window.i18n.translations.products;
        if (!productsData || !productsData.groups) {
            throw new Error('Groups data not found in i18n');
        }

        // Tìm nhóm theo ID
        this.groupData = productsData.groups[this.groupId];
        if (!this.groupData) {
            throw new Error(`Group ${this.groupId} not found`);
        }

        // Lấy tất cả sản phẩm trong nhóm này
        this.products = [];
        if (this.groupData.children && productsData.details) {
            this.groupData.children.forEach(productKey => {
                const product = productsData.details[productKey];
                if (product) {
                    this.products.push({
                        key: productKey,
                        name: window.i18n.t(`products.${productKey}`) || productKey,
                        ...product
                    });
                }
            });
        }

        return this.groupData;
    }

    async renderGroupDetail() {
        // Render breadcrumb
        this.renderBreadcrumb();

        // Render group info
        this.renderGroupInfo();
        this.renderGallery();
        // Render products in group
        this.renderProductsGrid();

        // Hiển thị nội dung
        document.querySelector('.product-group-loading')?.classList.remove('active');
        document.querySelector('.product-group-detail-content').style.display = 'block';
    }

    renderBreadcrumb() {
        const breadcrumb = document.getElementById('product-breadcrumb');
        if (!breadcrumb) return;
        breadcrumb.innerHTML = `
            <a href="index.html" data-i18n="site.name">${window.i18n.t('site.name').toUpperCase()}</a> &gt;
            <a href="all-products-page.html" data-i18n="products.title">${window.i18n.t('products.title')}</a> &gt;
            <span id="current-group"data-i18n="products.groups.${this.groupId}.name">${window.i18n.t(`products.groups.${this.groupId}.name`)}</span>
        `;
    }

    renderGroupInfo() {
        // Set group title
        const titleEl = document.getElementById('product-title');
        if (titleEl) {
            titleEl.textContent = this.groupData.name;
        }

        // Ẩn các phần không cần thiết cho trang nhóm
        const descriptionEl = document.getElementById('product-description');
        const processEl = document.querySelector('.product-process');
        const packagingEl = document.querySelector('.product-packaging');

        if (descriptionEl) if (descriptionEl) {
            descriptionEl.innerHTML = `<span>${this.groupData.description}</span>`;
        }
        if (processEl) if (processEl) {
            processEl.innerHTML = `<span>${this.groupData.process_steps}</span>`;
        }
        if (packagingEl) if (packagingEl) {
            packagingEl.innerHTML = `<span>${this.groupData.packing}</span>`;
        }

        // Ẩn gallery
        const galleryEl = document.querySelector('.product-gallery');
        if (galleryEl) galleryEl.style.display = 'none';

        // Thay đổi tiêu đề related products thành "Các sản phẩm trong nhóm"
        const relatedTitle = document.querySelector('.related-products h2');
        // Products in group ${this.groupData.name}
        if (relatedTitle) {
            relatedTitle.innerHTML = `<i class="fas fa-boxes"></i> <span data-i18n="[html]products.groupProducts" 
        data-i18n-params='{"groupName": "${this.groupData.name}"}'>${window.i18n.t(`products.groupProducts`)} ${this.groupData.name}</span>`;
        }
    }
    renderGallery() {
        const mainSwiper = document.getElementById('main-image-slides');
        const thumbSwiper = document.getElementById('thumbnail-slides');

        if (!mainSwiper || !thumbSwiper) return;

        // Clear existing content
        mainSwiper.innerHTML = '';
        thumbSwiper.innerHTML = '';

        // Tập hợp tất cả ảnh từ các sản phẩm trong nhóm
        let allImages = [];

        // Lấy ảnh đầu tiên từ mỗi sản phẩm
        this.products.forEach(product => {
            if (product.images && product.images.length > 0) {
                // Thêm ảnh đầu tiên của mỗi sản phẩm
                allImages.push({
                    src: product.images[0],
                    alt: `${product.name} - Ảnh đại diện`
                });

                // Có thể thêm thêm ảnh nếu muốn
                // if (product.images.length > 1) {
                //     allImages.push({
                //         src: product.images[1],
                //         alt: `${product.name} - Hình 2`
                //     });
                // }
            }
        });

        // Nếu không có ảnh từ sản phẩm, sử dụng ảnh placeholder
        if (allImages.length === 0) {
            allImages.push({
                src: '/assets/images/placeholder.jpg',
                alt: `${this.groupData.name} - Ảnh đại diện`
            });
        }

        // Render main images
        allImages.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
            <img src="${img.src}" 
                 alt="${img.alt}"
                 loading="lazy"
                 onerror="this.src='/assets/images/placeholder.jpg'">
        `;
            mainSwiper.appendChild(slide);
        });

        // Render thumbnails
        allImages.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'swiper-slide';
            thumb.innerHTML = `
            <img src="${img.src}" 
                 alt="${img.alt} - Thumbnail"
                 loading="lazy"
                 onerror="this.src='/assets/images/placeholder.jpg'">
        `;
            thumbSwiper.appendChild(thumb);
        });
    }
    renderProductsGrid() {
        const relatedProductsEl = document.getElementById('related-products');
        if (!relatedProductsEl) return;
        if (this.products.length === 0) {
            relatedProductsEl.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open fa-3x" style="color: #6c757d; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 10px;"  data-i18n="misc.noProducts">Không có sản phẩm nào</h3>
                <p style="color: #666;" data-i18n="misc.noProductsInThisGroup">Hiện không có sản phẩm trong nhóm này.</p>
            </div>
        `;
            return;
        }

        // Render tất cả sản phẩm trong nhóm với swiper cho mỗi sản phẩm
        relatedProductsEl.innerHTML = this.products.map((product, index) => `
        <div class="related-product-card" data-aos="fade-up">
                <h3>${product.name}</h3>
            <div class="related-product-image">
                ${this.renderProductSwiper(product, index)}
            </div>
            <div class="related-product-info">
                <p>${this.getShortDescription(product.description)}</p>
                <div class="product-actions">
    <a href="all-products-page.html?scrollTo=${product.key}" class="btn btn-outline" target="_blank">
        <i class="fas fa-info-circle"></i>
        <span>${window.i18n.t('misc.view_details') || 'Chi tiết'}</span>
    </a>
    <a href="index.html?scrollTo=quotation" class="btn btn-primary" target="_blank">
        <i class="fas fa-shopping-cart"></i>
        <span>${window.i18n.t('misc.contact') || 'Đặt hàng'}</span>
    </a>
</div>
            </div>
        </div>
    `).join('');

        // Khởi tạo swiper cho tất cả sản phẩm sau khi render
        this.initProductSwipers();
    }

    renderProductSwiper(product, index) {
        const images = product.images || [];
        const productName = product.name;
        if (images.length === 0) {
            return `
            <img src="/assets/images/placeholder.jpg" 
                 alt="${productName}"
                 onerror="this.src='/assets/images/placeholder.jpg'">
            <div class="product-overlay">
                <a href="all-products-page.html?scrollTo=${product.key}" class="view-detail-btn" target="_blank">
                    <i class="fas fa-eye"></i>
                    ${window.i18n.t('products.viewDetail') || 'Xem chi tiết'}
                </a>
            </div>
        `;
        }

        if (images.length === 1) {
            return `
            <img src="${images[0]}" 
                 alt="${productName}"
                 onerror="this.src='/assets/images/placeholder.jpg'">
            <div class="product-overlay">
                <a href="all-products-page.html?scrollTo=${product.key}" class="view-detail-btn" target="_blank">
                    <i class="fas fa-eye"></i>
                    ${window.i18n.t('products.viewDetail') || 'Xem chi tiết'}
                </a>
            </div>
        `;
        }
        // Nếu có nhiều ảnh, tạo swiper
        return `
        <div class="product-mini-swiper swiper-${index}">
            <div class="swiper-wrapper">
                ${images.map((img, imgIndex) => `
                    <div class="swiper-slide">
                        <img src="${img}" 
                             alt="${productName} - Hình ${imgIndex + 1}"
                             onerror="this.src='/assets/images/placeholder.jpg'">
                    </div>
                `).join('')}
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination swiper-pagination-${index}"></div>
            <!-- Add Navigation -->
            <div class="swiper-button-next swiper-button-next-${index}"></div>
            <div class="swiper-button-prev swiper-button-prev-${index}"></div>
            <div class="product-overlay">
                <a href="all-products-page.html?scrollTo=${product.key}" class="view-detail-btn" target="_blank">
                    <i class="fas fa-eye"></i>
                    ${window.i18n.t('products.viewDetail') || 'Xem chi tiết'}
                </a>
            </div>
        </div>
    `;
    }

    initProductSwipers() {
        console.log('=== INITIALIZING PRODUCT SWIPERS ===');
        console.log('Products count:', this.products.length);

        this.products.forEach((product, index) => {
            const images = product.images || [];
            console.log(`Product ${index}: ${images.length} images`);

            if (images.length > 1) {
                // Đợi DOM render xong
                setTimeout(() => {
                    const swiperSelector = `.swiper-${index}`;
                    const nextSelector = `.swiper-button-next-${index}`;
                    const prevSelector = `.swiper-button-prev-${index}`;
                    const paginationSelector = `.swiper-pagination-${index}`;

                    console.log(`Looking for swiper: ${swiperSelector}`);

                    const swiperEl = document.querySelector(swiperSelector);
                    const nextEl = document.querySelector(nextSelector);
                    const prevEl = document.querySelector(prevSelector);
                    const paginationEl = document.querySelector(paginationSelector);

                    console.log(`Swiper element found:`, !!swiperEl);
                    console.log(`Next button found:`, !!nextEl);
                    console.log(`Prev button found:`, !!prevEl);
                    console.log(`Pagination found:`, !!paginationEl);

                    if (swiperEl && nextEl && prevEl) {
                        try {
                            console.log(`Initializing swiper for product ${index}...`);

                        } catch (error) {
                            console.error(`❌ Failed to initialize swiper ${index}:`, error);
                        }
                    } else {
                        console.warn(`⚠️ Missing elements for swiper ${index}`);
                    }
                }, 100); // Tăng timeout để chắc DOM đã render
            }
        });
    }

    addManualClickHandlers(index, swiper) {
        const nextBtn = document.querySelector(`.swiper-button-next-${index}`);
        const prevBtn = document.querySelector(`.swiper-button-prev-${index}`);

        if (nextBtn) {
            // Remove existing listeners trước
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

            newNextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Manual click on next button ${index}`);
                swiper.slideNext();
            });
        }

        if (prevBtn) {
            // Remove existing listeners trước
            const newPrevBtn = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

            newPrevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Manual click on prev button ${index}`);
                swiper.slidePrev();
            });
        }
    }
    getShortDescription(description) {
        if (!description) return '';
        const firstLine = description.split('\n')[0];
        return firstLine.length > 120 ?
            firstLine.substring(0, 120) + '...' :
            firstLine;
    }

    initSwiper() {
        // Nếu muốn hiển thị banner/ảnh đại diện cho nhóm
        // Bạn có thể tạo swiper ở đây nếu cần
    }

    setupEventListeners() {
        // Sử dụng event delegation cho swiper buttons

    }

    findParentSwiper(element) {
        let parent = element.parentElement;
        while (parent) {
            if (parent.classList.contains('swiper')) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    triggerSwiperNavigation(button) {
        const swiperContainer = this.findParentSwiper(button);
        if (!swiperContainer) return;

        // Tìm swiper instance dựa trên container
        const swiperKey = Object.keys(this.swiperInstances).find(key => {
            const instance = this.swiperInstances[key];
            return instance && instance.el === swiperContainer;
        });

        if (swiperKey && this.swiperInstances[swiperKey]) {
            const swiper = this.swiperInstances[swiperKey];
            console.log('Found swiper instance:', swiper);

            if (button.classList.contains('swiper-button-next')) {
                console.log('Triggering swiper.slideNext()');
                swiper.slideNext();
            } else if (button.classList.contains('swiper-button-prev')) {
                console.log('Triggering swiper.slidePrev()');
                swiper.slidePrev();
            }
        }
    }

    showGroupNotFound() {
        const loadingEl = document.querySelector('.product-loading');
        if (!loadingEl) return;

        // Override CSS để center
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
            <i class="fas fa-boxes fa-4x" style="color: #6c757d; margin-bottom: 20px;"></i>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">Nhóm sản phẩm không tồn tại</h2>
            <p style="color: #666; margin-bottom: 30px; max-width: 500px; line-height: 1.6;">
                Nhóm sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                <a href="all-products-page.html" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background 0.3s;
                ">
                    <i class="fas fa-arrow-left"></i>
                    Quay lại trang sản phẩm
                </a>
                <a href="index.html" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: #6c757d;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background 0.3s;
                ">
                    <i class="fas fa-home"></i>
                    Về trang chủ
                </a>
            </div>
        `;

        loadingEl.classList.remove('active');
    }

    showError() {
        const loadingEl = document.querySelector('.product-loading');
        if (!loadingEl) return;

        // Override CSS để center
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
                Đã xảy ra lỗi khi tải thông tin nhóm sản phẩm. Vui lòng thử lại sau.
            </p>
            <button onclick="window.location.reload()" style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s;
            ">
                <i class="fas fa-redo"></i>
                Tải lại trang
            </button>
        `;

        loadingEl.classList.remove('active');
    }
}

// Khởi tạo khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    // Đợi i18n khởi tạo xong
    if (typeof i18n !== 'undefined' && window.i18n.initialized) {
        new ProductGroupDetail();
    } else {
        // Nếu i18n chưa sẵn sàng, đợi một chút
        const checkI18n = setInterval(() => {
            if (typeof i18n !== 'undefined' && window.i18n.initialized) {
                clearInterval(checkI18n);
                new ProductGroupDetail();
            }
        }, 100);
    }
});

// Export cho các module khác sử dụng
export { ProductGroupDetail };