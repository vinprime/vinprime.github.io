// quotation.js
function applyTranslations() {
    if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
        window.i18n.applyLanguage();
    }
}

class QuotationSection {
    constructor() {
        this.quotationData = null;
        this.jsonUrl = 'assets/data/quotation.json';
        this.bgImageLoaded = false;
        this.companyEmail = 'sales@vinprime.com'; // Thay bằng email công ty thật
        this.companyName = 'VinPrime';
    }
    // Thêm method để kiểm tra ảnh
    initBackgroundImage() {
        const bgImage = new Image();
        bgImage.src = '/assets/images/quotations-bg.jpg';

        bgImage.onload = () => {
            this.bgImageLoaded = true;
            console.log('✅ Background image loaded');
        };

        bgImage.onerror = () => {
            console.warn('⚠️ Background image not found, using fallback');
            document.querySelector('.quotation-container')?.classList.add('no-bg-image');
        };
    }
    async init() {
        try {
            await this.loadData();
            // Load data
            const data = await window.loadSiteData();
            if (!data) {
                throw new Error('Không thể tải thông tin trang web');
            }

            const { site, menu } = data;
            this.companyEmail = site.email;
            this.companyName = site.siteName;
            this.render();
            this.initBackgroundImage(); // Thêm dòng này
        } catch (error) {
            console.error('Error loading quotation:', error);
            this.renderFallback();
        }
    }

    async loadData() {
        const response = await fetch(this.jsonUrl);
        if (!response.ok) throw new Error('Failed to load quotation data');
        this.quotationData = await response.json();
    }

    render() {
        const section = document.getElementById('home-quotation');
        if (!section || !this.quotationData) return;

        section.innerHTML = this.createHTML();
        this.initForm();
        applyTranslations();
    }

    createHTML() {
        const { i18nKeyTitle, i18nKeySubtitle, form } = this.quotationData;

        return `
            <div class="quotation-container" id="quotation">
                <div class="quotation-header">
                    <h2 data-i18n="${i18nKeyTitle}" class="section-title">GET QUOTATION</h2>
                    <p data-i18n="${i18nKeySubtitle}" class="section-subtitle">Get the best price for our high-quality products</p>
                </div>
                
                <form id="quotation-form" class="quotation-form">
                    <div class="form-group">
                        <input type="text" 
                               name="name"
                               required
                               data-i18n="${form.name}"
                               placeholder="NAME">
                    </div>
                    
                    <div class="form-group">
                        <input type="email" 
                               name="email"
                               required
                               data-i18n="${form.email}"
                               placeholder="EMAIL">
                    </div>
                    
                    <div class="form-group">
                        <input type="tel" 
                               name="phone"
                               required
                               data-i18n="${form.phone}"
                               placeholder="PHONE NUMBER">
                    </div>
                    
                    <div class="form-group">
                        <select name="product" required>
                            <option value="" data-i18n="quotation.form.select_product">Select a product</option>
                            <option value="CORN SILAGE" data-i18n="products.corn_silage">CORN SILAGE</option>
                            <option value="CORN COB MEAL" data-i18n="products.corn_cob_meal">CORN COB MEAL</option>
                            <option value="CORN COB PELLET" data-i18n="products.corn_cob_pellet">CORN COB PELLET</option>
                            <option value="PINE SAWDUST BLOCK" data-i18n="products.pine_sawdust_block">PINE SAWDUST BLOCK</option>
                            <option value="ACACIA SAWDUST PELLET" data-i18n="products.acacia_sawdust_pellet">ACACIA SAWDUST PELLET</option>
                            <option value="DRIED BAGASSE" data-i18n="products.dried_bagasse">DRIED BAGASSE</option>
                            <option value="PINEAPPLE SILAGE" data-i18n="products.pineapple_silage">PINEAPPLE SILAGE</option>
                            <option value="OTHER" data-i18n="products.other">OTHER</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        <span data-i18n="${form.button}">SEND NOW</span>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;
    }

    initForm() {
        const form = document.getElementById('quotation-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: form.querySelector('[name="name"]').value,
                email: form.querySelector('[name="email"]').value,
                phone: form.querySelector('[name="phone"]').value,
                product: form.querySelector('[name="product"]').value,
                date: new Date().toISOString()
            };

            // Validate
            if (!this.validateForm(formData)) {
                return;
            }

            // Gửi qua mailto
            this.sendViaMailto(formData);
        });
    }
    sendViaMailto(data) {
        // Tạo subject
        const subject = `[QUOTATION REQUEST] - ${data.product} - ${this.companyName}`;

        // Tạo email body với định dạng đẹp
        const body = `
================ QUOTATION REQUEST ================

📋 CLIENT INFORMATION:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}
• Request Date: ${data.date}

🛒 PRODUCT REQUESTED:
• Product: ${data.product}
• Language: ${data.language}

📝 MESSAGE:
Dear ${this.companyName} Team,

I would like to request a quotation for "${data.product}".
Please send me the detailed price and specifications.

Looking forward to your response.

Best regards,
${data.name}

===============================================
Generated from ${this.companyName} Website
        `.trim();

        // Mã hóa cho mailto link
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);

        // Tạo mailto link
        const mailtoLink = `mailto:${this.companyEmail}?subject=${encodedSubject}&body=${encodedBody}`;

        // Mở email client
        window.location.href = mailtoLink;

        // Hiển thị thông báo thành công
        this.showSuccess();

        // Reset form (optional)
        setTimeout(() => {
            document.getElementById('quotation-form')?.reset();
        }, 1000);

        // Track submission
        this.trackMailSubmission(data);
    }

    validateForm(data) {
        if (!data.name || data.name.trim().length < 2) {
            this.showError('Please enter your name');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showError('Please enter a valid email');
            return false;
        }

        if (!data.phone || data.phone.trim().length < 9) {
            this.showError('Please enter a valid phone number');
            return false;
        }

        if (!data.product) {
            this.showError('Please select a product');
            return false;
        }

        return true;
    }

    showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'quotation-message success';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span data-i18n="quotation.form.success">Thank you! Email client is opening...</span>
        `;

