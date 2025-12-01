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
        <div class="about-container">
          <div class="about-content"> 
          <div class="about-header"> 
            <h2 data-i18n="about.about.title" class="about-title">VIN PRIME - SỨ MỆNH VÀ TẦM NHÌN</h2> 
          </div>
            <div class="about-description">
              <p data-i18n="about.about.description">VIN PRIME ra đời để thực hiện sứ mệnh...</p>
            </div>
          </div>
          
          <div class="about-image">
            <div class="image-placeholder">
              <img src="${aboutData.image_intro_src || '/assets/images/root/hero.jpg'}" alt='VinPrime'} 
                   onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\"image-fallback\"><i class=\"fas fa-industry\"></i><p>Hình ảnh về VinPrime</p></div>';">
              <div class="image-overlay">
                <div class="overlay-content">
                  <h3>TINH HOA TỪ NGUYÊN LIỆU VIỆT</h3>
                  <p>Chất lượng quốc tế - Giá trị địa phương</p>
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
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure dataLoader.js is loaded
  setTimeout(renderAboutSection, 100);
});

// Also run on window load
window.addEventListener('load', renderAboutSection);