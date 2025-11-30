// Dynamically render header and footer
async function renderHeaderFooter() {
  const data = await window.loadSiteData();
  if (!data) return;
  const { site, menu } = data;

  // HEADER
  const header = document.querySelector('header');
  header.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo-link">
        <img src="${site.logo}" alt="${site.siteName}" class="logo">
      </a>
      <nav class="nav">
        <ul>
          ${menu.map(i => `<li><a href="${i.url}">${i.name}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  `;

  // FOOTER
  const footer = document.querySelector('footer');
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-col footer-left">
        <img src="${site.logo}" alt="${site.siteName}" class="logo-sm">
        <p>${site.siteName}</p>
        <p>${site.address}</p>
      </div>
      <div class="footer-col footer-right">
        <h4>Liên hệ</h4>
        <p>Hotline: <a href="tel:${site.phone}">${site.phone}</a></p>
        <p>Email: <a href="mailto:${site.email}">${site.email}</a></p>
      </div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', renderHeaderFooter);
