// assets/js/pages/404.js
document.addEventListener('DOMContentLoaded', function() {
    // Search form handling
    const searchForm = document.getElementById('errorSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-input');
            const query = searchInput.value.trim();
            
            if (query) {
                // Redirect to search results page or products page
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Animate 404 numbers
    const digits = document.querySelectorAll('.digit');
    digits.forEach((digit, index) => {
        digit.style.animationDelay = `${index * 0.2}s`;
    });
});