const Toastle = options => {
  const { text = '', duration = 3000, type = 'success', top = 40 } = options;

  const notice = document.createElement('div');
  notice.className = 'toastle';
  notice.classList.add(`toastle-${type}`);
  notice.textContent = text;

  notice.style.position = 'fixed';
  notice.style.top = `${top}px`;
  notice.style.left = '50%';
  notice.style.transform = 'translateX(-50%)';
  notice.style.opacity = '0';
  notice.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(notice);

  setTimeout(() => {
    notice.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    notice.style.opacity = '0';

    setTimeout(() => {
      notice.remove();
    }, 500);
  }, duration);
};

module.exports = Toastle;
