// assets/js/renderHeaderFooter.js
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
            <button class="menu-toggle" aria-label="Mở menu">☰</button>
            <nav class="header-nav" aria-label="Menu chính">
              <ul>
                ${menu.map(item => `
                  <li${item.name === 'Hotline' ? ' class="phone"' : ''}>
                    <a href="${item.url}"${item.name === 'Hotline' ? ' aria-label="Gọi điện thoại"' : ''}>
                      ${item.name}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </nav>
            <div class="overlay" aria-hidden="true"></div>
          </div>
        </div>
      `;

      // Ẩn skeleton, hiện header thật
      header.querySelector('.header-loading').style.display = 'none';
      header.querySelector('.header-real').style.display = 'block';

      // Thêm mobile menu functionality
      setupMobileMenu();
    }

    // Render FOOTER
    // Trong renderHeaderFooter.js - phần render footer
    const footer = document.querySelector('footer');
    if (footer) {
      const currentYear = new Date().getFullYear();
      const social = site.social || {};

      footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-col footer-left"> 
        <h3>${site.siteName}</h3>
        <p>${site.address || 'Địa chỉ công ty'}</p>
        <p class="footer-tax">MST: ${site.taxCode || 'Đang cập nhật'}</p>
        
        <div class="footer-social">
          <h4>Kết nối với chúng tôi</h4>
          <div class="social-icons">
            ${social.facebook ? `
              <a href="${social.facebook}" target="_blank" rel="noopener noreferrer" 
                 class="social-icon facebook" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            ` : ''}
            
            ${social.zalo ? `
              <a href="${social.zalo}" target="_blank" rel="noopener noreferrer" 
                 class="social-icon zalo" aria-label="Zalo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-.8-1.6L6 13l1.2-.6L8 11l.8 1.6 1.2.6-1.2.6L8 15l-1.2.6L6 17l1.2-.6L8 17zm6 0l-1.2-.6L12 15l.8-1.6 1.2-.6-1.2-.6L12 11l-.8 1.6-1.2.6 1.2.6.8 1.6 1.2.6-1.2.6z"/>
                </svg>
              </a>
            ` : ''}
            
            ${social.youtube ? `
              <a href="${social.youtube}" target="_blank" rel="noopener noreferrer" 
                 class="social-icon youtube" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            ` : ''}
            
            <a href="mailto:${site.email}" class="social-icon email" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            
            <a href="tel:${site.phone}" class="social-icon phone" aria-label="Điện thoại">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-col footer-right">
        <h4>Thông tin liên hệ</h4>
        <p><strong>Hotline:</strong> <a href="tel:${site.phone}">${site.phone}</a></p>
        <p><strong>Email:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
        <p><strong>Giờ làm việc:</strong> ${site.workingHours || '08:00 - 17:00, Thứ 2 - Thứ 7'}</p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; ${currentYear} ${site.siteName}. Bảo lưu mọi quyền.</p>
        <div class="footer-bottom-links">
          <a href="privacy.html">Chính sách bảo mật</a>
          <a href="terms.html">Điều khoản sử dụng</a>
          <a href="sitemap.xml">Sơ đồ trang</a>
        </div>
      </div>
    </div>
  `;
    }

    return true;

  } catch (error) {
    console.error('Lỗi khi render header/footer:', error);

    // Hiển thị fallback header nếu có lỗi
    const header = document.querySelector('header');
    if (header) {
      header.innerHTML = `
        <div class="container header-inner">
          <a href="index.html" class="logo-link">
            <h2>VinPrime</h2>
          </a>
          <nav class="header-nav">
            <ul>
              <li><a href="index.html">Trang chủ</a></li>
              <li><a href="products.html">Sản phẩm</a></li>
              <li><a href="contact.html">Liên hệ</a></li>
            </ul>
          </nav>
        </div>
      `;
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
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.header-nav');
  const overlay = document.querySelector('.overlay');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

      // Đổi icon khi menu mở/đóng
      menuToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Đóng menu khi click overlay
    if (overlay) {
      overlay.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.textContent = '☰';
      });
    }

    // Đóng menu khi click vào link (trên mobile)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
          nav.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
          menuToggle.textContent = '☰';
        }
      });
    });
  }
}

// Expose globally
window.renderHeaderFooter = renderHeaderFooter;