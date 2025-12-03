// assets/js/i18n.js - COMPLETE AND WORKING VERSION
class I18n {
    constructor() {
        this.translations = {};
        // this.currentLang = this.getSavedLanguage() || this.detectLanguage() || 'ja'; 
        this.currentLang = this.getSavedLanguage() || 'ja';
        this.isLoading = false;
        this.initialized = false;

        console.log('🎯 I18n class initialized');
        console.log('📝 Current language:', this.currentLang);
    }

    async init() {
        if (this.initialized) {
            console.log('ℹ️ i18n already initialized');
            return;
        }

        console.log('🌐 Initializing i18n system...');
        try {
            await this.loadLanguage(this.currentLang);
            this.applyLanguage();
            this.setupLanguageSwitcher();
            this.initialized = true;
            console.log(`✅ i18n initialized with language: ${this.currentLang}`);
        } catch (error) {
            console.error('❌ Failed to initialize i18n:', error);
        }
    }

    getSavedLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        console.log('📖 Saved language from localStorage:', savedLang);
        return savedLang;
    }

    saveLanguage(lang) {
        localStorage.setItem('preferred-language', lang);
        console.log('💾 Language saved to localStorage:', lang);
    }

    detectLanguage() {
        // Detect from browser
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.split('-')[0];

        console.log('🔍 Browser language detected:', browserLang, 'Short:', shortLang);

        // Supported languages - chỉ dùng 'ja' cho tiếng Nhật
        const supported = ['ja', 'vi', 'en'];

        if (supported.includes(shortLang)) {
            console.log('✅ Browser language is supported:', shortLang);
            return shortLang; // sẽ trả về 'ja' cho tiếng Nhật
        }

        // Default logic
        if (browserLang.includes('vi')) {
            console.log('📝 Final detected language: vi');
            return 'vi';
        }

        // Kiểm tra tiếng Nhật trong chuỗi đầy đủ
        if (browserLang.includes('ja')) {
            console.log('📝 Final detected language: ja');
            return 'ja';
        }

        console.log('📝 Final detected language: en');
        return 'en';
    }

    async loadLanguage(lang) {
        try {
            console.log(`🔄 Loading language file: ${lang}.json`);
            this.isLoading = true;

            const response = await fetch(`assets/data/locales/${lang}.json`);

            if (!response.ok) {
                throw new Error(`Language file not found: ${lang}`);
            }

            this.translations = await response.json();
            this.currentLang = lang;
            this.saveLanguage(lang);

            console.log(`✅ Loaded language: ${lang}`);
            console.log('📊 Translations loaded:', Object.keys(this.translations));
            return true;

        } catch (error) {
            console.error('❌ Error loading language:', error);

            // Fallback to Vietnamese
            if (lang !== 'vi') {
                console.log('🔄 Falling back to Vietnamese...');
                return await this.loadLanguage('vi');
            }

            // Even if Vietnamese fails, create empty translations
            console.log('⚠️ Creating empty translations as fallback');
            this.translations = {};
            return false;
        } finally {
            this.isLoading = false;
        }
    }

    t(key, params = {}) {
        // Navigate through nested keys: "nav.home" -> translations.nav.home
        const keys = key.split('.');
        let value = this.translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`⚠️ Translation key not found: ${key}`);
                return `[${key}]`;
            }
        }

        // Replace parameters if any
        if (params && typeof value === 'string') {
            Object.keys(params).forEach(param => {
                // Support both {param} and {{param}} formats 
                value = value.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
                value = value.replace(new RegExp(`{${param}}`, 'g'), params[param]);
            });
        }

        return value;
    }

    // Trong function applyLanguage() - sửa phần console.log
    applyLanguage() {
        console.log('🎨 Applying language to DOM...');

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        console.log('📝 Updated html lang attribute:', this.currentLang);

        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`🔍 Found ${elements.length} elements with data-i18n`);

        elements.forEach((element, index) => {
            const key = element.getAttribute('data-i18n');

            // Parse parameters if they exist
            let params = {};
            const paramsAttr = element.getAttribute('data-i18n-params');

            if (paramsAttr) {
                try {
                    params = JSON.parse(paramsAttr);
                } catch (error) {
                    console.warn(`⚠️ Failed to parse data-i18n-params for key "${key}":`, paramsAttr, error);
                }
            }

            // Handle special syntax: [attr]key
            const match = key.match(/^\[(\w+)\](.+)$/);

            if (match) {
                const [, attr, actualKey] = match;
                const translation = this.t(actualKey, params);

                // Kiểm tra translation có tồn tại không
                if (translation !== undefined) {
                    element.setAttribute(attr, translation);
                    console.log(`📝 Set attribute [${index}]: ${attr}="${actualKey}" ->`, translation);
                }
            } else {
                // Get translation with parameters
                const translation = this.t(key, params);

                // Kiểm tra translation có phải string không
                if (translation === undefined || translation === null) {
                    console.warn(`⚠️ Translation is undefined/null for key: ${key}`);
                    return;
                }

                const translationStr = String(translation);

                if (translationStr === `[${key}]`) {
                    console.warn(`⚠️ Could not translate: ${key}`);
                }

                // Handle different element types
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translationStr;
                    console.log(`📝 Set placeholder [${index}]: ${key} ->`,
                        translationStr.length > 30 ? translationStr.substring(0, 30) + '...' : translationStr);
                } else if (element.tagName === 'IMG') {
                    element.alt = translationStr;
                    console.log(`📝 Set alt [${index}]: ${key} ->`, translationStr);
                } else if (element.hasAttribute('title')) {
                    element.title = translationStr;
                    console.log(`📝 Set title [${index}]: ${key} ->`, translationStr);
                } else if (element.hasAttribute('aria-label')) {
                    element.setAttribute('aria-label', translationStr);
                    console.log(`📝 Set aria-label [${index}]: ${key} ->`, translationStr);
                } else {
                    element.textContent = translationStr;
                    console.log(`📝 Set text [${index}]: ${key} ->`,
                        translationStr.length > 50 ? translationStr.substring(0, 50) + '...' : translationStr);
                }
            }
        });

        // Update language switcher if exists
        this.updateLanguageSwitcher();

        // Dispatch custom event - CHỈ KHI NGÔN NGỮ THAY ĐỔI, không phải khi init
        if (!this._applyingLanguage) {
            this._applyingLanguage = true;
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang: this.currentLang }
            }));
            this._applyingLanguage = false;
        }

        console.log('✅ Language applied to DOM');
    }

    setupLanguageSwitcher() {
        console.log('🎛️ Setting up language switcher...');

        // Create language switcher if not exists
        let switcher = document.querySelector('.language-switcher');

        if (!switcher) {
            switcher = document.createElement('div');
            switcher.className = 'language-switcher';
            document.body.appendChild(switcher);
            console.log('✅ Created language switcher element');
        }

        // Update switcher
        this.updateLanguageSwitcher();
    }

    updateLanguageSwitcher() {
        const switcher = document.querySelector('.language-switcher');
        if (!switcher) {
            console.log('⚠️ Language switcher element not found');
            return;
        }

        const languages = {
            'vi': { name: '🇻🇳 Tiếng Việt', short: 'VI' },
            'en': { name: '🇺🇸 English', short: 'EN' },
            'ja': { name: '🇯🇵 日本語', short: 'JA' }
        };


        console.log('🔄 Updating language switcher UI');

        switcher.innerHTML = `
            <div class="language-dropdown">
                <button class="current-language" aria-label="Change language">
                    ${languages[this.currentLang]?.short || this.currentLang.toUpperCase()}
                </button>
                <div class="language-menu">
                    ${Object.entries(languages).map(([code, lang]) => `
                        <button class="language-option ${code === this.currentLang ? 'active' : ''}" 
                                data-lang="${code}"
                                aria-label="${lang.name}">
                            ${lang.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        switcher.querySelectorAll('.language-option').forEach(button => {
            button.addEventListener('click', async (e) => {
                const lang = e.target.getAttribute('data-lang');
                console.log(`🌐 User clicked to change language to: ${lang}`);
                if (lang && lang !== this.currentLang) {
                    await this.changeLanguage(lang);
                }
            });
        });

        console.log('✅ Language switcher updated');
    }

    async changeLanguage(lang) {
        if (this.isLoading) {
            console.log('⏳ i18n is already loading, skipping...');
            return;
        }

        console.log(`🔄 Changing language to: ${lang}`);

        // Show loading indicator
        document.body.classList.add('language-changing');

        try {
            await this.loadLanguage(lang);
            this.applyLanguage();

            // Update page content based on current page
            await this.updatePageContent();

            console.log(`✅ Language changed to: ${lang}`);

        } catch (error) {
            console.error('❌ Error changing language:', error);
        } finally {
            document.body.classList.remove('language-changing');
        }
    }

    async updatePageContent() {
        console.log('🔄 Updating page content for new language...');

        const page = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📄 Current page:', page);

        switch (page) {
            case 'index.html':
                if (typeof updateHomeContent === 'function') {
                    console.log('🏠 Updating home page content...');
                    await updateHomeContent();
                }
                break;

            case 'all-products-page.html':
                if (typeof updateProductsContent === 'function') {
                    console.log('📦 Updating products page content...');
                    await updateProductsContent();
                }
                break;

            case 'about-page.html':
                if (typeof updateAboutContent === 'function') {
                    console.log('🏢 Updating about page content...');
                    await updateAboutContent();
                }
                break;

            case '404.html':
                if (typeof update404Content === 'function') {
                    console.log('❌ Updating 404 page content...');
                    await update404Content();
                }
                break;

            default:
                console.log(`ℹ️ No specific update function for page: ${page}`);
        }
    }
}

// Create instance immediately
console.log('🚀 Creating i18n instance...');
const i18nInstance = new I18n();

// Assign to window object
window.i18n = i18nInstance;
console.log('✅ window.i18n assigned:', typeof window.i18n !== 'undefined');

// Helper function for template literals
// Helper function for template literals với params
window.__ = (key, params = {}) => {
    if (window.i18n) {
        return window.i18n.t(key, params) || key;
    }
    // Nếu không có params, trả về key
    if (Object.keys(params).length === 0) {
        return key;
    }
    // Nếu có params nhưng không có i18n, format cơ bản
    let result = key;
    Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    });
    return result;
};

// Add debug info
console.log('🎯 i18n.js loaded successfully');
console.log('📋 Available on window.i18n:', window.i18n);
console.log('🔧 Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.i18n)));

// KHÔNG CÓ export/import ở đây - đây là global script