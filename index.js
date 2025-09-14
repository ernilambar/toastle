// Track active toasts for stacking.
const activeToasts = [];

const Toastle = options => {
  const { text = '', duration = 3000, type = 'success', top = 40 } = options;

  const notice = document.createElement('div');
  notice.className = 'toastle';
  notice.classList.add(`toastle-${type}`);
  notice.textContent = text;

  // Calculate position based on existing toasts.
  const toastHeight = 40; // Approximate height including margin.
  const spacing = 5;
  const currentTop = top + activeToasts.length * (toastHeight + spacing);

  notice.style.position = 'fixed';
  notice.style.top = `${currentTop}px`;
  notice.style.left = '50%';
  notice.style.transform = 'translateX(-50%)';
  notice.style.opacity = '0';
  notice.style.transition = 'opacity 0.5s ease, top 0.3s ease';

  document.body.appendChild(notice);
  activeToasts.push(notice);

  setTimeout(() => {
    notice.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    notice.style.opacity = '0';

    setTimeout(() => {
      // Remove from active toasts array.
      const index = activeToasts.indexOf(notice);
      if (index > -1) {
        activeToasts.splice(index, 1);
      }

      // Reposition remaining toasts.
      activeToasts.forEach((toast, i) => {
        const newTop = top + i * (toastHeight + spacing);
        toast.style.top = `${newTop}px`;
      });

      notice.remove();
    }, 500);
  }, duration);
};

module.exports = Toastle;
