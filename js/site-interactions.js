// js/site-interactions.js
// Menu toggle (mobile) + copy to clipboard + reveal on scroll
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    // Menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const links = document.getElementById('links');
    if (menuBtn && links) {
      menuBtn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // Close menu with Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && links.classList.contains('open')) {
          links.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
          menuBtn.focus();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!links.contains(e.target) && !menuBtn.contains(e.target) && links.classList.contains('open')) {
          links.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Copy button
    document.querySelectorAll('.copy').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const text = btn.dataset.copy || btn.getAttribute('data-copy') || btn.textContent || '';
        let previous = btn.textContent;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            // fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          btn.classList.add('copied');
          btn.textContent = 'Copiato!';
        } catch (err) {
          console.warn('Copy failed', err);
          btn.textContent = 'Errore';
        }
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = previous;
        }, 1400);
      });
    });

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('in'));
    } else if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(el => obs.observe(el));
    } else {
      // fallback
      revealEls.forEach(el => el.classList.add('in'));
    }

    // Add .js class to body to enable JS-driven styles
    document.documentElement.classList.add('js');
  });
})();
