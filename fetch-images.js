(function() {
  const isRemoteUrl = url => typeof url === 'string' && /^https?:\/\//i.test(url);

  async function fetchBlob(url) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
      }
      return await response.blob();
    } catch (error) {
      console.warn('fetch-images.js:', error.message || error, url);
      return null;
    }
  }

  async function hydrateImage(img) {
    const src = img.dataset.fetchSrc;
    if (!isRemoteUrl(src)) return;
    const blob = await fetchBlob(src);
    if (!blob) return;
    img.src = URL.createObjectURL(blob);
  }

  async function hydrateBackground(element) {
    const src = element.dataset.bgSrc;
    if (!isRemoteUrl(src)) return;
    const blob = await fetchBlob(src);
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    const gradient = element.dataset.bgGradient || '';
    element.style.backgroundImage = gradient ? `${gradient}, url("${objectUrl}")` : `url("${objectUrl}")`;
  }

  async function init() {
    const images = Array.from(document.querySelectorAll('img[data-fetch-src]'));
    await Promise.all(images.map(hydrateImage));

    const bgElements = Array.from(document.querySelectorAll('[data-bg-src]'));
    await Promise.all(bgElements.map(hydrateBackground));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
