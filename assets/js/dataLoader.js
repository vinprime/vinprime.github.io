// Load JSON data used across pages
async function loadSiteData() {
  try {
    const [site, menu] = await Promise.all([
      fetch('assets/data/siteInfo.json').then(r => r.json()),
      fetch('assets/data/menu.json').then(r => r.json())
    ]);
    return { site, menu };
  } catch (e) {
    console.error('loadSiteData error', e);
    return null;
  }
}

async function loadProductsData() {
  try {
    const products = await fetch('assets/data/products.json').then(r => r.json());
    return products;
  } catch (e) {
    console.error('loadProductsData', e);
    return [];
  }
}

async function loadContactData() {
  try {
    const contact = await fetch('assets/data/contact.json').then(r => r.json());
    return contact;
  } catch (e) {
    console.error('loadContactData', e);
    return null;
  }
}

// expose globally
window.loadSiteData = loadSiteData;
window.loadProductsData = loadProductsData;
window.loadContactData = loadContactData;
