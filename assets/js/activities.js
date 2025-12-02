// activities.js
// Apply translations after render
function applyTranslations() {
    if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
        window.i18n.applyLanguage();
    }
}
class ActivitiesSection {
    constructor() {
        this.activitiesData = null;
        this.jsonUrl = 'assets/data/activities.json'; // Đường dẫn đến JSON
    }

    async init() {
        try {
            // Load data từ JSON
            await this.loadData();

            // Render section
            this.render();
        } catch (error) {
            console.error('Error loading activities:', error);
            this.renderFallback();
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
        const section = document.getElementById('home-activities');

        if (!section || !this.activitiesData) return;

        section.innerHTML = this.createHTML();
        this.initHoverEffects();
        // Apply translations
        applyTranslations();
    }

    createHTML() {
        const { i18nKeyTitle, i18nKeySubtitle, activities } = this.activitiesData;

        return `
            <div class="activities-container"  id="get-activities">
                <div class="activities-header"> 
                    <h2  data-i18n="${`activities.${i18nKeyTitle}`}"  class="section-title">${i18nKeyTitle}</h2>
                    <p data-i18n="${`activities.${i18nKeySubtitle}`}"  class="section-subtitle">${i18nKeySubtitle}</p>
                </div>
                
                <div class="activities-grid">
                    ${activities.map(activity => this.createCardHTML(activity)).join('')}
                </div>
            </div>
        `;
    }

    createCardHTML(activity) {
        const imageClass = activity.image_style || '';
        return `
            <div class="activity-card ${imageClass}" data-id="${activity.id}">
                <div class="card-inner">
                    <div class="card-front"> 
                        <div class="card-titles">
                            <h3 data-i18n="${`activities.data.${activity.i18nKeyTitle}.title`}" class="card-title">${activity.title}</h3> 
                        </div>
                        <div class="card-image">
                            <img src="${activity.image}" 
                                 alt="${`activities.${activity.i18nKeyTitle}.title`}"
                                 loading="lazy"
                                 onerror="this.src='/assets/images/fallback.jpg'">
                        </div>
                        <p  data-i18n="${`activities.data.${activity.i18nKeyTitle}.description`}"  class="card-description">${activity.description}</p>
                        <div class="card-cta">
                            <span data-i18n="misc.view_details">Xem chi tiết</span>
                            <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>
                    
                    <div class="card-back">
                        <h4  data-i18n="${`activities.data.${activity.i18nKeyTitle}.title`}" >Chi tiết</h4>
                        <ul class="details-list">
                            ${activity.details.map(detail => `<li data-i18n="${`activities.data.${activity.i18nKeyTitle}.details.${detail}`}">${detail}</li>`).join('')}
                        </ul>
                        <button class="close-details">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    initHoverEffects() {
        const cards = document.querySelectorAll('.activity-card');

        cards.forEach(card => {
            // Click để toggle flip
            card.addEventListener('click', (e) => {
                // Không flip nếu click vào nút close
                if (e.target.closest('.close-details')) {
                    card.classList.remove('flipped');
                    e.stopPropagation();
                    return;
                }

                // Đóng tất cả card khác trước
                cards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('flipped')) {
                        otherCard.classList.remove('flipped');
                    }
                });

                // Toggle card hiện tại
                card.classList.toggle('flipped');
            });
        });

        // Đóng card khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.activity-card')) {
                cards.forEach(card => {
                    card.classList.remove('flipped');
                });
            }
        });
    }
    renderFallback() {
        const section = document.getElementById('home-activities');

        if (!section) return;
        section.innerHTML = `
            <div class="activities-container">
                <div class="activities-header"> 
                    <h2 class="section-title">LĨNH VỰC HOẠT ĐỘNG</h2>
                    <p class="section-subtitle">Chuyên nghiệp trong từng khâu sản xuất và phân phối</p>
                </div>
                
                <div class="activities-grid">
                    <div class="activity-card"> 
                        <h3>SẢN XUẤT</h3>
                        <div class="card-title-en">PRODUCTION</div>
                        <p>Sản xuất nguyên liệu chất lượng cao với công nghệ hiện đại.</p>
                    </div>
                    
                    <div class="activity-card"> 
                        <h3>XUẤT KHẨU</h3>
                        <div class="card-title-en">EXPORT</div>
                        <p>Xuất khẩu sản phẩm đến các thị trường khó tính.</p>
                    </div>
                    
                    <div class="activity-card"> 
                        <h3>THƯƠNG MẠI</h3>
                        <div class="card-title-en">TRADING</div>
                        <p>Phân phối nguyên liệu chuyên nghiệp trên toàn quốc.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const activitiesSection = new ActivitiesSection();
    activitiesSection.init();
});