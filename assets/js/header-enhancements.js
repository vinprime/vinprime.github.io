// assets/js/header-enhancements.js
class HeaderEnhancer {
    constructor() {
        this.header = document.querySelector('header');
        this.navItems = document.querySelectorAll('.header-nav li');
        this.init();
    }

    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Active nav item
        this.setActiveNavItem();
        
        // Add hover effects
        this.addHoverEffects();
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        this.navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            const page = href.split('/').pop();
            
            // Remove all active classes
            item.classList.remove('active');
            
            // Set active based on current page
            if (page === currentPage) {
                item.classList.add('active');
            }
            
            // Homepage special case
            if (currentPage === 'index.html' && page === 'index.html') {
                item.classList.add('active');
            }
        });
    }

    addHoverEffects() {
        this.navItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            
            link.addEventListener('mouseenter', () => {
                if (!item.classList.contains('phone') && !item.classList.contains('cta')) {
                    item.classList.add('hover');
                }
            });
            
            link.addEventListener('mouseleave', () => {
                item.classList.remove('hover');
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('header')) {
        new HeaderEnhancer();
    }
});

// Expose globally
window.HeaderEnhancer = HeaderEnhancer;