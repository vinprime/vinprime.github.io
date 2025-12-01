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
    const footer = document.querySelector('footer');
    if (footer) {
      footer.innerHTML = `
        <div class="footer-loading skeleton-loading" style="display: none;">
          <div class="container">
            <div class="content-skeleton large skeleton-item skeleton-pulse"></div>
          </div>
        </div>
        <div class="footer-real">
          <div class="container footer-inner">
            <div class="footer-col footer-left">
              <a href="index.html" class="footer-logo-link">
                <img src="${site.logo}" alt="${site.company}" class="footer-logo" onerror="this.src='assets/images/fallback-logo.png'">
              </a>
              <h3>${site.company}</h3>
              <p>${site.address || 'Địa chỉ công ty'}</p>
            </div>
            <div class="footer-col footer-right">
              <h4>Liên hệ</h4>
              <p><strong>Hotline:</strong> <a href="tel:${site.phone}">${site.phone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="container">
              <p>&copy; ${new Date().getFullYear()} ${site.company}. All rights reserved.</p>
            </div>
          </div>
        </div>
      `;

      // Ẩn skeleton, hiện footer thật
      footer.querySelector('.footer-loading').style.display = 'none';
      footer.querySelector('.footer-real').style.display = 'block';
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