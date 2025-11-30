// Simple router helper
function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

function navigateToProductDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

window.Router = {
  getQueryParam,
  navigateToProductDetail
};
/*  */