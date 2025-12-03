// activities-page.js
class ActivitiesPage {
    constructor() {
        this.activitiesData = null;
        this.jsonUrl = 'assets/data/activities.json';
        this.currentActivity = null;
    }

    async init() {
        try {
            // Show skeleton loading
            this.showSkeleton();

            // Load breadcrumb
            this.loadBreadcrumb();

            // Load data
            await this.loadData();

            // Render content
            this.render();

            // Initialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    once: true
                });
            }

            // Hide skeleton and show content
            setTimeout(() => {
                this.hideSkeleton();
                this.showContent();
            }, 500);

        } catch (error) {
            console.error('Error loading activities page:', error);
            this.renderFallback();
        }
    }

    showSkeleton() {
        const skeleton = document.querySelector('.activities-loading');
        if (skeleton) {
            skeleton.classList.add('active');
        }
    }

    hideSkeleton() {
        const skeleton = document.querySelector('.activities-loading');
        if (skeleton) {
            skeleton.classList.remove('active');
        }
    }

    showContent() {
        const content = document.querySelector('.activities-content');
        if (content) {
            content.style.display = 'block';
        }
    }

    loadBreadcrumb() {
        const breadcrumbEl = document.getElementById('activities-breadcrumb');
        if (breadcrumbEl) {
            breadcrumbEl.innerHTML = `
                <ol>
                    <li><a href="/" data-i18n="breadcrumb.home">Trang chủ</a></li>
                    <li><span data-i18n="breadcrumb.activities">Hoạt động</span></li>
                </ol>
            `;
        }
    }

    async loadData() {
        const response = await fetch(this.jsonUrl);
        if (!response.ok) {
            throw new Error('Failed to load activities data');
        }
        this.activitiesData = await response.json();
    }

    render() {
        this.renderNavigation();
        this.renderActivities();
        this.initEventListeners();
        this.applyTranslations();
    }

    renderNavigation() {
        const navEl = document.getElementById('activities-navigation');
        if (!navEl || !this.activitiesData) return;

        const { activities } = this.activitiesData; 
        navEl.innerHTML = `
            <div class="activities-navigation-title">
                <i class="fas fa-list"></i>
                <span data-i18n="misc.groupNavigation">Lĩnh vực hoạt động</span>
            </div>
            <div class="activities-nav-links">
                ${activities.map((activity, index) => `
                    <a href="#${activity.i18nKeyTitle}" 
                       class="activity-nav-link ${index === 0 ? 'active' : ''}" 
                       data-activity="${activity.id}">
                        <i class="${activity.icon || 'fas fa-briefcase'}"></i>
                        <span data-i18n="${`activities.data.${activity.i18nKeyTitle}.title`}">
                            ${activity.title}
                        </span>
                    </a>
                `).join('')}
            </div>
        `;
    }

    renderActivities() {
        const container = document.getElementById('activities-list');
        if (!container || !this.activitiesData) return;
        const { activities } = this.activitiesData;
        container.innerHTML = activities.map(activity => `
            <section class="activity-section" id="${activity.i18nKeyTitle}" data-aos="fade-up">
                <div class="activity-header">
                    <div class="activity-title-container">
                        <div class="activity-icon">
                            <i class="${activity.icon || 'fas fa-briefcase'}"></i>
                        </div>
                        <h2 class="activity-title" data-i18n="${`activities.data.${activity.i18nKeyTitle}.title`}">
                            ${activity.title}
                        </h2>
                    </div>
                </div>
                
                <div class="activity-content activity-bg-image" style="--activity-bg-image: url('${activity.image}')">
                    <div class="activity-description" data-i18n="${`activities.data.${activity.i18nKeyTitle}.description`}">
                        ${activity.description}
                    </div>
                    
                    ${activity.details && activity.details.length > 0 ? `
                        <div class="activity-details">
                            <h3 class="details-title">
                                <i class="fas fa-list-check"></i>
                                <span data-i18n="${`activities.data.${activity.i18nKeyTitle}.detailsTitle`}">Chi tiết hoạt động</span>
                            </h3>
                            <ul class="details-list">
                                ${activity.details.map((detail, index) => `
                                    <li class="details-item">
                                        <i class="fas fa-check-circle"></i>
                                        <span data-i18n="${`activities.data.${activity.i18nKeyTitle}.details.${index}`}">
                                            ${detail}
                                        </span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    ${activity.highlights && activity.highlights.length > 0 ? `
                        <div class="activity-highlights">
                            ${activity.highlights.map(highlight => `
                                <div class="highlight-card" data-aos="zoom-in">
                                    <div class="highlight-icon">
                                        <i class="${highlight.icon || 'fas fa-star'}"></i>
                                    </div>
                                    <h4 class="highlight-title" data-i18n="${`activities.data.${activity.i18nKeyTitle}.highlights.${highlight.key}.title`}">
                                        ${highlight.title}
                                    </h4>
                                    <p class="highlight-description" data-i18n="${`activities.data.${activity.i18nKeyTitle}.highlights.${highlight.key}.description`}">
                                        ${highlight.description}
                                    </p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </section>
        `).join('');
    }

    initEventListeners() {
        // Navigation click
        document.querySelectorAll('.activity-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Update active nav
                    document.querySelectorAll('.activity-nav-link').forEach(l => {
                        l.classList.remove('active');
                    });
                    link.classList.add('active');
                    
                    // Scroll to section
                    const navHeight = document.querySelector('.activities-navigation').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', this.updateActiveNav.bind(this));

        // Back to top
        const backToTopBtn = document.querySelector('.back-to-top-btn');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('.activity-section');
        const navLinks = document.querySelectorAll('.activity-nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop >= (sectionTop - 150) && 
                scrollTop < (sectionTop + sectionHeight - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    applyTranslations() {
        if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
            window.i18n.applyLanguage();
        }
    }

    renderFallback() {
        this.hideSkeleton();
        this.showContent();
        
        const container = document.getElementById('activities-list');
        if (container) {
            container.innerHTML = `
                <div class="empty-activities" data-aos="fade-up">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3 data-i18n="activities.loadError">Không thể tải dữ liệu hoạt động</h3>
                    <p data-i18n="activities.tryAgain">Vui lòng thử lại sau hoặc liên hệ với chúng tôi</p>
                </div>
            `;
        }
        
        this.applyTranslations();
    }
}

// Initialize activities page
document.addEventListener('DOMContentLoaded', () => {
    const activitiesPage = new ActivitiesPage();
    activitiesPage.init();
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