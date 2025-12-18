import { showLoading, hideLoading } from './utils.js';

class ProductGroupDetail {
    constructor() {
        this.groupId = this.getGroupIdFromURL();
        this.groupData = null;
        this.products = [];
        this.currentMainImageIndex = 0;
        this.productImageIndices = {}; // Lưu trữ current index cho từng sản phẩm
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
        if (relatedTitle) {
            relatedTitle.innerHTML = `<i class="fas fa-boxes"></i> <span data-i18n="[html]products.groupProducts" 
        data-i18n-params='{"groupName": "${this.groupData.name}"}'>${window.i18n.t(`products.groupProducts`)} ${this.groupData.name}</span>`;
        }
    }

    renderGallery() {
        const mainSlidesContainer = document.getElementById('main-image-slides');
        const thumbSlidesContainer = document.getElementById('thumbnail-slides');

        if (!mainSlidesContainer || !thumbSlidesContainer) return;

        // Clear existing content
        mainSlidesContainer.innerHTML = '';
        thumbSlidesContainer.innerHTML = '';

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
            slide.className = 'image-slide';
            slide.setAttribute('data-index', index);
            slide.style.display = index === 0 ? 'block' : 'none'; // Chỉ hiển thị ảnh đầu tiên
            slide.innerHTML = `
                <img src="${img.src}" 
                     alt="${img.alt}"
                     loading="lazy"
                     onerror="this.src='/assets/images/placeholder.jpg'">
            `;
            mainSlidesContainer.appendChild(slide);
        });

        // Render thumbnails
        allImages.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            thumb.setAttribute('data-index', index);
            thumb.innerHTML = `
                <img src="${img.src}" 
                     alt="${img.alt} - Thumbnail"
                     loading="lazy"
                     onerror="this.src='/assets/images/placeholder.jpg'">
            `;
            thumbSlidesContainer.appendChild(thumb);
        });

        // Thêm pagination dots
        const paginationContainer = document.querySelector('.swiper-pagination');
        if (paginationContainer && allImages.length > 1) {
            paginationContainer.innerHTML = '';
            allImages.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = `pagination-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('data-index', index);
                paginationContainer.appendChild(dot);
            });
        }

        // Hiển thị navigation buttons nếu có nhiều hơn 1 ảnh
        const nextBtn = document.querySelector('.swiper-button-next');
        const prevBtn = document.querySelector('.swiper-button-prev');
        if (allImages.length <= 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
            if (paginationContainer) paginationContainer.style.display = 'none';
        }
    }

    renderProductsGrid() {
        const relatedProductsEl = document.getElementById('related-products');
        if (!relatedProductsEl) return;
        if (this.products.length === 0) {
            relatedProductsEl.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open fa-3x" style="color: #6c757d; margin-bottom: 20px;"></i>
                <h3 style="color: #333; margin-bottom: 10px;">${window.i18n.t('misc.noProducts') || 'Không có sản phẩm nào'}</h3>
                <p style="color: #666;">${window.i18n.t('misc.noProductsInThisGroup') || 'Hiện không có sản phẩm trong nhóm này.'}</p>
            </div>
        `;
            return;
        }

        // Render tất cả sản phẩm trong nhóm
        relatedProductsEl.innerHTML = this.products.map((product, index) => `
        <div class="related-product-card" data-aos="fade-up">
            <h3>${product.name}</h3>
            <div class="related-product-image">
                ${this.renderProductGallery(product, index)}
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

        // Setup product image galleries
        this.setupProductGalleries();
    }

    renderProductGallery(product, productIndex) {
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

        // Nếu có nhiều ảnh, tạo gallery với navigation
        return `
            <div class="product-image-gallery" data-product-index="${productIndex}">
                <div class="product-gallery-container">
                    ${images.map((img, imgIndex) => `
                        <div class="product-image-slide ${imgIndex === 0 ? 'active' : ''}" 
                             data-index="${imgIndex}"
                             style="${imgIndex === 0 ? '' : 'display: none;'}">
                            <img src="${img}" 
                                 alt="${productName} - Hình ${imgIndex + 1}"
                                 onerror="this.src='/assets/images/placeholder.jpg'">
                        </div>
                    `).join('')}
                </div>
                <!-- Navigation buttons -->
                <button class="product-nav-btn prev-btn" data-product-index="${productIndex}">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="product-nav-btn next-btn" data-product-index="${productIndex}">
                    <i class="fas fa-chevron-right"></i>
                </button> 
                <div class="product-overlay">
                    <a href="all-products-page.html?scrollTo=${product.key}" class="view-detail-btn" target="_blank">
                        <i class="fas fa-eye"></i>
                        ${window.i18n.t('products.viewDetail') || 'Xem chi tiết'}
                    </a>
                </div>
            </div>
        `;
    }

    setupProductGalleries() {
        // Khởi tạo chỉ số cho mỗi sản phẩm
        this.products.forEach((product, index) => {
            this.productImageIndices[index] = 0;
        });

        // Thêm event listeners cho product galleries
        document.querySelectorAll('.product-image-gallery').forEach(gallery => {
            const productIndex = parseInt(gallery.getAttribute('data-product-index'));
            
            // Next button
            const nextBtn = gallery.querySelector('.next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showNextProductImage(productIndex);
                });
            }
            
            // Prev button
            const prevBtn = gallery.querySelector('.prev-btn');
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showPrevProductImage(productIndex);
                });
            }
            
            // Pagination dots
            gallery.querySelectorAll('.product-pagination-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(dot.getAttribute('data-index'));
                    this.showProductImage(productIndex, index);
                });
            });
        });
    }

    showNextProductImage(productIndex) {
        const product = this.products[productIndex];
        if (!product || !product.images) return;
        
        const currentIndex = this.productImageIndices[productIndex] || 0;
        const nextIndex = (currentIndex + 1) % product.images.length;
        this.showProductImage(productIndex, nextIndex);
    }

    showPrevProductImage(productIndex) {
        const product = this.products[productIndex];
        if (!product || !product.images) return;
        
        const currentIndex = this.productImageIndices[productIndex] || 0;
        const prevIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
        this.showProductImage(productIndex, prevIndex);
    }

    showProductImage(productIndex, targetIndex) {
        const product = this.products[productIndex];
        if (!product || !product.images || targetIndex < 0 || targetIndex >= product.images.length) return;
        
        // Cập nhật chỉ số hiện tại
        this.productImageIndices[productIndex] = targetIndex;
        
        // Tìm gallery element
        const gallery = document.querySelector(`.product-image-gallery[data-product-index="${productIndex}"]`);
        if (!gallery) return;
        
        // Ẩn tất cả slides
        gallery.querySelectorAll('.product-image-slide').forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        
        // Hiển thị slide mới
        const targetSlide = gallery.querySelector(`.product-image-slide[data-index="${targetIndex}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
            targetSlide.style.display = 'block';
        }
        
        // Cập nhật pagination dots
        gallery.querySelectorAll('.product-pagination-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        const targetDot = gallery.querySelector(`.product-pagination-dot[data-index="${targetIndex}"]`);
        if (targetDot) {
            targetDot.classList.add('active');
        }
    }

    showNextMainImage() {
        const mainSlides = document.querySelectorAll('#main-image-slides .image-slide');
        if (mainSlides.length <= 1) return;
        
        const nextIndex = (this.currentMainImageIndex + 1) % mainSlides.length;
        this.showMainImage(nextIndex);
    }

    showPrevMainImage() {
        const mainSlides = document.querySelectorAll('#main-image-slides .image-slide');
        if (mainSlides.length <= 1) return;
        
        const prevIndex = this.currentMainImageIndex === 0 ? mainSlides.length - 1 : this.currentMainImageIndex - 1;
        this.showMainImage(prevIndex);
    }

    showMainImage(targetIndex) {
        const mainSlides = document.querySelectorAll('#main-image-slides .image-slide');
        const thumbnails = document.querySelectorAll('#thumbnail-slides .thumbnail-item');
        const paginationDots = document.querySelectorAll('.pagination-dot');
        
        if (targetIndex < 0 || targetIndex >= mainSlides.length) return;
        
        // Ẩn ảnh hiện tại
        mainSlides[this.currentMainImageIndex].style.display = 'none';
        
        // Hiển thị ảnh mới
        mainSlides[targetIndex].style.display = 'block';
        
        // Cập nhật active thumbnail
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        if (thumbnails[targetIndex]) {
            thumbnails[targetIndex].classList.add('active');
        }
        
        // Cập nhật pagination dots
        paginationDots.forEach(dot => {
            dot.classList.remove('active');
        });
        if (paginationDots[targetIndex]) {
            paginationDots[targetIndex].classList.add('active');
        }
        
        // Cập nhật chỉ số hiện tại
        this.currentMainImageIndex = targetIndex;
    }

    getShortDescription(description) {
        if (!description) return '';
        const firstLine = description.split('\n')[0];
        return firstLine.length > 120 ?
            firstLine.substring(0, 120) + '...' :
            firstLine;
    }

    setupEventListeners() {
        // Main gallery navigation
        document.querySelector('.swiper-button-next')?.addEventListener('click', () => {
            this.showNextMainImage();
        });
        
        document.querySelector('.swiper-button-prev')?.addEventListener('click', () => {
            this.showPrevMainImage();
        });
        
        // Thumbnail clicks
        document.querySelectorAll('#thumbnail-slides .thumbnail-item').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                if (!isNaN(index)) {
                    this.showMainImage(index);
                }
            });
        });
        
        // Pagination dot clicks
        document.querySelectorAll('.pagination-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                if (!isNaN(index)) {
                    this.showMainImage(index);
                }
            });
        });
        
        // Touch events cho mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const mainContainer = document.querySelector('.main-image-container');
        if (!mainContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        mainContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        mainContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next image
                this.showNextMainImage();
            } else {
                // Swipe right - previous image
                this.showPrevMainImage();
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