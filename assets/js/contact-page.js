function applyTranslations() {
    if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
        window.i18n.applyLanguage();
    }
}

class ContactPageSection {
    constructor() {
        this.contactData = null;
        this.jsonUrl = 'assets/data/contact-page.json'; // Tên file JSON riêng
        this.bgImageLoaded = false;  
        this.siteInfo = {};
    }

    initBackgroundImage() {
        const bgImage = new Image();
        bgImage.src = '/assets/images/quotations-bg.jpg'; // Ảnh riêng cho contact page

        bgImage.onload = () => {
            this.bgImageLoaded = true;
            console.log('✅ Contact page background image loaded');
        };

        bgImage.onerror = () => {
            console.warn('⚠️ Contact page background image not found, using fallback');
            document.querySelector('.contact-page-container')?.classList.add('no-bg-image');
        };
    }

    async init() {
        try {
            await this.loadData();
            const data = await window.loadSiteData();
            if (!data) {
                throw new Error('Không thể tải thông tin trang web');
            }

            const { site, menu } = data;
            this.siteInfo = site ? site : {}; 
            this.render();
            this.initBackgroundImage();
        } catch (error) {
            console.error('Error loading contact page:', error);
            this.renderFallback();
        }
    }

    async loadData() {
        const response = await fetch(this.jsonUrl);
        if (!response.ok) throw new Error('Failed to load contact page data');
        this.contactData = await response.json();
    }

    render() {
        const section = document.querySelector('.contact-page-section');
        if (!section || !this.contactData) return;

        section.innerHTML = this.createHTML();
        this.initForm();
        applyTranslations();
        this.initContactInfo();
    }

    createHTML() {
        const { i18nKeyTitle, i18nKeySubtitle, form, contactInfo } = this.contactData; 
        return `
            <div class="contact-page-container" id="contact-section">
                <div class="contact-page-header" data-aos="fade-up">
                    <h2 data-i18n="${i18nKeyTitle}" class="section-title">CONTACT US</h2>
                    <p data-i18n="${i18nKeySubtitle}" class="section-subtitle">Get in touch with our team for any inquiries</p>
                </div>
                
                <div class="contact-page-content" data-aos="fade-up" data-aos-delay="100">
                    <div class="contact-page-info-section">
                        <div class="contact-page-info-card" data-aos="fade-right">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <h3 data-i18n="misc.address">Address</h3>
                            <p>${this.siteInfo.address}</p>
                        </div>
                        
                        <div class="contact-page-info-card" data-aos="fade-right" data-aos-delay="50">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <h3 data-i18n="misc.phone_number">Phone</h3>
                            <p>${this.siteInfo.phone}</p>
                        </div>
                        
                        <div class="contact-page-info-card" data-aos="fade-right" data-aos-delay="100">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <h3 data-i18n="misc.email_address">Email</h3>
                            <p>${this.siteInfo.email}</p>
                        </div>
                        
                        <div class="contact-page-info-card" data-aos="fade-right" data-aos-delay="150">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <h3 data-i18n="misc.working_hours">Working Hours</h3>
                            <p>${this.siteInfo.workingHours}</p>
                        </div>
                    </div>
                    
                    <div class="contact-page-form-section" data-aos="fade-left">
                        <form id="contact-page-form" class="contact-page-form">
                            <div class="form-group">
                                <input type="text" 
                                       name="name"
                                       required
                                       data-i18n="contact.page.form.name"
                                       placeholder="FULL NAME">
                            </div>
                            
                            <div class="form-group">
                                <input type="email" 
                                       name="email"
                                       required
                                       data-i18n="contact.page.form.email"
                                       placeholder="EMAIL ADDRESS">
                            </div>
                            
                            <div class="form-group">
                                <input type="tel" 
                                       name="phone"
                                       required 
                                       placeholder="${window.i18n.t('contact.page.form.phone') || 'PHONE NUMBER'}">
                            </div>
                            
                            <div class="form-group">
                                <select name="subject" required>
                                    <option value="">${window.i18n.t('contact.page.form.select_subject') || 'Select Subject'}</option>
                                    <option value="GENERAL_INQUIRY">${window.i18n.t('contact.page.form.general_inquiry') || 'General Inquiry'}</option>
                                    <option value="PRODUCT_INFO">${window.i18n.t('contact.page.form.product_info') || 'Product Information'}</option>
                                    <option value="QUOTATION">${window.i18n.t('contact.page.form.quotation') || 'Quotation Request'}</option>
                                    <option value="PARTNERSHIP">${window.i18n.t('contact.page.form.partnership') || 'Partnership'}</option>
                                    <option value="TECH_SUPPORT">${window.i18n.t('contact.page.form.tech_support') || 'Technical Support'}</option>
                                    <option value="OTHER">${window.i18n.t('contact.page.form.other') || 'Other'}</option>
                                </select>
                            </div>
                            
                            <div class="form-group full-width">
                                <textarea name="message" 
                                          rows="5"
                                          required
                                          data-i18n="${form.message}"
                                          placeholder="YOUR MESSAGE"></textarea>
                            </div>
                            
                            <button type="submit" class="submit-btn contact-page-submit-btn">
                                <span data-i18n="${form.button}">SEND MESSAGE</span>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    initForm() {
        const form = document.getElementById('contact-page-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: form.querySelector('[name="name"]').value,
                email: form.querySelector('[name="email"]').value,
                phone: form.querySelector('[name="phone"]').value,
                subject: form.querySelector('[name="subject"]').value,
                message: form.querySelector('[name="message"]').value,
                date: new Date().toISOString(),
                language: window.currentLanguage || 'en'
            };

            if (!this.validateForm(formData)) {
                return;
            }

            this.sendViaMailto(formData);
        });
    }

    sendViaMailto(data) {
        const subject = `[CONTACT FORM] - ${this.getSubjectText(data.subject)} - ${this.siteInfo.siteName}`;

        const body = `
================ CONTACT FORM SUBMISSION ================

📋 CONTACT INFORMATION:
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}
• Subject: ${this.getSubjectText(data.subject)}
• Submission Date: ${new Date(data.date).toLocaleString()}
• Language: ${data.language}

📝 MESSAGE:
${data.message}

===============================================
Generated from ${this.siteInfo.siteName} Contact Page
        `.trim();

        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        const mailtoLink = `mailto:${this.siteInfo.email}?subject=${encodedSubject}&body=${encodedBody}`;

        window.location.href = mailtoLink;
        this.showSuccess();

        setTimeout(() => {
            document.getElementById('contact-page-form')?.reset();
        }, 1000);

        this.trackMailSubmission(data);
    }

    getSubjectText(subjectKey) {
        const subjects = {
            'GENERAL_INQUIRY': 'General Inquiry',
            'PRODUCT_INFO': 'Product Information',
            'QUOTATION': 'Quotation Request',
            'PARTNERSHIP': 'Partnership',
            'TECH_SUPPORT': 'Technical Support',
            'OTHER': 'Other'
        };
        return subjects[subjectKey] || subjectKey;
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

        if (!data.subject) {
            this.showError('Please select a subject');
            return false;
        }

        if (!data.message || data.message.trim().length < 10) {
            this.showError('Please enter a message (minimum 10 characters)');
            return false;
        }

        return true;
    }

    showSuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'contact-page-message success';
        successMsg.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span data-i18n="contact.page.form.success">Thank you! Email client is opening...</span>
        `;

