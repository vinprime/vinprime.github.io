// assets/js/dataLoader.js
// Load JSON data used across pages
let cachedSiteData = null;
let cachedProductsData = null;
let cachedContactData = null;

async function loadSiteData() {
  if (cachedSiteData) {
    return cachedSiteData;
  }

  try {
    const [site, menu] = await Promise.all([
      fetch('assets/data/siteInfo.json').then(r => r.json()),
      fetch('assets/data/menu.json').then(r => r.json()),
      fetch('assets/data/about.json').then(r => r.json())
    ]);

    cachedSiteData = { site, menu };
    return cachedSiteData;
  } catch (e) {
    console.error('loadSiteData error', e);

    // Return fallback data để trang vẫn hiển thị được
    return {
      site: {
        logo: 'assets/images/logo.png',
        siteName: 'VinPrime',
        phone: '0123 456 789',
        email: 'info@vinprime.com',
        address: 'Địa chỉ công ty'
      },
      menu: [
        { name: 'Trang chủ', url: 'index.html' },
        { name: 'Sản phẩm', url: 'products.html' },
        { name: 'Về chúng tôi', url: 'about.html' },
        { name: 'Liên hệ', url: 'contact.html' },
        { name: 'Hotline', url: 'tel:0123456789' }
      ],
      about: {
        about: {
          title: "Về VinPrime",
          description: "Được thành lập vào tháng 3 năm 2023, với kiến thức tích lũy từ nhiều năm kinh nghiệm của các Nhà sáng lập, VIN PRIME ra đời để thực hiện sứ mệnh: Taking advantage of abundant locally available raw materials to create products used in livestock have global standard, develop economic and helps farmers increase production and income.",
          mission: "Taking advantage of abundant locally available raw materials to create products used in livestock have global standard.",
          vision: "Trở thành công ty hàng đầu trong lĩnh vực nguyên liệu chăn nuôi",
          established: "March 2023",
          foundersExperience: "nhiều năm kinh nghiệm"
        },
        stats: [
          {
            number: "1000+",
            label: "Khách hàng"
          },
          {
            number: "50+",
            label: "Đối tác"
          },
          {
            number: "5",
            label: "Tỉnh thành"
          },
          {
            number: "24/7",
            label: "Hỗ trợ"
          }
        ]
      }
    };
  }
}

async function loadProductsData() {
  if (cachedProductsData) {
    return cachedProductsData;
  }

  try {
    const products = await fetch('assets/data/products.json').then(r => r.json());
    cachedProductsData = products;
    return products;
  } catch (e) {
    console.error('loadProductsData error', e);

    // Fallback data
    return {
      featured: [],
      all: []
    };
  }
}

async function loadContactData() {
  if (cachedContactData) {
    return cachedContactData;
  }

  try {
    const contact = await fetch('assets/data/contact.json').then(r => r.json());
    cachedContactData = contact;
    return contact;
  } catch (e) {
    console.error('loadContactData error', e);

    // Fallback data
    return {
      phone: '0123 456 789',
      email: 'info@vinprime.com',
      address: 'Địa chỉ công ty',
      mapUrl: '#'
    };
  }
}


// expose globally
window.loadSiteData = loadSiteData;
window.loadProductsData = loadProductsData;
window.loadContactData = loadContactData; 