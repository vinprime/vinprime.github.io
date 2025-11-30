// Initialize animations and global behaviors
function applyAnim() {
  const items = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });

  items.forEach(i => io.observe(i));
}

window.addEventListener('DOMContentLoaded', () => {
  applyAnim();
});
