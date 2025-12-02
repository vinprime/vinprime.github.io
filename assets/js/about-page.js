// about-page.js
function applyTranslations() {
  if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
    window.i18n.applyLanguage();
  }
}

class AboutPage {
  constructor() {
    this.aboutData = null;
    this.siteInfo = null;
    this.aboutJsonUrl = 'assets/data/about.json';
    this.siteInfoJsonUrl = 'assets/data/siteInfo.json';
  }

  async init() {
    try {
      await Promise.all([this.loadAboutData(), this.loadSiteInfo()]);
      this.render();
      this.hideSkeleton();
    } catch (error) {
      console.error('Error loading data:', error);
      this.renderFallback();
      this.hideSkeleton();
    }
  }

  async loadAboutData() {
    const response = await fetch(this.aboutJsonUrl);
    if (!response.ok) throw new Error('Failed to load about data');
    this.aboutData = await response.json();
  }

  async loadSiteInfo() {
    const response = await fetch(this.siteInfoJsonUrl);
    if (!response.ok) throw new Error('Failed to load site info');
    this.siteInfo = await response.json();
  }

  hideSkeleton() {
    const skeleton = document.querySelector('.skeleton-loading');
    const realContent = document.querySelector('.real-content');

    if (skeleton && realContent) {
      skeleton.classList.remove('active');
      skeleton.style.display = 'none';
      realContent.style.display = 'block';
    }
  }

  render() {
    const section = document.querySelector('.about-page-section');
    if (!section || !this.aboutData || !this.siteInfo) return;

    section.innerHTML = this.createHTML();

    // Khởi tạo AOS animation
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }

    applyTranslations();
  }
  getRandomCardImage() {
    if (!this.aboutData?.about?.image_card_src_random ||
      !Array.isArray(this.aboutData.about.image_card_src_random)) {
      return '';
    }

    const images = this.aboutData.about.image_card_src_random;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }
  createHTML() {
    const aboutData = this.aboutData.about;
    const siteInfo = this.siteInfo;
    const images = this.aboutData.about.image_card_src_random;
    const missionBgImage = images[0];
    const visionBgImage = images[1];
    return `
      <div class="about-container">
        <!-- Hero Section -->
        <section class="about-hero" data-aos="fade-up">
          <div class="hero-image">
            <img src="${aboutData.image_intro_src}" 
                 alt="VinPrime - About Us"
                 loading="lazy"
                 onerror="this.src='/assets/images/about/default-hero.jpg'">
          </div>
          <div class="hero-content"> 
            <h1 data-i18n="home.aboutTitle" class="hero-title">Về VinPrime</h1>
            <p data-i18n="home.heroSub" class="hero-subtitle">Cung cấp nguyên liệu sạch, chất lượng cao cho ngành chăn nuôi và công nghiệp</p>
          </div>
        </section>
        <!-- Company About -->
        <section class="company-about-section" data-aos="fade-up">
          <div class="about-page-content">
            <div class="about-page-header">
              <div class="title-decoration"> 
                <h2 class="section-title" data-i18n="about.about.title">VIN PRIME - SỨ MỆNH VÀ TẦM NHÌN</h2>
              </div>
            </div>
            
            <div class="about-page-description">
              <p class="lead-text" data-i18n="about.about.description">VIN PRIME ra đời với sứ mệnh mang tinh hoa nguyên liệu Việt vươn tầm quốc tế...</p>
            </div>
          </div>
        </section>
        <!-- Company Info -->
        <section class="company-info-section" data-aos="fade-up">
          <h2  data-i18n="misc.company_info" class="section-title">Thông Tin Công Ty</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.company_name">Tên công ty</h3>
                <p>${siteInfo.siteName}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.address">Địa chỉ</h3>
                <p>${siteInfo.address}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.phone_number">Điện thoại</h3>
                <p><a href="tel:${siteInfo.phone.replace(/\s+/g, '')}">${siteInfo.phone}</a></p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.email_address">Email</h3>
                <p><a href="mailto:${siteInfo.email}">${siteInfo.email}</a></p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-file-invoice"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.tax_code">Mã số thuế</h3>
                <p>${siteInfo.taxCode}</p>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="info-content">
                <h3 data-i18n="misc.working_hours">Giờ làm việc</h3>
                <p>${siteInfo.workingHours}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Mission & Vision -->
        <section class="mission-vision-section" data-aos="fade-up">
          <div class="mission-card" style="background-image:   url('${missionBgImage}')">
            <div class="icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <h3 data-i18n="misc.mission">Sứ Mệnh</h3>
            <p data-i18n="about.about.mission">Cung cấp nguyên liệu sạch, chất lượng cao cho ngành chăn nuôi và công nghiệp Việt Nam, góp phần phát triển nền nông nghiệp bền vững.</p>
          </div>
          
          <div class="vision-card" style="background-image: url('${visionBgImage}')">
            <div class="icon">
              <i class="fas fa-eye"></i>
            </div>
            <h3 data-i18n="misc.vision">Tầm Nhìn</h3>
            <p data-i18n="about.about.vision">Trở thành nhà cung cấp nguyên liệu hàng đầu tại Việt Nam và khu vực, được tin tưởng bởi chất lượng sản phẩm và dịch vụ chuyên nghiệp.</p>
          </div>
        </section> 
      </div>
    `;
  }

  renderFallback() {
    const section = document.querySelector('.about-page-section');
    if (!section) return;

    section.innerHTML = `
      <div class="about-container">
        <div class="about-hero">
          <h1 class="hero-title">Về VinPrime</h1>
          <p class="hero-subtitle">Cung cấp nguyên liệu sạch cho chăn nuôi và công nghiệp</p>
        </div>
        
        <section class="company-info-section">
          <h2 class="section-title">Thông Tin Công Ty</h2>
          <p>Đang tải thông tin...</p>
        </section>
      </div>
    `;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const aboutPage = new AboutPage();
  aboutPage.init();
});