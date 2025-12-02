// assets/js/renderHeaderFooter.js

// ===== I18N HELPER FUNCTIONS =====
function getCurrentPage() {
  const path = window.location.pathname;
  let page = path.split('/').pop();

  // Handle root/homepage cases
  if (!page || page === '' || page === '/' || page === 'index.html') {
    return 'index.html';
  }

  // Ensure .html extension for consistency
  if (!page.includes('.html')) {
    page = page + '.html';
  }

  return page;
}

function isCurrentPage(itemUrl, currentPage) {
  if (!itemUrl) return;
  if (!currentPage) return;
  const itemPage = itemUrl.split('/').pop() || 'index.html';

  // Direct match
  if (itemPage === currentPage) {
    return true;
  }

  // Special case: homepage
  if (currentPage === 'index.html' && (itemUrl === '/' || itemUrl === '' || itemUrl === './')) {
    return true;
  }

  // Handle cases like "products" vs "products.html"
  if (currentPage.replace('.html', '') === itemPage.replace('.html', '')) {
    return true;
  }

  return false;
}

// Header scroll effects
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== I18N SUPPORT =====


// Apply translations after render
function applyTranslations() {
  if (window.i18n && typeof window.i18n.applyLanguage === 'function') {
    window.i18n.applyLanguage();
  }
}