        const form = document.getElementById('contact-page-form');
        form.parentNode.insertBefore(successMsg, form);
        applyTranslations();

        setTimeout(() => successMsg.remove(), 5000);
    }

    showError(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'contact-page-message error';
        errorMsg.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        const form = document.getElementById('contact-page-form');
        form.parentNode.insertBefore(errorMsg, form);

        setTimeout(() => errorMsg.remove(), 5000);
    }

    trackMailSubmission(data) {
        console.log('Contact page mailto submission:', {
            ...data,
            timestamp: new Date().toISOString(),
            method: 'mailto',
            page: 'contact'
        });

        if (typeof gtag !== 'undefined') {
            gtag('event', 'mailto_contact', {
                'event_category': 'engagement',
                'event_label': data.subject,
                'value': 1
            });
        }
    }

    initContactInfo() {
        // Có thể thêm các chức năng bổ sung cho thông tin liên hệ
        console.log('Contact info initialized');
    }

    renderFallback() {
        const section = document.querySelector('.contact-page-section');
        if (!section) return;

        section.innerHTML = `
            <div class="contact-page-container">
                <div class="contact-page-header">
                    <h2>CONTACT US</h2>
                    <p>Get in touch with our team for any inquiries</p>
                </div>
                
                <div class="contact-page-content">
                    <div class="contact-page-info-section">
                        <div class="contact-page-info-card">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Address</h3>
                            <p>123 Street, District 1, Ho Chi Minh City, Vietnam</p>
                        </div>
                        
                        <div class="contact-page-info-card">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <h3>Phone</h3>
                            <p>+84 28 1234 5678</p>
                        </div>
                        
                        <div class="contact-page-info-card">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <h3>Email</h3>
                            <p></p>
                        </div>
                        
                        <div class="contact-page-info-card">
                            <div class="contact-page-info-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <h3>Working Hours</h3>
                            <p>Mon-Fri: 8:00 AM - 5:00 PM</p>
                        </div>
                    </div>
                    
                    <div class="contact-page-form-section">
                        <form class="contact-page-form">
                            <input type="text" placeholder="FULL NAME" required>
                            <input type="email" placeholder="EMAIL ADDRESS" required>
                            <input type="tel" placeholder="PHONE NUMBER" required>
                            <select required>
                                <option value="">SELECT SUBJECT</option>
                                <option>General Inquiry</option>
                                <option>Product Information</option>
                                <option>Quotation Request</option>
                                <option>Partnership</option>
                                <option>Technical Support</option>
                                <option>Other</option>
                            </select>
                            <textarea placeholder="YOUR MESSAGE" rows="5" required></textarea>
                            <button type="submit">SEND MESSAGE</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize contact page
document.addEventListener('DOMContentLoaded', () => {
    const contactPageSection = new ContactPageSection();
    contactPageSection.init();
});