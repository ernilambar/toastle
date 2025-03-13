const nsNotice = (message, noticeType = 'success', duration = 3000) => {
  const notice = document.createElement('div');

  notice.className = 'ns-notice';
  notice.classList.add(`ti-notice-${noticeType}`);

  notice.textContent = message;

  setTimeout(() => {
      notice.style.opacity = '1';
  }, 500);

  document.body.appendChild(notice);

  setTimeout(() => {
      notice.style.opacity = '0';

      setTimeout(() => {
          notice.remove();
      }, 500);
  }, duration);
};

module.exports = nsNotice;