async function renderHeaderFooter() {
  try {
    // Hiển thị skeleton loading cho header/footer
    const headerSkeleton = document.querySelector('.header-loading');
    const footerSkeleton = document.querySelector('.footer-loading');

    if (headerSkeleton) headerSkeleton.classList.add('active');
    if (footerSkeleton) footerSkeleton.classList.add('active');

    // Load data
    const data = await window.loadSiteData();
    if (!data) {
      throw new Error('Không thể tải thông tin trang web');
    }

    const { site, menu } = data;

    // Get current page for active state
    const currentPage = getCurrentPage();

    // Render HEADER
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = `
        <div class="header-loading skeleton-loading" style="display: none;">
          <div class="container">
            <div class="header-skeleton skeleton-item skeleton-pulse"></div>
          </div>
        </div>
        <div class="header-real">
          <div class="container header-inner">
            <a href="index.html" class="header-logo-link">
              <img src="${site.logo}" alt="${site.siteName}" class="header-logo" onerror="this.src='assets/images/fallback-logo.png'">
            </a>
            <button class="menu-toggle" aria-label="Mở menu" id="menuToggle" data-i18n="[aria-label]nav.menu">
              <span class="menu-icon"></span>
            </button>
            <nav class="header-nav" aria-label="Menu chính" id="mainNav">
              <ul>
                ${menu.map(item => { 
        const isActive = isCurrentPage(item.url, currentPage);

        let className = ''; 
        if (isActive) className += ' active';
        return `
                    <li${className.trim() ? ` class="${className.trim()}"` : ''}>
                      <a href="${item.url}"}>
                        <span data-i18n="${item.i18nKey}">${item.name}</span>
                      </a>
                    </li>
                  `;
      }).join('')}
              </ul>
            </nav>
            <div class="overlay" id="overlay" aria-hidden="true"></div>
          </div>
        </div>
      `;

      // Ẩn skeleton, hiện header thật
      header.querySelector('.header-loading').style.display = 'none';
      header.querySelector('.header-real').style.display = 'block';

      // Thêm mobile menu functionality
      setupMobileMenu();

      // Initialize header scroll effects
      initHeaderScroll();

      // Apply translations
      applyTranslations();
    }

    // Render FOOTER
    const footer = document.querySelector('footer');
    if (footer) {
      const currentYear = new Date().getFullYear();
      const social = site.social || {};

      footer.innerHTML = `
        <div class="container footer-inner">
          <div class="footer-col footer-left"> 
            <h3>${site.siteName}</h3>
            <p>${site.address || 'Địa chỉ công ty'}</p>
            <p class="footer-tax" data-i18n="footer.tax">MST: ${site.taxCode || 'Đang cập nhật'}</p>
            
            <div class="footer-social">
              <h4 data-i18n="footer.connect">Kết nối với chúng tôi</h4>
              <div class="social-icons">
                ${social.facebook ? `
                  <a href="${social.facebook}" target="_blank" rel="noopener noreferrer" 
                     class="social-icon facebook" aria-label="Facebook" data-i18n="[aria-label]social.facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                ` : ''}
                
                ${social.zalo ? `
                  <a href="${social.zalo}" target="_blank" rel="noopener noreferrer" 
                     class="social-icon zalo" aria-label="Zalo" data-i18n="[aria-label]social.zalo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-.8-1.6L6 13l1.2-.6L8 11l.8 1.6 1.2.6-1.2.6L8 15l-1.2.6L6 17l1.2-.6L8 17zm6 0l-1.2-.6L12 15l.8-1.6 1.2-.6-1.2-.6L12 11l-.8 1.6-1.2.6 1.2.6.8 1.6 1.2.6-1.2.6z"/>
                    </svg>
                  </a>
                ` : ''}
                
                ${social.youtube ? `
                  <a href="${social.youtube}" target="_blank" rel="noopener noreferrer" 
                     class="social-icon youtube" aria-label="YouTube" data-i18n="[aria-label]social.youtube">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                ` : ''}
                
                <a href="mailto:${site.email}" class="social-icon email" aria-label="Email" data-i18n="[aria-label]social.email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
                
                <a href="tel:${site.phone}" class="social-icon phone" aria-label="Điện thoại" data-i18n="[aria-label]social.phone">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div class="footer-col footer-right">
            <h4 data-i18n="footer.contact">Thông tin liên hệ</h4>
            <p><strong data-i18n="footer.hotline">Hotline:</strong> <a href="tel:${site.phone}">${site.phone}</a></p>
            <p><strong data-i18n="footer.email">Email:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
            <p><strong data-i18n="footer.workingHours">Giờ làm việc:</strong> ${site.workingHours || '08:00 - 17:00, Thứ 2 - Thứ 7'}</p>
             
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="container">
            <p>&copy; ${currentYear} ${site.siteName}. <span data-i18n="footer.rights">Bảo lưu mọi quyền</span>.</p>
            <div class="footer-bottom-links">
              <a href="privacy.html" data-i18n="footer.privacy">Chính sách bảo mật</a>
              <a href="terms.html" data-i18n="footer.terms">Điều khoản sử dụng</a>
              <a href="sitemap.xml" data-i18n="footer.sitemap">Sơ đồ trang</a>
            </div>
          </div>
        </div>
      `;

      // Apply translations for footer
      applyTranslations();
    }

    return true;

  } catch (error) {
    console.error('Lỗi khi render header/footer:', error);
    // Hiển thị fallback header nếu có lỗi
    const header = document.querySelector('header');
    if (header) {
      const currentPage = getCurrentPage();

      header.innerHTML = `
        <div class="container header-inner">
          <a href="index.html" class="header-logo-link">
            <div class="header-logo-fallback">
              <span style="color: var(--primary-color); font-weight: 800; font-size: 24px;">VIN</span>
              <span style="color: #222; font-weight: 800; font-size: 24px;">PRIME</span>
            </div>
          </a>
          <nav class="header-nav">
            <ul>
              <li${currentPage === 'index.html' ? ' class="active"' : ''}>
                <a href="index.html" data-i18n="nav.home">Trang chủ</a>
              </li>
              <li${currentPage === 'products.html' ? ' class="active"' : ''}>
                <a href="products.html" data-i18n="nav.products">Sản phẩm</a>
              </li>
              <li${currentPage === 'about.html' ? ' class="active"' : ''}>
                <a href="about.html" data-i18n="nav.about">Giới thiệu</a>
              </li>
              <li${currentPage === 'contact.html' ? ' class="active"' : ''}>
                <a href="contact.html" data-i18n="nav.contact">Liên hệ</a>
              </li> 
            </ul>
          </nav>
        </div>
      `;

      applyTranslations();
    }

    // Fallback footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = `
        <div class="container footer-inner">
          <div class="footer-col footer-left">
            <h3>VinPrime Co., Ltd</h3>
            <p data-i18n="footer.description">Chuyên cung cấp nguyên liệu sạch cho chăn nuôi</p>
            <p class="footer-tax" data-i18n="footer.tax">MST: Đang cập nhật</p>
          </div>
          
          <div class="footer-col footer-right">
            <h4 data-i18n="footer.contact">Liên hệ</h4>
            <p><strong data-i18n="footer.hotline">Hotline:</strong> <a href="tel:0123456789">0123 456 789</a></p>
            <p><strong data-i18n="footer.email">Email:</strong> <a href="mailto:info@vinprime.com">info@vinprime.com</a></p>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="container">
            <p>&copy; ${new Date().getFullYear()} VinPrime. <span data-i18n="footer.rights">All rights reserved</span>.</p>
          </div>
        </div>
      `;

      applyTranslations();
    }

    // Ẩn skeleton loading
    document.querySelectorAll('.skeleton-loading').forEach(el => {
      el.style.display = 'none';
    });

    return false;
  }
}

// Mobile menu functionality
function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('overlay');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isActive = nav.classList.contains('active');

      nav.classList.toggle('active');
      overlay?.classList.toggle('active');
      menuToggle.classList.toggle('active');

      // Đổi icon
      const menuIcon = menuToggle.querySelector('.menu-icon');

      // Khóa scroll body khi menu mở
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Đóng menu khi click overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
        const menuIcon = menuToggle.querySelector('.menu-icon');
        if (menuIcon) {
          menuIcon.textContent = '';
        }
        document.body.style.overflow = '';
      });
    }

    // Đóng menu khi click vào link (trên mobile)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
          // Không đóng menu nếu là anchor link hoặc tel: link
          const href = link.getAttribute('href');
          if (href?.startsWith('#') || href?.startsWith('tel:')) {
            return;
          }

          nav.classList.remove('active');
          overlay?.classList.remove('active');
          menuToggle.classList.remove('active');
          const menuIcon = menuToggle.querySelector('.menu-icon');
          if (menuIcon) {
            menuIcon.textContent = '';
          }
          document.body.style.overflow = '';
        }
      });
    });

    // Đóng menu khi resize về desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        nav.classList.remove('active');
        overlay?.classList.remove('active');
        menuToggle.classList.remove('active');
        const menuIcon = menuToggle.querySelector('.menu-icon');
        if (menuIcon) {
          menuIcon.textContent = '';
        }
        document.body.style.overflow = '';
      }
    });
  }
}

// Expose globally
window.renderHeaderFooter = renderHeaderFooter;
window.getCurrentPage = getCurrentPage;
window.setupMobileMenu = setupMobileMenu;
window.applyTranslations = applyTranslations; 