(() => {
  // Scroll reveal (same behavior as the original ScrollReveal component)
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('is-revealed'));
  } else {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-revealed'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10%', threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  // Desktop sticky feature stepper in #service
  const service = document.getElementById('service');
  if (!service) return;
  const steps = [...service.querySelectorAll('.lg\\:hidden > article')].map(a => ({
    num: a.querySelector('.font-mono').textContent,
    tag: a.querySelector('.mono-tag').textContent,
    title: a.querySelector('h4').textContent,
    desc: a.querySelector('p').textContent,
    img: a.querySelector('img').getAttribute('src'),
    alt: a.querySelector('img').getAttribute('alt'),
  }));
  const wrap = service.querySelector('.relative.hidden.lg\\:block');
  if (!wrap || !steps.length) return;
  const sticky = wrap.firstElementChild;
  const article = sticky.querySelector('article');
  const phone = sticky.querySelector('.w-\\[290px\\] > div');
  const phoneImg = phone.querySelector('img');
  const bar = sticky.querySelector('.origin-top');
  const nums = [...sticky.querySelectorAll('.flex-col.justify-between > span')];
  const footer = sticky.querySelector('.mt-7.flex');
  const footTag = footer.querySelector('.mono-tag');
  const footNum = footer.querySelector('.font-mono');
  [article, phone].forEach(el => el.style.transition = 'opacity .35s ease, transform .45s cubic-bezier(.22,1,.36,1)');
  steps.forEach(s => { const i = new Image(); i.src = s.img; });

  let current = 0;
  const render = idx => {
    const s = steps[idx];
    [article, phone].forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; });
    setTimeout(() => {
      article.querySelector('.font-mono').textContent = s.num;
      article.querySelector('.mono-tag').textContent = s.tag;
      article.querySelector('h4').textContent = s.title;
      article.querySelector('p').textContent = s.desc;
      phoneImg.src = s.img; phoneImg.alt = s.alt;
      footTag.textContent = s.tag;
      footNum.textContent = `${s.num} / ${String(steps.length).padStart(2, '0')}`;
      [article, phone].forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    }, 180);
    nums.forEach((n, i) => {
      n.classList.toggle('text-primary', i === idx);
      n.classList.toggle('text-muted-foreground', i !== idx);
    });
  };
  const onScroll = () => {
    const r = wrap.getBoundingClientRect();
    const total = r.height - sticky.offsetHeight;
    const prog = Math.min(1, Math.max(0, (80 - r.top) / (total || 1)));
    bar.style.transform = `scaleY(${prog})`;
    const idx = Math.min(steps.length - 1, Math.floor(prog * steps.length));
    if (idx !== current) { current = idx; render(idx); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
})();