        const form = document.getElementById('quotation-form');
        form.parentNode.insertBefore(successMsg, form);
        applyTranslations();

        setTimeout(() => successMsg.remove(), 5000);
    }

    showError(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'quotation-message error';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        const form = document.getElementById('quotation-form');
        form.parentNode.insertBefore(errorMsg, form);

        setTimeout(() => errorMsg.remove(), 5000);
    }

    trackMailSubmission(data) {
        console.log('Mailto submission:', {
            ...data,
            timestamp: new Date().toISOString(),
            method: 'mailto'
        });

        // Gửi event đến Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mailto_quotation', {
                'event_category': 'engagement',
                'event_label': data.product,
                'value': 1
            });
        }
    }

    showLoading() {
        const btn = document.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `
                <span data-i18n="quotation.form.sending">Sending...</span>
                <i class="fas fa-spinner fa-spin"></i>
            `;
            applyTranslations();
        }
    }

    hideLoading() {
        const btn = document.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `
                <span data-i18n="quotation.form.button">SEND NOW</span>
                <i class="fas fa-paper-plane"></i>
            `;
            applyTranslations();
        }
    }


    renderFallback() {
        const section = document.getElementById('home-quotation');
        if (!section) return;

        section.innerHTML = `
            <div class="quotation-container">
                <div class="quotation-header">
                    <h2>GET QUOTATION</h2>
                    <p>Get the best price for our high-quality products</p>
                </div>
                
                <form class="quotation-form">
                    <input type="text" placeholder="NAME" required>
                    <input type="email" placeholder="EMAIL" required>
                    <input type="tel" placeholder="PHONE NUMBER" required>
                    <select required>
                        <option value="">SELECT PRODUCT</option>
                        <option>CORN SILAGE</option>
                        <option>CORN COB MEAL</option>
                        <option>CORN COB PELLET</option>
                        <option>PINE SAWDUST BLOCK</option>
                        <option>ACACIA SAWDUST PELLET</option>
                        <option>DRIED BAGASSE</option>
                        <option>PINEAPPLE SILAGE</option>
                    </select>
                    <button type="submit">SEND NOW</button>
                </form>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const quotationSection = new QuotationSection();
    quotationSection.init();
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