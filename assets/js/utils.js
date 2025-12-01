// ===== LOADING UTILITIES =====
class LoadingManager {
    constructor() {
        this.skeletons = document.querySelectorAll('.skeleton-loading');
        this.realContent = document.querySelector('.real-content');
        this.isLoaded = false;
    }

    // Hiển thị loading
    showLoading() {
        this.skeletons.forEach(skeleton => {
            skeleton.classList.add('active');
        });
        
        if (this.realContent) {
            this.realContent.style.display = 'none';
        }
    }

    // Ẩn loading và hiển thị nội dung thật
    hideLoading() {
        this.skeletons.forEach(skeleton => {
            skeleton.classList.remove('active');
        });
        
        if (this.realContent) {
            this.realContent.style.display = 'block';
        }
        
        this.isLoaded = true;
        
        // Kích hoạt animations sau khi load
        this.triggerAnimations();
    }

    // Kích hoạt animations (nếu dùng AOS hoặc custom)
    triggerAnimations() {
        // Nếu dùng AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Hoặc custom animations
        const animateElements = document.querySelectorAll('[data-animate]');
        animateElements.forEach(el => {
            el.classList.add('animated');
        });
    }

    // Hiển thị lỗi
    showError(message) {
        this.hideLoading();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'loading-error';
        errorDiv.innerHTML = `
            <div class="error-container">
                <h3>Đã xảy ra lỗi</h3>
                <p>${message || 'Không thể tải nội dung. Vui lòng thử lại sau.'}</p>
                <button onclick="location.reload()">Tải lại trang</button>
            </div>
        `;
        
        document.querySelector('main').prepend(errorDiv);
    }
}

// Khởi tạo loading manager
window.LoadingManager = new LoadingManager();