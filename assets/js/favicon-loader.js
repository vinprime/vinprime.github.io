// favicon-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const favicons = `
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-96x96.png">
        <meta name="theme-color" content="#ffffff">
    `;
    document.head.insertAdjacentHTML('beforeend', favicons);
});