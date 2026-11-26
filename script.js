(() => {
  const config = window.MIRANIMA_CONFIG || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'メニューを開く');
    }));
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const contactLink = document.querySelector('#contact-link');
  const contactLabel = document.querySelector('#contact-label');
  const contactHint = document.querySelector('#contact-hint');
  if (config.contactEmail && contactLink) {
    contactLink.href = `mailto:${config.contactEmail}`;
    contactLink.setAttribute('aria-label', `メールでお問い合わせ: ${config.contactEmail}`);
    if (contactLabel) contactLabel.textContent = 'SEND AN EMAIL';
    if (contactHint) contactHint.textContent = config.contactEmail;
  }

  const supportLink = document.querySelector('.contact-support a');
  if (config.supportEmail && supportLink) {
    supportLink.href = `mailto:${config.supportEmail}`;
    supportLink.textContent = config.supportEmail;
  }

  if (config.siteUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = config.siteUrl.replace(/\/$/, '') + '/';
    const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = canonical.href;
    document.head.appendChild(ogUrl);
  }

  const niarimLink = document.querySelector('#niarim-link');
  if (config.niarimUrl && niarimLink) {
    niarimLink.href = config.niarimUrl;
    niarimLink.target = '_blank';
    niarimLink.rel = 'noopener noreferrer';
  }
  document.querySelectorAll('[data-niarim-legal-link]').forEach(link => {
    if (config.niarimLegalUrl) link.href = config.niarimLegalUrl;
  });
})();