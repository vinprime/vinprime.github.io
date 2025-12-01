// intro.js - Render about/intro section from site data
// Apply translations after render
function applyTranslations() {
  if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
    window.i18n.applyLanguage();
  }
}


// Function to render about section
async function renderAboutSection() {
  try {
    // Check if loadSiteData function exists
    if (typeof window.loadSiteData !== 'function') {
      console.error('loadSiteData function not found. Make sure dataLoader.js is loaded first.');
      return;
    }

    // Load site data from dataLoader.js
    const siteData = await window.loadSiteData();

    // Access about data from the structure
    const aboutData = siteData.about?.about || siteData.about; // Handle both structures
    const stats = siteData.about?.stats || siteData.stats || [];

    // Render intro/about section
    const introSection = document.querySelector('.intro');
    if (introSection && aboutData) {

      introSection.innerHTML = `
  <div class="about-section-wrapper" id="get-about">
    <div class="about-container">
      <div class="about-content">
        <div class="about-header">
          <div class="title-decoration"> 
            <h2 class="about-title" data-i18n="about.about.title">VIN PRIME - SỨ MỆNH VÀ TẦM NHÌN</h2>
          </div>
        </div>
        
        <div class="about-description">
          <p class="lead-text" data-i18n="about.about.description">VIN PRIME ra đời với sứ mệnh mang tinh hoa nguyên liệu Việt vươn tầm quốc tế...</p>
        </div>
      </div>
      
      <div class="about-image">
        <div class="image-card">
          <div class="image-wrapper">
            <div class="image-container">
              <img src="${aboutData.image_intro_src || '/assets/images/root/hero.jpg'}" 
                   alt="VinPrime - Giới thiệu công ty"
                   onerror="this.classList.add('image-error')">
            </div>
            
            <div class="image-overlay">
              <div class="overlay-content"> 
                <h3 data-i18n="about.about.image-overlay-title">TINH HOA TỪ NGUYÊN LIỆU VIỆT</h3>
                <p data-i18n="about.about.image-overlay-subtitle">Chất lượng quốc tế - Giá trị địa phương</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
      // Apply translations
      applyTranslations();
    }
  } catch (error) {
    console.error('Error rendering about section:', error);

    // Show error message in intro section
    const introSection = document.querySelector('.intro');
    if (introSection) {
      introSection.innerHTML = `
        <div class="error-message">
          <p>Đang tải thông tin về công ty...</p>
        </div>
      `;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Wait a bit to ensure dataLoader.js is loaded
  setTimeout(renderAboutSection, 100);
});

// Also run on window load
window.addEventListener('load', renderAboutSection);