const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
document.getElementById('year').textContent = new Date().getFullYear();

// Shared gallery: the Discord bot writes clips to the site's API.
(async () => {
  const grid = document.getElementById('clip-grid');
  const empty = document.getElementById('clips-empty');
  const count = document.getElementById('clip-count');
  if (!grid || !empty || !count) return;

  function makeClipCard(clip, index) {
    const card = document.createElement('article');
    card.className = 'clip-card';

    const head = document.createElement('div');
    head.className = 'clip-card-head';
    const label = document.createElement('span');
    label.textContent = 'FATALITY // HIGHLIGHT';
    const number = document.createElement('span');
    number.textContent = `CLIP ${String(index + 1).padStart(2, '0')}`;
    head.append(label, number);

    const frame = document.createElement('div');
    frame.className = 'clip-frame';
    const iframe = document.createElement('iframe');
    iframe.src = clip.embedUrl;
    iframe.title = 'Klip FATALITY z Medal.tv';
    iframe.loading = 'lazy';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);

    const foot = document.createElement('div');
    foot.className = 'clip-card-foot';
    const open = document.createElement('a');
    open.href = clip.url;
    open.target = '_blank';
    open.rel = 'noopener noreferrer';
    open.textContent = 'OTWÓRZ NA MEDAL.TV ↗';
    foot.appendChild(open);

    card.append(head, frame, foot);
    return card;
  }

  async function loadClips() {
    try {
      const response = await fetch('/api/clips', { cache: 'no-store' });
      if (!response.ok) throw new Error('API unavailable');
      const clips = await response.json();
      grid.querySelectorAll('.clip-card').forEach(card => card.remove());
      count.textContent = String(clips.length).padStart(2, '0');
      empty.hidden = clips.length > 0;
      clips.forEach((clip, index) => grid.appendChild(makeClipCard(clip, index)));
    } catch (error) {
      count.textContent = '—';
      empty.hidden = false;
      empty.querySelector('strong').textContent = 'GALERIA NIEDOSTĘPNA';
      empty.querySelector('span:last-child').textContent =
        'Serwer galerii nie jest jeszcze uruchomiony. Skonfiguruj bota Discord zgodnie z instrukcją w paczce strony.';
    }
  }

  await loadClips();
  // Refresh automatically when new links are posted in the Discord channel.
  window.setInterval(loadClips, 30000);
})();
