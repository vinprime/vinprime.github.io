// assets/js/utils.js

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
const loadingManager = new LoadingManager();

 
// ===== EXPORT LOADING FUNCTIONS =====
export const showLoading = () => {
    loadingManager.showLoading();
};

export const hideLoading = () => {
    loadingManager.hideLoading();
};

export const showError = (message) => {
    loadingManager.showError(message);
};

// ===== OTHER UTILITIES =====
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const isMobile = () => {
    return window.innerWidth <= 768;
};

export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Thêm loading screen cho toàn bộ trang
    if (!document.querySelector('.skeleton-loading')) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const skeletonDiv = document.createElement('div');
            skeletonDiv.className = 'skeleton-loading active';
            skeletonDiv.innerHTML = `
                <div class="skeleton-item skeleton-pulse" style="height: 300px; margin-bottom: 20px;"></div>
                <div class="skeleton-item skeleton-pulse" style="height: 20px; width: 80%; margin-bottom: 10px;"></div>
                <div class="skeleton-item skeleton-pulse" style="height: 20px; width: 60%; margin-bottom: 10px;"></div>
            `;
            mainContent.prepend(skeletonDiv);
        }
    }
    
    // Ẩn loading sau khi tất cả nội dung đã load
    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLoading();
        }, 500);
    });
});