// Full figures remain ordinary image links when JavaScript is unavailable.
const figureDialog = document.querySelector('.figure-dialog');
const figureImage = figureDialog.querySelector('.dialog-image');
const figureCaption = figureDialog.querySelector('#figure-caption');
const figureSource = figureDialog.querySelector('.figure-source');

if (typeof figureDialog.showModal === 'function') {
  document.querySelectorAll('[data-figure]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      figureImage.src = link.href;
      figureImage.alt = link.querySelector('img').alt;
      figureCaption.textContent = link.dataset.caption;
      figureSource.href = link.dataset.source;
      figureDialog.showModal();
    });
  });
  figureDialog.querySelector('.dialog-close').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', (event) => {
    const bounds = figureDialog.getBoundingClientRect();
    if (event.target === figureDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
      figureDialog.close();
    }
  });
}
