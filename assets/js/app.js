// assets/js/app.js
(async function initApp() {
  try {
    console.log('🔄 App đang khởi động...');

    // 1. Hiển thị loading
    if (window.LoadingManager) {
      window.LoadingManager.showLoading();
    }
    // 2. KHỞI TẠO I18N TRƯỚC TIÊN
    if (window.i18n && typeof window.i18n.init === 'function') {
      console.log('🌐 Đang khởi tạo đa ngôn ngữ...');
      await window.i18n.init();
      console.log('✅ i18n đã khởi tạo');
    }
    // 2. Load header và footer
    console.log('📦 Đang tải header/footer...');
    const headerFooterLoaded = await renderHeaderFooter();

    if (!headerFooterLoaded) {
      console.warn('⚠️ Header/footer được tải với dữ liệu fallback');
    }

    // 3. Load nội dung trang
    console.log('📄 Đang tải nội dung trang...');
    await loadPageContent();

    // 4. Ẩn loading và hiển thị nội dung
    console.log('✅ Tải xong, ẩn loading...');
    setTimeout(() => {
      if (window.LoadingManager) {
        window.LoadingManager.hideLoading();
      }

      // 5. Kích hoạt animations
      applyAnim(); // Sử dụng animation system của bạn

      // Hoặc AOS nếu bạn muốn
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          once: true,
          offset: 100
        });
      }

      console.log('🚀 Ứng dụng đã sẵn sàng');
    }, 300);

  } catch (error) {
    console.error('❌ Lỗi khởi tạo ứng dụng:', error);

    // Vẫn hiển thị nội dung nếu có lỗi
    if (window.LoadingManager) {
      window.LoadingManager.hideLoading();
    }

    // Hiển thị nội dung thật (không cần loading)
    const realContent = document.querySelector('.real-content');
    if (realContent) {
      realContent.style.display = 'block';
    }

    applyAnim(); // Vẫn apply animations
  }
})();

// Load nội dung riêng của từng trang
async function loadPageContent() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  console.log(`📄 Trang hiện tại: ${page}`);

  switch (page) {
    case 'index.html':
    case '':
      if (typeof loadProducts === 'function') {
        await loadProducts();
      }
      break;

    case 'products.html':
      if (typeof loadAllProducts === 'function') {
        await loadAllProducts();
      }
      break;

    case 'contact.html':
      if (typeof loadContactPage === 'function') {
        await loadContactPage();
      }
      break;
  }
}

// Animation system
function applyAnim() {
  console.log('🎬 Đang áp dụng animations...');

  const items = document.querySelectorAll('[data-animate]');
  if (items.length === 0) {
    console.log('ℹ️ Không có elements với data-animate');
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        console.log(`✨ Animation cho: ${e.target.className || e.target.tagName}`);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(i => {
    io.observe(i);
    console.log(`👀 Đang theo dõi: ${i.className || i.tagName}`);
  });

  console.log(`✅ Đã áp dụng animation cho ${items.length} elements`);
}

// Xóa DOMContentLoaded event listener cũ
// Không cần vì initApp() đã chạy ngay